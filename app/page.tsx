import React from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

async function getTodos() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return [
    { id: 1, title: 'Belajar React Server Components (RSC)', completed: true },
    { id: 2, title: 'Memahami Next.js App Router', completed: true },
    { id: 3, title: 'Membuat Aplikasi Todo List', completed: false },
    { id: 4, title: 'Eksplorasi Client Components', completed: false },
  ];
}

export default async function TodoPage() {
  const todos = await getTodos();

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Daftar Tugas (Todo List)
          </h1>
        </header>

        {/* Form Komponen */}
        <TodoForm />

        {/* List Komponen yang membungkus Item */}
        <TodoList todos={todos} />
      </div>
    </main>
  );
}
