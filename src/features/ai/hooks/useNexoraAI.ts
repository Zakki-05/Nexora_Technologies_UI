'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { aiService } from '@/features/ai/services/aiService';
import type {
  AICitation,
  AIConversation,
  AIMessage,
  AIStatus,
  AIToolCallRecord,
} from '@/features/ai/types/ai';

export function useNexoraAI() {
  const [status, setStatus] = useState<AIStatus | null>(null);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingTools, setStreamingTools] = useState<AIToolCallRecord[]>([]);
  const [streamingCitations, setStreamingCitations] = useState<AICitation[]>([]);

  const abortRef = useRef<AbortController | null>(null);

  const refreshStatus = useCallback(async () => {
    try {
      const data = await aiService.getStatus();
      setStatus(data);
    } catch {
      setStatus(null);
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  const refreshConversations = useCallback(async (search?: string) => {
    try {
      const list = await aiService.listConversations(search);
      setConversations(list);
    } catch {
      // Keep existing list on transient error
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    refreshConversations(searchQuery);
  }, [refreshConversations, searchQuery]);

  const selectConversation = useCallback(async (conversationId: number | null) => {
    setActiveConversationId(conversationId);
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setIsLoadingMessages(true);
    try {
      const list = await aiService.getMessages(conversationId);
      setMessages(list);
    } catch {
      toast.error('Failed to load conversation messages.');
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const startNewConversation = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamingContent('');
    setStreamingTools([]);
    setStreamingCitations([]);
    setActiveConversationId(null);
    setMessages([]);
  }, []);

  const stopGenerating = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const optimisticUserMsg: AIMessage = {
        id: -Date.now(),
        conversation_id: activeConversationId || 0,
        role: 'user',
        content: trimmed,
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        status: 'completed',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticUserMsg]);
      setIsStreaming(true);
      setStreamingContent('');
      setStreamingTools([]);
      setStreamingCitations([]);

      const controller = new AbortController();
      abortRef.current = controller;
      let resolvedConvId = activeConversationId;

      try {
        await aiService.streamMessage(
          { message: trimmed, conversation_id: activeConversationId },
          {
            onMeta: (meta) => {
              resolvedConvId = meta.conversation_id;
              setActiveConversationId(meta.conversation_id);
              if (meta.citations?.length) {
                setStreamingCitations(meta.citations);
              }
            },
            onToolCall: (tool) => {
              setStreamingTools((prev) => [...prev, tool]);
            },
            onDelta: (delta) => {
              setStreamingContent((prev) => prev + delta);
            },
            onError: (err) => {
              toast.error(err.message || 'AI response failed.');
            },
          },
          controller.signal
        );

        if (resolvedConvId) {
          const freshMessages = await aiService.getMessages(resolvedConvId);
          setMessages(freshMessages);
          await refreshConversations(searchQuery);
        }
        await refreshStatus();
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error((err as Error).message || 'Unable to reach Nexora Copilot.');
        }
      } finally {
        setIsStreaming(false);
        setStreamingContent('');
        setStreamingTools([]);
        setStreamingCitations([]);
        abortRef.current = null;
      }
    },
    [activeConversationId, isStreaming, refreshConversations, refreshStatus, searchQuery]
  );

  const regenerateLast = useCallback(async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      await sendMessage(lastUser.content);
    }
  }, [messages, sendMessage]);

  const renameConversation = useCallback(
    async (conversationId: number, title: string) => {
      const updated = await aiService.updateConversation(conversationId, { title });
      setConversations((prev) => prev.map((c) => (c.id === conversationId ? updated : c)));
    },
    []
  );

  const togglePinConversation = useCallback(async (conv: AIConversation) => {
    const updated = await aiService.updateConversation(conv.id, { is_pinned: !conv.is_pinned });
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? updated : c)));
  }, []);

  const deleteConversation = useCallback(
    async (conversationId: number) => {
      await aiService.deleteConversation(conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (activeConversationId === conversationId) {
        startNewConversation();
      }
    },
    [activeConversationId, startNewConversation]
  );

  const submitFeedback = useCallback(async (messageId: number, rating: 'positive' | 'negative') => {
    if (messageId <= 0) return;
    await aiService.submitFeedback(messageId, rating);
    toast.success(rating === 'positive' ? 'Feedback recorded!' : 'Thanks for the feedback.');
  }, []);

  const exportConversationMarkdown = useCallback(() => {
    if (!messages.length) return;
    const conv = conversations.find((c) => c.id === activeConversationId);
    const title = conv?.title || 'Nexora Copilot Conversation';
    const md = [
      `# ${title}`,
      '',
      ...messages.map((m) => `### ${m.role === 'user' ? 'You' : 'Nexora Copilot'}\n\n${m.content}\n`),
    ].join('\n');
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeConversationId, conversations, messages]);

  return {
    status,
    conversations,
    activeConversationId,
    messages,
    searchQuery,
    setSearchQuery,
    isLoadingStatus,
    isLoadingMessages,
    isStreaming,
    streamingContent,
    streamingTools,
    streamingCitations,
    selectConversation,
    startNewConversation,
    stopGenerating,
    sendMessage,
    regenerateLast,
    renameConversation,
    togglePinConversation,
    deleteConversation,
    submitFeedback,
    exportConversationMarkdown,
    refreshStatus,
  };
}
