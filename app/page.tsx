import React from 'react';
import { todoService } from '@/services/todo.service';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

export default async function TodoPage() {
  // Karena adanya revalidatePath() di actions.ts, 
  // fungsi ini akan dieksekusi ulang dari awal tiap kali form di-submit,
  // menarik data terbaru dari service/database.
  const todos = await todoService.getTodos();

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Daftar Tugas (Todo List)
          </h1>
        </header>

        {/* Komponen Form langsung kita letakkan (menggunakan Server Action di dalamnya) */}
        <TodoForm />

        {/* Data yang dirender di sini selalu terbaru berkat revalidasi server */}
        <TodoList todos={todos} />
      </div>
    </main>
  );
}
