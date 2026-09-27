'use client';

import React, { useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { Todo } from '@/types/todo';
import { todoService } from '@/services/todoService';

type TodoStateOnlyAppProps = {
  initialTodos?: Todo[];
};

export default function TodoStateOnlyApp({ initialTodos = [] }: TodoStateOnlyAppProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos || []);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handler Tambah Tugas Baru ke Backend
  const handleAddTodo = async (title: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await todoService.createTodo({ task: title });
      if (response.data) {
        const createdItem: Todo = {
          id: response.data.id,
          title: response.data.todo,
          description: 'Tugas tersimpan di database MySQL backend.',
          completed: response.data.completed,
          createdAt: new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        };
        setTodos((prev) => [createdItem, ...prev]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menambahkan tugas ke backend.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handler Checklist / Toggle Status Completed ke Backend
  const handleToggleTodo = async (id: number) => {
    const targetTodo = todos.find((t) => t.id === id);
    if (!targetTodo) return;

    const newCompleted = !targetTodo.completed;

    // Optimistic Update di UI
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: newCompleted } : todo))
    );

    try {
      await todoService.updateTodoStatus(id, newCompleted);
    } catch (err: unknown) {
      // Rollback jika gagal
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed: targetTodo.completed } : todo))
      );
      const msg = err instanceof Error ? err.message : 'Gagal mengubah status tugas.';
      setErrorMessage(msg);
    }
  };

  // Handler Hapus Tugas dari Backend
  const handleDeleteTodo = async (id: number) => {
    const previousTodos = [...todos];

    // Optimistic Update di UI
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    try {
      await todoService.deleteTodo(id);
    } catch (err: unknown) {
      // Rollback jika gagal
      setTodos(previousTodos);
      const msg = err instanceof Error ? err.message : 'Gagal menghapus tugas dari backend.';
      setErrorMessage(msg);
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Form Input */}
      <TodoForm onAddTodo={handleAddTodo} />

      {/* Indikator Loading */}
      {loading && (
        <p className="text-xs text-primary-70 font-medium mb-3">Menyimpan ke backend...</p>
      )}

      {/* List Tugas */}
      <TodoList
        todos={todos}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </div>
  );
}
