export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  status_code: number;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiErrorShape {
  success?: boolean;
  message?: string;
  detail?: string;
  status_code?: number;
  data?: Record<string, unknown>;
}
