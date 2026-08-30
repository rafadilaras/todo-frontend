import React from 'react';
import { todoService } from '@/services/todo.service';
import TaskNotFound from './components/TaskNotFound';
import TaskDetailCard from './components/TaskDetailCard';

type DetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TodoDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const todo = await todoService.getTodoById(Number(id));

  if (!todo) {
    return <TaskNotFound id={id} />;
  }

  return <TaskDetailCard todo={todo} />;
}

