'use client';

import React, { useState, useTransition } from 'react';
import { TaskItem, ApiResponse } from '@/types/api-todo';
import { todoService } from '@/services/todoService';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';

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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-dark-70">Daftar Tugas</h2>
        <span className="text-xs bg-gray-70 text-gray-600 px-2.5 py-1 rounded-full font-medium">
          {tasks.length} item
        </span>
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-muted text-sm">Tidak ada tugas yang sesuai dengan pencarian / filter.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id, task.completed)}
              className={`group flex items-start sm:items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-none ${task.completed
                ? 'bg-success-10/20 border-success-20 hover:border-success-40'
                : 'bg-white border-gray-100 hover:border-primary-70/40'
                }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 flex-1 pr-2">
                {/* Custom Checkbox */}
                <div
                  className={`mt-0.5 sm:mt-0 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${task.completed
                    ? 'bg-primary-70 border-primary-70 text-white'
                    : 'border-gray-300 group-hover:border-primary-70 bg-white'
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
                    className={`text-xs md:text-sm font-medium leading-relaxed transition-all ${task.completed
                      ? 'line-through text-gray-80'
                      : 'text-dark-70 group-hover:text-primary-100'
                      }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-[10px] text-muted sm:hidden mt-1">
                    ID #{task.id} • User #{task.userId}
                  </p>
                </div>
              </div>

              {/* Badges on right (desktop) - Kontras, Tanpa Abu-abu */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <Badge variant="purple" size="default">
                  ID: #{task.id}
                </Badge>
                <Badge variant="blue" size="default">
                  User: {task.userId}
                </Badge>
                <Badge
                  variant={task.completed ? 'green' : 'yellow'}
                  size="default"
                >
                  {task.completed ? 'Selesai' : 'Pending'}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
