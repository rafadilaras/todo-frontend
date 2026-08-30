/**
 * lib/tasks.ts
 * 
 * Layer 3: Business Logic, Adapter & Helper Functions.
 * 
 * Mengapa kita butuh folder 'lib'?
 * 1. Adapter/Transformer: Mengubah format data mentah dari API luar (misal: 'todo' dari DummyJSON)
 *    menjadi format data internal aplikasi kita ('title').
 * 2. Logika Bisnis & Helper: Fungsi pengolahan data, penghitungan statistik, filter, sorting,
 *    dan error fallback sebelum dikonsumsi oleh UI atau API Routes.
 */

import { todoService, FetchTodosParams } from '@/services/todoService';
import { ApiTodo, TaskItem } from '@/types/api-todo';

/**
 * Adapter Helper: Mengubah raw ApiTodo (DummyJSON) menjadi TaskItem (format aplikasi kita)
 */
export function formatApiTodoToTask(raw: ApiTodo): TaskItem {
  return {
    id: raw.id,
    title: raw.todo, // Mapping properti 'todo' -> 'title'
    completed: raw.completed,
    userId: raw.userId,
    source: 'dummyjson-api',
  };
}

/**
 * Mengambil daftar task yang sudah diformat untuk aplikasi
 * @param params limit dan pagination skip
 */
export async function getTasks(params?: FetchTodosParams): Promise<{
  tasks: TaskItem[];
  total: number;
  limit: number;
  skip: number;
}> {
  try {
    const response = await todoService.fetchTodos(params);
    const tasks = response.todos.map(formatApiTodoToTask);

    return {
      tasks,
      total: response.total,
      limit: response.limit,
      skip: response.skip,
    };
  } catch (error) {
    console.error('[lib/tasks.ts] Error mengambil tasks dari API:', error);
    // Kita bisa melempar error kembali atau memberikan fallback
    throw error;
  }
}

/**
 * Mengambil detail 1 task berdasarkan ID
 */
export async function getTaskById(id: number | string): Promise<TaskItem | null> {
  try {
    const raw = await todoService.fetchTodoById(id);
    return formatApiTodoToTask(raw);
  } catch (error) {
    console.error(`[lib/tasks.ts] Error mengambil task ID ${id}:`, error);
    return null;
  }
}

/**
 * Helper menghitung ringkasan statistik tasks
 */
export function getTaskStats(tasks: TaskItem[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completionPercentage,
  };
}
