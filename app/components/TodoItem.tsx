'use client';
import React, { useTransition } from 'react';
import Link from 'next/link';
import { Todo } from '@/types/todo';
import { toggleTodoAction } from '@/lib/actions';

interface TodoItemProps {
    todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            await toggleTodoAction(todo.id);
        });
    };

    return (
        <li className={`p-4 rounded-md border flex items-center justify-between gap-3 transition-colors ${
            todo.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        } ${isPending ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={handleToggle}
                    disabled={isPending}
                    className="w-5 h-5 rounded text-blue-600 cursor-pointer disabled:cursor-wait"
                />
                <span className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {todo.title}
                </span>
            </div>
            <Link 
                href={`/task/${todo.id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline shrink-0"
            >
                Detail
            </Link>
        </li>
    );
}
