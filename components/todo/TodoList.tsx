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
  id: string;
  type: string;
}

interface TodoDragProps {
  todo: Todo;
  index: number;
}

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

    reorderTodos((prev) => {
      const newTodos = [...prev];
      const [moved] = newTodos.splice(dragIndex, 1);
      newTodos.splice(hoverIndex, 0, moved);
      return newTodos.map((t, i) => ({ ...t, order: i }));
    });

    item.index = hoverIndex;
  },
});

drag(drop(ref));



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
