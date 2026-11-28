import apiClient, { API_BASE_URL } from '@/services/apiClient';
import type {
  AICitation,
  AIConfigPayload,
  AIConversation,
  AIDocument,
  AIMessage,
  AIProviderConfig,
  AIStatus,
  AIUsageSummary,
} from '@/features/ai/types/ai';

export interface StreamHandlers {
  onMeta?: (meta: {
    conversation_id: number;
    conversation_title: string;
    provider: string;
    model: string;
    citations?: AICitation[];
  }) => void;
  onDelta?: (text: string) => void;
  onToolCall?: (tool: { name: string; arguments: Record<string, unknown> }) => void;
  onDone?: (done: {
    conversation_id: number;
    message_id: number;
    total_tokens: number;
    latency_ms: number;
  }) => void;
  onError?: (err: { code: string; message: string }) => void;
}

export const aiService = {
  async getStatus(): Promise<AIStatus> {
    const res = await apiClient.get<AIStatus>('/ai/status');
    return res.data;
  },

  async sendMessage(payload: {
    message: string;
    conversation_id?: number | null;
    provider?: string;
    model?: string;
  }): Promise<{ conversation_id: number; conversation_title: string; message: AIMessage }> {
    const res = await apiClient.post<{
      conversation_id: number;
      conversation_title: string;
      message: AIMessage;
    }>('/ai/chat', payload);
    return res.data;
  },

  async streamMessage(
    payload: {
      message: string;
      conversation_id?: number | null;
      provider?: string;
      model?: string;
    },
    handlers: StreamHandlers,
    signal?: AbortSignal
  ): Promise<void> {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
    const response = await fetch(`${API_BASE_URL}/ai/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      let detail = `AI request failed (${response.status})`;
      try {
        const json = await response.json();
        detail = json?.message || json?.detail || detail;
      } catch {
        // Ignore parse error
      }
      throw new Error(detail);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Streaming is not supported by this browser.');
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const frames = buffer.split('\n\n');
      buffer = frames.pop() ?? '';

      for (const frame of frames) {
        const lines = frame.split('\n');
        let eventName = 'message';
        const dataLines: string[] = [];
        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventName = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            dataLines.push(line.slice(5).trim());
          }
        }
        if (!dataLines.length) continue;
        try {
          const parsed = JSON.parse(dataLines.join('\n'));
          if (eventName === 'meta') handlers.onMeta?.(parsed);
          else if (eventName === 'delta') handlers.onDelta?.(parsed.text || '');
          else if (eventName === 'tool_call') handlers.onToolCall?.(parsed);
          else if (eventName === 'done') handlers.onDone?.(parsed);
          else if (eventName === 'error') handlers.onError?.(parsed);
        } catch {
          // Skip malformed SSE frame
        }
      }
    }
  },

  async listConversations(search?: string): Promise<AIConversation[]> {
    const res = await apiClient.get<AIConversation[]>('/ai/conversations', {
      params: search ? { search } : undefined,
    });
    return res.data;
  },

  async getMessages(conversationId: number): Promise<AIMessage[]> {
    const res = await apiClient.get<AIMessage[]>(`/ai/conversations/${conversationId}/messages`);
    return res.data;
  },

  async updateConversation(
    conversationId: number,
    data: Partial<Pick<AIConversation, 'title' | 'is_pinned' | 'is_archived'>>
  ): Promise<AIConversation> {
    const res = await apiClient.patch<AIConversation>(`/ai/conversations/${conversationId}`, data);
    return res.data;
  },

  async deleteConversation(conversationId: number): Promise<void> {
    await apiClient.delete(`/ai/conversations/${conversationId}`);
  },

  async submitFeedback(messageId: number, rating: 'positive' | 'negative', comment?: string): Promise<void> {
    await apiClient.post(`/ai/messages/${messageId}/feedback`, { rating, comment });
  },

  async getConfig(): Promise<AIConfigPayload> {
    const res = await apiClient.get<AIConfigPayload>('/ai/config');
    return res.data;
  },

  async updateConfig(payload: Partial<AIProviderConfig>): Promise<AIProviderConfig> {
    const res = await apiClient.put<AIProviderConfig>('/ai/config', payload);
    return res.data;
  },

  async getUsage(): Promise<AIUsageSummary> {
    const res = await apiClient.get<AIUsageSummary>('/ai/usage');
    return res.data;
  },

  async listDocuments(): Promise<AIDocument[]> {
    const res = await apiClient.get<AIDocument[]>('/ai/documents');
    return res.data;
  },

  async uploadDocument(formData: FormData): Promise<AIDocument> {
    const res = await apiClient.post<AIDocument>('/ai/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async deleteDocument(documentId: number): Promise<void> {
    await apiClient.delete(`/ai/documents/${documentId}`);
  },
};
