export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ResponseMeta {
  timestamp: string;
  pagination?: PaginationMeta;
}

export interface BackendResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta: ResponseMeta;
}

export interface LoginResponseData {
  token: string;
}

export interface TodoItem {
  id: number;
  todo: string;
  completed: boolean;
}
