'use client';

import React, { useState } from 'react';

const layers = [
  {
    id: 'types',
    badge: 'Layer 1: Type Safety',
    title: 'types/api-todo.ts',
    desc: 'Mendefinisikan tipe data kontrak dari DummyJSON (ApiTodo, TodosApiResponse) & tipe internal (TaskItem).',
    purpose: 'Mencegah typo, memberikan autocomplete di IDE, dan memastikan kesesuaian response backend eksternal.',
    codeSnippet: `export interface ApiTodo {
  id: number;
  todo: string; // Properti asli DummyJSON
  completed: boolean;
  userId: number;
}

export interface TaskItem {
  id: number;
  title: string; // Format bersih di frontend kita
  completed: boolean;
  userId: number;
}`,
  },
  {
    id: 'services',
    badge: 'Layer 2: Networking / HTTP',
    title: 'services/api.ts & todoService.ts',
    desc: 'Menghubungkan aplikasi ke REST API DummyJSON (https://dummyjson.com/todos).',
    purpose: 'Mengisolasi konfigurasi fetch, Base URL, error handling, dan method HTTP (GET, POST, PUT, DELETE).',
    codeSnippet: `// services/api.ts
export const API_BASE_URL = 'https://dummyjson.com';
export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> { ... }

// services/todoService.ts
export const todoService = {
  fetchTodos: (params) => apiClient('/todos?limit=15'),
  fetchTodoById: (id) => apiClient(\`/todos/\${id}\`),
};`,
  },
  {
    id: 'lib',
    badge: 'Layer 3: Adapter & Business Logic',
    title: 'lib/tasks.ts',
    desc: 'Adapter dan pengolahan data sebelum dipakai oleh UI / Server Component.',
    purpose: 'Mengubah struktur data API luar (field "todo") menjadi format seragam ("title"), filter, dan hitung statistik.',
    codeSnippet: `// Adapter mapping raw DummyJSON ke format internal
export function formatApiTodoToTask(raw: ApiTodo): TaskItem {
  return {
    id: raw.id,
    title: raw.todo, // Mapping 'todo' -> 'title'
    completed: raw.completed,
    userId: raw.userId,
    source: 'dummyjson-api',
  };
}

export async function getTasks(params) {
  const data = await todoService.fetchTodos(params);
  return { tasks: data.todos.map(formatApiTodoToTask) };
}`,
  },
  {
    id: 'api-route',
    badge: 'Layer 4: Internal Route Handler',
    title: 'app/api/todos/route.ts',
    desc: 'Endpoint internal Next.js (/api/todos) untuk menguji koneksi API secara langsung.',
    purpose: 'Memverifikasi apakah external API DummyJSON berhasil dijangkau dan siap dites di browser / Postman.',
    codeSnippet: `// GET http://localhost:3000/api/todos
export async function GET(request: NextRequest) {
  const result = await getTasks();
  return NextResponse.json({
    success: true,
    message: 'Koneksi ke DummyJSON API berhasil!',
    data: result,
  });
}`,
  },
  {
    id: 'page',
    badge: 'Layer 5: Presentation / UI',
    title: 'app/api-todos/page.tsx',
    desc: 'Halaman UI Server & Client Component untuk merender data tugas.',
    purpose: 'Mengambil data awal di Server Component dan menyediakan interaktivitas di Client Component.',
    codeSnippet: `// Server Component
export default async function ApiTodosPage() {
  const { tasks } = await getTasks({ limit: 15 });
  return <ApiTodoList initialTasks={tasks} />;
}`,
  },
];

export default function ArchitectureGuide() {
  const [activeTab, setActiveTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 mb-8 shadow-xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1">
            Materi Pembelajaran
          </span>
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            🏛️ Arsitektur 5-Layer Integrasi API
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Pemisahan tanggung jawab (Separation of Concerns) dalam mengonsumsi DummyJSON REST API.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="self-start sm:self-center text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
        >
          {isOpen ? 'Sembunyikan Detail ▲' : 'Buka Penjelasan Layer ▼'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 space-y-4">
          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {layers.map((layer, index) => (
              <button
                key={layer.id}
                onClick={() => setActiveTab(index)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === index
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {index + 1}. {layer.id.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-indigo-500/20 text-indigo-300">
                {layers[activeTab].badge}
              </span>
              <code className="text-xs font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {layers[activeTab].title}
              </code>
            </div>

            <p className="text-sm text-slate-300">{layers[activeTab].desc}</p>

            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800">
              <p className="text-xs font-semibold text-slate-400 mb-1">🎯 Fungsi Utama:</p>
              <p className="text-xs text-slate-200">{layers[activeTab].purpose}</p>
            </div>

            <div>
              <p className="text-[11px] font-mono text-slate-400 mb-1">Contoh Potongan Kode:</p>
              <pre className="p-3 bg-black/60 rounded-lg overflow-x-auto text-[11px] font-mono text-emerald-300 border border-slate-800">
                <code>{layers[activeTab].codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
