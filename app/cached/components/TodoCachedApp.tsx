'use client';

import React from 'react';
import Link from 'next/link';
import TodoForm from '@/app/components/TodoForm';
import TodoList from '@/app/components/TodoList';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Todo } from '@/types/todo';

type TodoCachedAppProps = {
  initialTodos: Todo[];
};

export default function TodoCachedApp({ initialTodos }: TodoCachedAppProps) {
  // Caching State: Menggunakan custom hook useLocalStorage yang tersinkron otomatis
  const [todos, setTodos] = useLocalStorage<Todo[]>(
    'TODO_LIST_CACHE',
    initialTodos
  );

  // 1. Handler Tambah Tugas
  const handleAddTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description: 'Tugas baru yang tersimpan di localStorage.',
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  // 2. Handler Toggle Checklist
  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 3. Handler Hapus Tugas
  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // 4. Reset Cache ke Data Semula
  const handleResetToDefault = () => {
    if (confirm('Kembalikan data cache ke daftar tugas awal?')) {
      setTodos(initialTodos);
    }
  };

  // Hitung ringkasan statistik
  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div>
      {/* Banner Penjelasan Mode Caching */}
      <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-2.5">
          <span className="text-xl">✅</span>
          <div>
            <p className="text-sm font-bold">Mode: Caching State (localStorage)</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Data tersinkron otomatis dengan browser. Coba <strong>Refresh (F5)</strong>, data tugas & checklist tetap awet!
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="shrink-0 text-xs font-semibold px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg transition shadow-xs flex items-center gap-1"
        >
          ← Versi State Biasa
        </Link>
      </div>

      {/* Kartu Ringkasan Statistik */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-blue-900 mt-0.5">{totalTasks}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Selesai</p>
          <p className="text-2xl font-bold text-emerald-900 mt-0.5">{completedTasks}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-bold text-amber-900 mt-0.5">{pendingTasks}</p>
        </div>
      </div>

      {/* Form Input Tambah Tugas */}
      <TodoForm onAddTodo={handleAddTodo} />

      {/* Indikator Status Caching & Reset */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2 px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Cache aktif (`localStorage: TODO_LIST_CACHE`)
        </span>
        <button
          type="button"
          onClick={handleResetToDefault}
          className="text-gray-500 hover:text-rose-600 underline transition cursor-pointer"
        >
          Reset ke Data Awal
        </button>
      </div>

      {/* List Tugas */}
      <TodoList
        todos={todos}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </div>
  );
}
