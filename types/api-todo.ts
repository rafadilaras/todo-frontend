/**
 * types/api-todo.ts
 * 
 * Definisi tipe data untuk integrasi dengan REST API DummyJSON (https://dummyjson.com/todos).
 * Materi Edukasi: Type Safety pada konsumsi External REST API.
 */

// 1. Tipe data satuan Todo langsung dari DummyJSON
export interface ApiTodo {
  id: number;
  todo: string; // DummyJSON menggunakan properti 'todo' untuk teks tugas
  completed: boolean;
  userId: number;
}

// 2. Tipe data respon kumpulan Todos dari DummyJSON
export interface TodosApiResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}

// 3. Tipe data internal aplikasi kita (setelah di-mapping/adaptasi di lib)
export interface TaskItem {
  id: number;
  title: string;       // Nama yang lebih umum di frontend
  completed: boolean;
  userId: number;
  source: 'dummyjson-api';
}

// 4. Struktur standar response dari Next.js Route Handler (/api/todos)
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  total?: number;
  timestamp: string;
  error?: string;
}
