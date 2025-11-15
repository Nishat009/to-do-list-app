'use client';

import { useState } from 'react';
import { Todo } from '@/types';
import { useTodos } from '@/hooks/useTodos';

interface Props {
  todo: Todo;
}

export default function TodoItem({ todo }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const { updateTodo, deleteTodo } = useTodos();

  const handleSave = () => {
    updateTodo(todo.id, { title });
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow transition">
      <input
        type="checkbox"
        checked={todo.is_completed}
        onChange={() => updateTodo(todo.id, { is_completed: !todo.is_completed })}
        className="w-5 h-5 text-blue-600 rounded"
      />
      {editing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="flex-1 px-2 py-1 border rounded"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 ${todo.is_completed ? 'line-through text-gray-500' : ''}`}
          onDoubleClick={() => setEditing(true)}
        >
          {todo.title}
        </span>
      )}
      <button
        onClick={() => deleteTodo(todo.id)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
}