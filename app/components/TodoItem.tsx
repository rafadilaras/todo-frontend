import React from 'react';

export type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

export default function TodoItem({ todo }: { todo: Todo }) {
    return (
        <li
            className={`p-4 rounded-md border flex items-center gap-3 transition-colors ${todo.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
        >
            <input
                type="checkbox"
                checked={todo.completed}
                className="w-5 h-5 rounded text-blue-600"
            />
            <span className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {todo.title}
            </span>
        </li>
    );
}
