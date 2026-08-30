/**
 * services/todoService.ts
 * 
 * Layer 1 (Spesifik): Todo Service Layer.
 * 
 * Bertanggung jawab menangani semua request network spesifik untuk resource 'todos' di DummyJSON.
 */

import { apiClient } from './api';
import { ApiTodo, TodosApiResponse } from '@/types/api-todo';

export interface FetchTodosParams {
  limit?: number;
  skip?: number;
}

export interface CreateTodoInput {
  todo: string;
  completed: boolean;
  userId: number;
}

export const todoService = {
  /**
   * Mengambil daftar todos dari DummyJSON
   * Endpoint: GET https://dummyjson.com/todos?limit=30&skip=0
   */
  async fetchTodos(params: FetchTodosParams = { limit: 15, skip: 0 }): Promise<TodosApiResponse> {
    const { limit = 15, skip = 0 } = params;
    return apiClient<TodosApiResponse>(`/todos?limit=${limit}&skip=${skip}`);
  },

  /**
   * Mengambil detail satu todo berdasarkan ID
   * Endpoint: GET https://dummyjson.com/todos/{id}
   */
  async fetchTodoById(id: number | string): Promise<ApiTodo> {
    return apiClient<ApiTodo>(`/todos/${id}`);
  },

  /**
   * Menambahkan todo baru (Simulasi DummyJSON API)
   * Endpoint: POST https://dummyjson.com/todos/add
   */
  async createTodo(payload: CreateTodoInput): Promise<ApiTodo> {
    return apiClient<ApiTodo>('/todos/add', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Mengubah status completion todo (Simulasi DummyJSON API)
   * Endpoint: PATCH/PUT https://dummyjson.com/todos/{id}
   */
  async updateTodoStatus(id: number | string, completed: boolean): Promise<ApiTodo> {
    return apiClient<ApiTodo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    });
  },

  /**
   * Menghapus todo (Simulasi DummyJSON API)
   * Endpoint: DELETE https://dummyjson.com/todos/{id}
   */
  async deleteTodo(id: number | string): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> {
    return apiClient<{ id: number; isDeleted: boolean; deletedOn: string }>(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};
