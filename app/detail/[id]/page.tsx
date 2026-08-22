import React from 'react';
import Link from 'next/link';


async function getTodoDetail(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const todos = [
        {
            id: 1,
            title: 'Belajar React Server Components (RSC)',
            description: 'Mempelajari konsep dasar Server Components pada Next.js dan perbedaannya dengan Client Components.',
            completed: true,
            createdAt: '2026-08-20',
        },
        {
            id: 2,
            title: 'Memahami Next.js App Router',
            description: 'Mempelajari struktur routing berbasis folder, dynamic route [id], layout, loading, dan error handling.',
            completed: true,
            createdAt: '2026-08-21',
        },
        {
            id: 3,
            title: 'Membuat Aplikasi Todo List',
            description: 'Praktik membuat CRUD Todo List sederhana menggunakan Next.js App Router.',
            completed: false,
            createdAt: '2026-08-22',
        },
        {
            id: 4,
            title: 'Eksplorasi Client Components',
            description: 'Menggunakan directive "use client" untuk interaktivitas seperti form input, onClick handler, dan state.',
            completed: false,
            createdAt: '2026-08-22',
        },
    ];

    const todo = todos.find((item) => item.id === Number(id));

    // Fallback jika ID tidak ditemukan di data dummy
    return (
        todo || {
            id: Number(id),
            title: `Tugas #${id}`,
            description: 'Deskripsi untuk tugas ini belum ditambahkan.',
            completed: false,
            createdAt: '2026-08-22',
        }
    );
}

type DetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function TodoDetailPage({ params }: DetailPageProps) {
    const { id } = await params;
    const todo = await getTodoDetail(id);

    return (
        <main className="min-h-screen p-8 bg-gray-100">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                {/* Header dengan tombol kembali */}
                <header className="mb-6 border-b pb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">Detail Tugas</h1>
                    <Link
                        href="/"
                        className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md transition"
                    >
                        ← Kembali ke Daftar
                    </Link>
                </header>

                {/* Informasi Detail Tugas */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            ID Tugas
                        </label>
                        <p className="text-gray-700 font-medium">#{todo.id}</p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Judul Tugas
                        </label>
                        <h2 className="text-xl font-semibold text-gray-900">{todo.title}</h2>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Deskripsi
                        </label>
                        <p className="text-gray-600 bg-gray-50 p-4 rounded-md border border-gray-200 mt-1">
                            {todo.description}
                        </p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Status
                        </label>
                        <div className="mt-1">
                            <span
                                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${todo.completed
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                    }`}
                            >
                                {todo.completed ? '✓ Selesai' : '⏳ Belum Selesai'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Tanggal Dibuat
                        </label>
                        <p className="text-gray-600 text-sm mt-1">{todo.createdAt}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
