'use client';

import React, { useState } from 'react';

type TodoFormProps = {
  onAddTodo: (title: string) => void;
};

export default function TodoForm({ onAddTodo }: TodoFormProps) {
  // Local state untuk controlled input form di halaman Caching
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAddTodo(trimmedTitle);
    setTitle('');
  };

  return (
    <div className="mb-6 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambahkan tugas baru (otomatis tersimpan di cache)..."
          className="flex-1 text-gray-800 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-5 py-3 bg-emerald-600 text-white font-medium text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Tambah
        </button>
      </form>
    </div>
  );
}
