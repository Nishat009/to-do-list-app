'use client';

import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';

export default function TodoForm() {
  const [title, setTitle] = useState('');
  const { createTodo } = useTodos();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      createTodo(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Add a new todo..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Add
      </button>
    </form>
  );
}