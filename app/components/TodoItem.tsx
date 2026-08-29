'use client';

import React from 'react';
import Link from 'next/link';
import { Todo } from '@/types/todo';

export type { Todo };

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li
      className={`p-4 rounded-lg border flex items-center justify-between gap-3 transition-all duration-200 ${
        todo.completed
          ? 'bg-emerald-50/60 border-emerald-200 shadow-sm'
          : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
      }`}
    >
      {/* Bagian Checklist & Judul Tugas */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <input
          id={`todo-${todo.id}`}
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`text-base font-medium truncate cursor-pointer transition-all ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {todo.title}
        </label>
      </div>

      {/* Aksi: Detail & Hapus */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/task/${todo.id}`}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          Detail →
        </Link>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            title="Hapus tugas"
            className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
          >
            Hapus
          </button>
        )}
      </div>
    </li>
  );
}
