import { Todo } from '@/types/todo';
import { todos as initialTodos } from '@/lib/todos';

// Array ini bertindak sebagai simulasi database tersentralisasi di server
let todosDb = [...initialTodos];

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulasi delay jaringan
    return todosDb;
  },

  async getTodoById(id: number): Promise<Todo | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return todosDb.find(t => t.id === Number(id)) || null;
  },

  async addTodo(title: string): Promise<Todo> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description: 'Belum ada deskripsi...',
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    todosDb = [newTodo, ...todosDb];
    return newTodo;
  },

  async toggleTodo(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    todosDb = todosDb.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }
};
