'use client';

import React, { useState } from 'react';

type TodoFormProps = {
  onAddTodo: (title: string) => void;
};

export default function TodoForm({ onAddTodo }: TodoFormProps) {
  // Local state untuk controlled input form
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi sederhana: jangan izinkan input kosong atau hanya spasi
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    // Kirim data ke komponen induk
    onAddTodo(trimmedTitle);

    // Reset input form
    setTitle('');
  };

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambahkan tugas baru..."
          className="flex-1 text-gray-800 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Tambah
        </button>
      </form>
    </div>
  );
}
