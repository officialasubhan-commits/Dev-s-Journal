"use client";

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type SortableItemProps = {
  id: string;
  item: any;
  renderItem: (item: any) => React.ReactNode;
  onRemove?: (id: string) => void;
};

export function SortableItem({ id, item, renderItem, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-[var(--card)] border border-[var(--border-color)] p-2 rounded-md mb-2 shadow-sm">
      <div {...attributes} {...listeners} className="cursor-grab text-[var(--text-secondary)] hover:text-[var(--text-main)]">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1">
        {renderItem(item)}
      </div>
      {onRemove && (
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-[var(--error)] hover:bg-[var(--error)]/10" onClick={() => onRemove(id)}>
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

export function DragList({ 
  items, 
  setItems, 
  renderItem, 
  onRemove,
  keyExtractor = (item: any) => item.id || item
}: { 
  items: any[]; 
  setItems: (items: any[]) => void; 
  renderItem: (item: any) => React.ReactNode; 
  onRemove?: (id: string) => void;
  keyExtractor?: (item: any) => string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => keyExtractor(item) === active.id);
      const newIndex = items.findIndex(item => keyExtractor(item) === over.id);

      setItems(arrayMove(items, oldIndex, newIndex));
    }
  }

  const ids = items.map(item => keyExtractor(item));

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={ids}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
          {items.map((item) => (
            <SortableItem 
              key={keyExtractor(item)} 
              id={keyExtractor(item)} 
              item={item} 
              renderItem={renderItem} 
              onRemove={onRemove} 
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
