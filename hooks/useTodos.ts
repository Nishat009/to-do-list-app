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
      setTodos(res.data.results.sort((a: Todo, b: Todo) => a.position - b.position));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (title: string) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', '');
    formData.append('priority', 'moderate');
    formData.append('todo_date', new Date().toISOString().split('T')[0]);

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
    newOrder.forEach(async (todo, index) => {
      if (todo.position !== index + 1) {
        await updateTodo(todo.id, { position: index + 1 });
      }
    });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return { todos, loading, createTodo, updateTodo, deleteTodo, reorderTodos };
};