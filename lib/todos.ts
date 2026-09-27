import { todoService } from '@/services/todoService';
import { Todo } from '@/types/todo';

/**
 * Mengambil daftar todo milik user yang sedang login dari Backend Express
 */
export async function getTodos(): Promise<Todo[]> {
  try {
    const response = await todoService.fetchTodos({ page: 1, perPage: 50 });
    const list = response.data || [];
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
    console.error('[lib/todos.ts] Gagal mengambil data todos dari Backend:', error);
    return [];
  }
}

/**
 * Mengambil detail 1 todo berdasarkan ID dari Backend Express
 */
export async function getTodoDetail(id: string | number): Promise<Todo | null> {
  try {
    const response = await todoService.fetchTodoById(id);
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
