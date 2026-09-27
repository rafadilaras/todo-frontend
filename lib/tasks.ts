import { cookies } from 'next/headers';
import { todoService, FetchTodosParams } from '@/services/todoService';
import { TaskItem } from '@/types/api-todo';
import { TodoItem } from '@/types/api';

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

export function formatApiTodoToTask(raw: TodoItem | { id: number; todo: string; completed: boolean; userId?: number }): TaskItem {
  return {
    id: raw.id,
    title: raw.todo, // Mapping properti 'todo' -> 'title'
    completed: raw.completed,
    userId: ('userId' in raw && typeof raw.userId === 'number') ? raw.userId : 1,
    source: 'dummyjson-api',
  };
}

export async function getTasks(params?: FetchTodosParams): Promise<{
  tasks: TaskItem[];
  total: number;
  limit: number;
  skip: number;
}> {
  try {
    const authHeaders = await getAuthHeader();
    const response = await todoService.fetchTodos(params, authHeaders);
    const rawList = Array.isArray(response.data) ? response.data : [];
    const tasks = rawList.map(formatApiTodoToTask);
    const pagination = response.meta?.pagination;

    return {
      tasks,
      total: pagination?.total ?? tasks.length,
      limit: pagination?.perPage ?? 10,
      skip: pagination ? (pagination.page - 1) * pagination.perPage : 0,
    };
  } catch (error) {
    console.warn('[lib/tasks.ts] Info: Daftar task kosong atau gagal diambil dari API:', error);
    return {
      tasks: [],
      total: 0,
      limit: params?.limit ?? 10,
      skip: params?.skip ?? 0,
    };
  }
}

export async function getTaskById(id: number | string): Promise<TaskItem | null> {
  try {
    const authHeaders = await getAuthHeader();
    const response = await todoService.fetchTodoById(id, authHeaders);
    return response.data ? formatApiTodoToTask(response.data) : null;
  } catch (error) {
    console.error(`[lib/tasks.ts] Error mengambil task ID ${id}:`, error);
    return null;
  }
}

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
