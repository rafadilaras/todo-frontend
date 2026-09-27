import { apiClient, ApiError } from './api';
import type { BackendResponse, TodoItem } from '@/types/api';

export interface FetchTodosParams {
  page?: number;
  perPage?: number;
  limit?: number;
  skip?: number;
}

export interface CreateTodoInput {
  task?: string;
  todo?: string;
  completed?: boolean;
  userId?: number;
}

export interface UpdateTodoInput {
  task?: string;
  is_completed?: boolean;
  completed?: boolean;
}

export const todoService = {
  /**
   * Mengambil daftar todo milik user (dengan paginasi)
   */
  async fetchTodos(params: FetchTodosParams = {}, headers?: HeadersInit): Promise<BackendResponse<TodoItem[]>> {
    const page = params.page ?? (params.skip !== undefined && params.limit ? Math.floor(params.skip / params.limit) + 1 : 1);
    const perPage = params.perPage ?? params.limit ?? 10;
    try {
      const response = await apiClient<TodoItem[]>(`/todos?page=${page}&perPage=${perPage}`, {
        headers,
      });
      return {
        ...response,
        data: Array.isArray(response.data) ? response.data : [],
      };
    } catch (err) {
      // Jika backend me-return 404 (anggap task belum ada/kosong), kembalikan array kosong
      if (err instanceof ApiError && err.status === 404) {
        return {
          success: true,
          data: [],
          message: 'Belum ada data tugas.',
          meta: { timestamp: new Date().toISOString() },
        };
      }
      throw err;
    }
  },

  /**
   * Mengambil detail satu todo berdasarkan ID
   */
  async fetchTodoById(id: number | string, headers?: HeadersInit): Promise<BackendResponse<TodoItem>> {
    return apiClient<TodoItem>(`/todos/${id}`, {
      headers,
    });
  },

  /**
   * Membuat todo baru di backend
   */
  async createTodo(payload: CreateTodoInput): Promise<BackendResponse<TodoItem>> {
    const task = payload.task || payload.todo || '';
    return apiClient<TodoItem>('/todos', {
      method: 'POST',
      body: JSON.stringify({ task }),
    });
  },

  /**
   * Mengubah task atau status selesai todo
   */
  async updateTodo(id: number | string, payload: UpdateTodoInput): Promise<BackendResponse<unknown>> {
    const body: Record<string, unknown> = {};
    if (payload.task !== undefined) body.task = payload.task;
    if (payload.is_completed !== undefined) body.is_completed = payload.is_completed;
    else if (payload.completed !== undefined) body.is_completed = payload.completed;

    return apiClient(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * Helper toggle status selesai (backward compatibility)
   */
  async updateTodoStatus(id: number | string, completed: boolean): Promise<BackendResponse<unknown>> {
    return this.updateTodo(id, { is_completed: completed });
  },

  /**
   * Menghapus todo berdasarkan ID
   */
  async deleteTodo(id: number | string): Promise<BackendResponse<unknown>> {
    return apiClient(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};
