'use client';

import ProtectedRoute from '@/components/protectedRoutes';
import TodoForm from '@/components/todo/TodoForm';
import TodoList from '@/components/todo/TodoList';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Todos</h1>
        <TodoForm />
        <TodoList />
      </div>
    </ProtectedRoute>
  );
}