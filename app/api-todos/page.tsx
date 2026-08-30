import React from 'react';
import Link from 'next/link';
import { getTasks } from '@/lib/tasks';
import ApiTodoList from './components/ApiTodoList';
import ArchitectureGuide from './components/ArchitectureGuide';

export const metadata = {
  title: 'Integrasi External REST API (DummyJSON) - Modul 3',
  description: 'Modul Praktik Mahasiswa: Fetch API, Layer Services, Types, Lib, dan Next.js Route Handler',
};

export default async function ApiTodosPage() {
  let initialTasks: Awaited<ReturnType<typeof getTasks>>['tasks'] = [];
  let totalCount = 0;
  let fetchError: string | null = null;

  try {
    // Memanggil data awal di Server Component melalui business logic helper
    const result = await getTasks({ limit: 15, skip: 0 });
    initialTasks = result.tasks;
    totalCount = result.total;
  } catch (err) {
    fetchError = (err as Error).message;
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-10 bg-slate-100/70 text-slate-800">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation Tabs Modul */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-white text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shrink-0"
          >
            Modul 1: Local State
          </Link>
          <Link
            href="/cached"
            className="px-3 py-1.5 rounded-lg bg-white text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shrink-0"
          >
            Modul 2: Caching State
          </Link>
          <Link
            href="/api-todos"
            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold shadow-sm shrink-0"
          >
            Modul 3: REST API (DummyJSON)
          </Link>
        </nav>

        {/* Header Modul */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Modul 3: Integrasi Data Eksternal
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-600">
              REST API
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Integrasi DummyJSON Todos API
          </h1>

          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Mempelajari struktur arsitektur modular: <strong className="text-indigo-600 font-semibold">types</strong> (Type Safety) → <strong className="text-indigo-600 font-semibold">services</strong> (Koneksi HTTP) → <strong className="text-indigo-600 font-semibold">lib</strong> (Business Logic & Mapping) → <strong className="text-indigo-600 font-semibold">/api</strong> (Route Handler) → <strong className="text-indigo-600 font-semibold">Page UI</strong>.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Endpoint Target:</span>
              <code className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                https://dummyjson.com/todos
              </code>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
              Server Component Fetching Ready
            </div>
          </div>
        </div>

        {/* Guide Arsitektur 5-Layer */}
        <ArchitectureGuide />

        {/* Error Notification jika Server Fetch gagal */}
        {fetchError && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-800 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold">Gagal memuat data awal dari API eksternal:</p>
              <p className="text-xs text-rose-700 font-mono mt-1">{fetchError}</p>
              <p className="text-xs text-slate-600 mt-2">
                Pastikan koneksi internet aktif untuk mengakses <code>dummyjson.com</code>.
              </p>
            </div>
          </div>
        )}

        {/* Daftar Todos & Tester Komponen */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Daftar Tugas dari DummyJSON</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Data ditarik secara dinamis dari API dan di-map melalui <code className="text-indigo-600 font-mono">lib/tasks.ts</code>
              </p>
            </div>
          </div>

          <ApiTodoList initialTasks={initialTasks} totalFromApi={totalCount} />
        </div>

      </div>
    </main>
  );
}
