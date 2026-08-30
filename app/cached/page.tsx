import React from 'react';
import Link from 'next/link';
import TodoCachedApp from './components/TodoCachedApp';
import { getTodos } from '@/lib/todos';

export const metadata = {
  title: 'Todo List dengan Caching State (localStorage)',
  description: 'Demonstrasi penerapan Custom Hook useLocalStorage untuk Caching State di Next.js',
};

export default async function CachedTodoPage() {
  // Mengambil data awal di Server Component
  const initialTodos = await getTodos();

  return (
    <main className="min-h-screen p-6 md:p-10 bg-gray-100">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Navigation Tabs Modul */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-white text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shrink-0"
          >
            Modul 1: Local State
          </Link>
          <Link
            href="/cached"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold shadow-sm shrink-0"
          >
            Modul 2: Caching State
          </Link>
          <Link
            href="/api-todos"
            className="px-3 py-1.5 rounded-lg bg-white text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shrink-0"
          >
            Modul 3: REST API (DummyJSON)
          </Link>
        </nav>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
          <header className="mb-6 border-b pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              Daftar Tugas (Todo List)
            </h1>
            <p className="text-sm text-emerald-600 font-medium text-center mt-1">
              Modul 2: Praktik Caching State (<code className="bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-800">useLocalStorage</code>)
            </p>
          </header>

          {/* Halaman Caching: Menggunakan TodoCachedApp dari folder cached/components */}
          <TodoCachedApp initialTodos={initialTodos} />
        </div>
      </div>
    </main>
  );
}
