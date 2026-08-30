'use client';

import React from 'react';
import Link from 'next/link';
import { Todo } from '@/types/todo';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li
      className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 ${
        todo.completed
          ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
          : 'bg-white border-gray-200 hover:border-emerald-200 shadow-xs'
      }`}
    >
      {/* Checklist & Judul Tugas */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <input
          id={`cached-todo-${todo.id}`}
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
        />
        <label
          htmlFor={`cached-todo-${todo.id}`}
          className={`text-base font-medium truncate cursor-pointer transition-all ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {todo.title}
        </label>
      </div>

      {/* Tombol Aksi: Detail & Hapus */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/task/${todo.id}`}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          Detail →
        </Link>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            title="Hapus dari cache"
            className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            Hapus
          </button>
        )}
      </div>
    </li>
  );
}
