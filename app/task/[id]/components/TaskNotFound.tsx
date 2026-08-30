import React from 'react';
import Link from 'next/link';

type TaskNotFoundProps = {
  id: string;
};

export default function TaskNotFound({ id }: TaskNotFoundProps) {
  return (
    <main className="min-h-screen p-6 md:p-10 bg-white text-dark-70">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
        <h1 className="text-2xl font-bold text-dark-130 mb-2">Tugas Tidak Ditemukan</h1>
        <p className="text-muted mb-6 text-sm">Tugas dengan ID #{id} tidak ada dalam daftar data.</p>
        <Link
          href="/"
          className="inline-block bg-primary-70 hover:bg-primary-80 text-white font-semibold px-5 py-2.5 rounded-lg transition shadow-md text-sm"
        >
          Kembali ke Daftar Tugas
        </Link>
      </div>
    </main>
  );
}
