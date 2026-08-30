'use client';

import React, { useState, useTransition } from 'react';
import { TaskItem, ApiResponse } from '@/types/api-todo';
import { todoService } from '@/services/todoService';

interface ApiTodoListProps {
  initialTasks: TaskItem[];
  totalFromApi: number;
}

export default function ApiTodoList({ initialTasks, totalFromApi }: ApiTodoListProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  
  // API Health check / Ping state
  const [isCheckingApi, setIsCheckingApi] = useState(false);
  const [apiCheckResult, setApiCheckResult] = useState<{
    status: 'idle' | 'success' | 'error';
    latency?: string;
    message?: string;
  }>({ status: 'idle' });

  const [isPending, startTransition] = useTransition();

  // Fungsi pengujian koneksi ke Route Handler /api/todos
  const handleTestApiRoute = async () => {
    setIsCheckingApi(true);
    const start = performance.now();

    try {
      const res = await fetch('/api/todos?limit=5');
      const data: ApiResponse = await res.json();
      const elapsed = Math.round(performance.now() - start);

      if (res.ok && data.success) {
        setApiCheckResult({
          status: 'success',
          latency: `${elapsed}ms`,
          message: data.message || 'API Route berhasil merespons!',
        });
      } else {
        setApiCheckResult({
          status: 'error',
          latency: `${elapsed}ms`,
          message: data.message || 'Gagal memuat dari API Route',
        });
      }
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setApiCheckResult({
        status: 'error',
        latency: `${elapsed}ms`,
        message: (err as Error).message,
      });
    } finally {
      setIsCheckingApi(false);
    }
  };

  // Toggle status tugas (Optimistic Update + API Service Call)
  const handleToggleTask = async (id: number, currentCompleted: boolean) => {
    const targetStatus = !currentCompleted;

    // 1. Optimistic Update di State Lokal
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: targetStatus } : t))
    );

    // 2. Simulasi Update ke DummyJSON via todoService
    try {
      await todoService.updateTodoStatus(id, targetStatus);
    } catch (err) {
      console.warn('Simulasi update ke API DummyJSON gagal (fallback state):', err);
    }
  };

  // Filter tasks berdasarkan search dan status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toString().includes(searchQuery) ||
      task.userId.toString().includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterStatus === 'completed') return task.completed;
    if (filterStatus === 'pending') return !task.completed;
    return true;
  });

  // Statistik
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const percentComplete = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Panel Test Koneksi /api/todos */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 md:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 className="font-semibold text-slate-800 text-sm md:text-base">
                Status Koneksi API Endpoint
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Uji langsung Next.js Route Handler di <code className="bg-white/80 px-1.5 py-0.5 rounded text-blue-700 font-mono text-[11px] border border-blue-200">/api/todos</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestApiRoute}
              disabled={isCheckingApi}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              {isCheckingApi ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Mengecek...</span>
                </>
              ) : (
                <>
                  <span>⚡ Ping /api/todos</span>
                </>
              )}
            </button>

            <a
              href="/api/todos"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl border border-slate-300 transition-colors flex items-center gap-1 shadow-sm"
              title="Buka response raw JSON di tab baru"
            >
              <span>Raw JSON ↗</span>
            </a>
          </div>
        </div>

        {/* Hasil Pengujian /api/todos */}
        {apiCheckResult.status !== 'idle' && (
          <div
            className={`mt-3 p-3 rounded-xl text-xs flex items-center justify-between border ${
              apiCheckResult.status === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{apiCheckResult.status === 'success' ? '✅' : '❌'}</span>
              <span className="font-medium">{apiCheckResult.message}</span>
            </div>
            {apiCheckResult.latency && (
              <span className="font-mono bg-white/70 px-2 py-0.5 rounded text-[11px] border">
                Latency: {apiCheckResult.latency}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Kartu Ringkasan Statistik */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-medium text-slate-500">Total Ditampilkan</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-800">{tasks.length}</span>
            <span className="text-[11px] text-slate-400 font-mono">/ {totalFromApi} total</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-medium text-emerald-600">Selesai</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-emerald-600">{completedCount}</span>
            <span className="text-[11px] text-emerald-500 font-medium">{percentComplete}%</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-medium text-amber-600">Belum Selesai</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-amber-600">{pendingCount}</span>
            <span className="text-[11px] text-amber-500 font-medium">
              {tasks.length > 0 ? 100 - percentComplete : 0}%
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <p className="text-[11px] font-medium text-indigo-600">Data Source</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-700">DummyJSON</span>
            <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
              REST
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari tugas atau ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
          />
        </div>

        {/* Filter Status Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({tasks.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Belum ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai ({completedCount})
          </button>
        </div>
      </div>

      {/* 4. Daftar Todos */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80">
            <p className="text-slate-400 text-sm">Tidak ada tugas yang sesuai dengan pencarian / filter.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id, task.completed)}
              className={`group flex items-start sm:items-center justify-between p-3.5 md:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                task.completed
                  ? 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300'
                  : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 flex-1 pr-2">
                {/* Custom Checkbox */}
                <div
                  className={`mt-0.5 sm:mt-0 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    task.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 group-hover:border-indigo-500 bg-white'
                  }`}
                >
                  {task.completed && (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Title */}
                <div>
                  <p
                    className={`text-xs md:text-sm font-medium leading-relaxed transition-all ${
                      task.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-800 group-hover:text-indigo-900'
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-[10px] text-slate-400 sm:hidden mt-1">
                    ID #{task.id} • User #{task.userId}
                  </p>
                </div>
              </div>

              {/* Badges on right (desktop) */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  ID: {task.id}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  User: {task.userId}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-md border ${
                    task.completed
                      ? 'bg-emerald-100/70 text-emerald-800 border-emerald-200'
                      : 'bg-amber-100/70 text-amber-800 border-amber-200'
                  }`}
                >
                  {task.completed ? 'Selesai' : 'Pending'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
