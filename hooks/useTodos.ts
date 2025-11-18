// hooks/useTodos.ts
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Todo } from '@/types';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await api.get('/api/todos/');
      // Handle both paginated (results) and direct array responses
      const todosArray = Array.isArray(res.data) 
        ? res.data 
        : (res.data.results || res.data.items || []);
      setTodos(todosArray.sort((a: Todo, b: Todo) => (a.position || 0) - (b.position || 0)));
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (data: {
    title: string;
    description?: string;
    priority?: 'extreme' | 'moderate' | 'low';
    todo_date?: string;
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('priority', data.priority || 'moderate');
    formData.append('todo_date', data.todo_date || new Date().toISOString().split('T')[0]);

    const res = await api.post('/api/todos/', formData);
    setTodos((prev) => [...prev, res.data]);
  };

  const updateTodo = async (id: number, updates: Partial<Todo>) => {
    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });

    const res = await api.patch(`/api/todos/${id}/`, formData);
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const deleteTodo = async (id: number) => {
    await api.delete(`/api/todos/${id}/`);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const reorderTodos = async (newOrder: Todo[]) => {
    setTodos(newOrder);
    // Update positions in parallel
    await Promise.all(
      newOrder.map(async (todo, index) => {
        if (todo.position !== index + 1) {
          await updateTodo(todo.id, { position: index + 1 });
        }
      })
    );
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return { todos, loading, createTodo, updateTodo, deleteTodo, reorderTodos };
};