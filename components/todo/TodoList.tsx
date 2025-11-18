'use client';

import { useRef } from 'react';
import {
  DndProvider,
  useDrag,
  useDrop,
  DragSourceMonitor,
  DropTargetMonitor,
} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TodoItem from './TodoItem';
import { Todo } from '@/types';
import { useTodos } from '@/hooks/useTodos';

const ItemType = 'TODO';

interface DragItem {
  index: number;
  id: number;
  type: string;
}

interface DraggableTodoProps {
  todo: Todo;
  index: number;
}

function DraggableTodo({ todo, index }: DraggableTodoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reorderTodos, todos } = useTodos();

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: ItemType,
    item: { id: todo.id, index, type: ItemType },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: ItemType,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const newTodos = [...todos];
      const [moved] = newTodos.splice(dragIndex, 1);
      newTodos.splice(hoverIndex, 0, moved);
      const reordered = newTodos.map((t, i) => ({ ...t, position: i + 1 }));
      reorderTodos(reordered);

      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-move"
    >
      <TodoItem todo={todo} />
    </div>
  );
}

export default function TodoList() {
  const { todos, loading } = useTodos();

  if (loading) return <p>Loading...</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-3">
        {todos.map((todo, index) => (
          <DraggableTodo key={todo.id} todo={todo} index={index} />
        ))}
      </div>
    </DndProvider>
  );
}
