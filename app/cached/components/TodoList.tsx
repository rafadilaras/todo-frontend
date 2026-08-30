'use client';

import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '@/types/todo';

type TodoListProps = {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  onDeleteTodo?: (id: number) => void;
};

export default function TodoList({ todos, onToggleTodo, onDeleteTodo }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/20">
        <p className="font-medium text-gray-700">Cache tugas kosong.</p>
        <p className="text-xs text-gray-400 mt-1">Tambahkan tugas baru untuk menyimpannya di localStorage browser.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Daftar Tugas (Cached)</h2>
        <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">
          {todos.length} item tersimpan
        </span>
      </div>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggleTodo}
            onDelete={onDeleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}
