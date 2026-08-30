'use client';

'use client';
import React, { useState, useTransition } from 'react';
import { addTodoAction } from '@/lib/actions';

export default function TodoForm() {
    const [title, setTitle] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        
        // startTransition mengatur status loading saat server sedang merender ulang
        startTransition(async () => {
            await addTodoAction(title); 
            setTitle('');
        });
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
                    disabled={!title.trim() || isPending}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {isPending ? 'Menyimpan...' : 'Tambah'}
                </button>
            </form>
        </div>
    );
}
