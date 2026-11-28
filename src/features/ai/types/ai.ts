export interface AIQuotaInfo {
  tokens_used_today: number;
  daily_token_limit: number;
  remaining_tokens_today: number;
}

export interface AIStatus {
  enabled: boolean;
  server_enabled: boolean;
  org_enabled: boolean;
  has_credentials: boolean;
  active_provider: string;
  active_model: string;
  allow_general_chat: boolean;
  allow_rag: boolean;
  allow_tools: boolean;
  quota: AIQuotaInfo;
  available_tools: string[];
}

export interface AICitation {
  document_id: number;
  title: string;
  category: string;
  chunk_index: number;
  score: number;
}

export interface AIToolCallRecord {
  name: string;
  arguments: Record<string, unknown>;
  result?: Record<string, unknown>;
}

export interface AIMessage {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  provider?: string | null;
  model?: string | null;
  tool_calls?: AIToolCallRecord[] | null;
  citations?: AICitation[] | null;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  latency_ms?: number | null;
  status: string;
  created_at: string;
}

export interface AIConversation {
  id: number;
  title: string;
  is_pinned: boolean;
  is_archived: boolean;
  provider?: string | null;
  model?: string | null;
  last_message_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIProviderConfig {
  organization_id: number;
  active_provider: string;
  active_model: string;
  embedding_model: string;
  is_enabled: boolean;
  allow_general_chat: boolean;
  allow_rag: boolean;
  allow_tools: boolean;
  max_tokens_per_request: number;
  daily_user_token_limit: number;
  temperature: number;
}

export interface AIProviderCatalogEntry {
  label: string;
  implemented: boolean;
  default_model: string;
  models?: string[];
  embedding_models?: string[];
  has_credentials: boolean;
}

export interface AIConfigPayload {
  config: AIProviderConfig;
  providers: Record<string, AIProviderCatalogEntry>;
  server_ai_enabled: boolean;
}

export interface AIUsageSummary {
  total_requests: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  recent_audits: Array<{
    id: number;
    user_id: number;
    action: string;
    tool_name?: string | null;
    output_status: string;
    created_at: string;
  }>;
}

export interface AIDocument {
  id: number;
  title: string;
  filename: string;
  content_type: string;
  category: string;
  visibility: 'organization' | 'hr_admin' | 'private';
  status: string;
  chunk_count: number;
  file_size_bytes: number;
  created_at: string;
}
