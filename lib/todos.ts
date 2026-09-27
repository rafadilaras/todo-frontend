import { cookies } from 'next/headers';
import { todoService } from '@/services/todoService';
import { Todo } from '@/types/todo';

async function getAuthHeader(): Promise<Record<string, string> | undefined> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch {
    // Fallback jika dipanggil di luar server component context
  }
  return undefined;
}

/**
 * Mengambil daftar todo milik user yang sedang login dari Backend Express
 */
export async function getTodos(): Promise<Todo[]> {
  try {
    const authHeaders = await getAuthHeader();
    const response = await todoService.fetchTodos({ page: 1, perPage: 50 }, authHeaders);
    const list = Array.isArray(response.data) ? response.data : [];
    return list.map((item) => ({
      id: item.id,
      title: item.todo,
      description: 'Tugas tersimpan di database MySQL backend.',
      completed: item.completed,
      createdAt: response.meta?.timestamp
        ? new Date(response.meta.timestamp).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : new Date().toLocaleDateString('id-ID'),
    }));
  } catch (error) {
    console.warn('[lib/todos.ts] Info: Daftar tugas kosong atau gagal dimuat dari backend:', error);
    return [];
  }
}

/**
 * Mengambil detail 1 todo berdasarkan ID dari Backend Express
 */
export async function getTodoDetail(id: string | number): Promise<Todo | null> {
  try {
    const authHeaders = await getAuthHeader();
    const response = await todoService.fetchTodoById(id, authHeaders);
    if (!response.data) return null;
    const item = response.data;
    return {
      id: item.id,
      title: item.todo,
      description: 'Tugas terdaftar di database MySQL backend.',
      completed: item.completed,
      createdAt: response.meta?.timestamp
        ? new Date(response.meta.timestamp).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : new Date().toLocaleDateString('id-ID'),
    };
  } catch (error) {
    console.error(`[lib/todos.ts] Gagal mengambil detail todo ID ${id}:`, error);
    return null;
  }
}
