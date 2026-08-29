'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { Todo } from '@/types/todo';

type TodoStateOnlyAppProps = {
  initialTodos: Todo[];
};

export default function TodoStateOnlyApp({ initialTodos }: TodoStateOnlyAppProps) {
  // 1. State murni di memori (useState biasa, tanpa localStorage)
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  // Handler Tambah Tugas Baru
  const handleAddTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description: 'Tugas baru yang ditambahkan ke state komponen.',
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  // Handler Checklist / Toggle Status Completed
  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Handler Hapus Tugas
  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Hitung statistik sederhana
  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div>
      {/* Banner Penjelasan Mode untuk Bahan Ajar */}
      <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-2.5">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-sm font-bold">Mode: Local State (In-Memory)</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Data hanya tersimpan di memori komponen. Jika halaman di-<strong>Refresh (F5)</strong>, perubahan akan hilang.
            </p>
          </div>
        </div>

        <Link
          href="/cached"
          className="shrink-0 text-xs font-semibold px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-xs flex items-center gap-1"
        >
          🚀 Coba Versi Caching →
        </Link>
      </div>

      {/* Kartu Ringkasan Statistik */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-gray-800 mt-0.5">{totalTasks}</p>
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

      {/* Form Input */}
      <TodoForm onAddTodo={handleAddTodo} />

      {/* List Tugas */}
      <TodoList
        todos={todos}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </div>
  );
}
