import React from 'react';
import TodoStateOnlyApp from './components/TodoStateOnlyApp';
import UserNavHeader from './components/UserNavHeader';
import { getTodos } from '@/lib/todos';

export const metadata = {
  title: 'Todo App - Dashboard Tugas',
  description: 'Aplikasi manajemen tugas terintegrasi dengan Express Backend & MySQL',
};

export default async function TodoPage() {
  const initialTodos = await getTodos();

  return (
    <main className="min-h-screen p-6 md:p-10 bg-gray-50 text-dark-70">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
          <UserNavHeader />
          <TodoStateOnlyApp initialTodos={initialTodos} />
        </div>
      </div>
    </main>
  );
}
