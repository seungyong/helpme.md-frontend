import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import styles from "./DragableComponent.module.scss";

import resetIcon from "@assets/images/reset.svg";
import deleteIcon from "@assets/images/delete.svg";

import { Component } from "@src/types/component";

interface SortableItemProps {
  component: Component;
  onReset: (componentId: string) => void;
  onDelete: (componentId: string) => void;
}

const SortableItem = ({ component, onReset, onDelete }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 부모 컴포넌트로 리셋 이벤트 전달
  const handleReset = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onReset(componentId);
  };

  // 부모 컴포넌트로 삭제 이벤트 전달
  const handleDelete = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(componentId);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.component}
      {...attributes}
      {...listeners}
    >
      <div className={styles.componentDragHandle}>⋮⋮</div>
      <p className={styles.componentTitle}>{component.title}</p>
      <button
        className={styles.componentEditButton}
        onClick={(e) => handleReset(component.id, e)}
      >
        <img src={resetIcon} alt="reset" />
      </button>
      <button
        className={styles.componentDeleteButton}
        onClick={(e) => handleDelete(component.id, e)}
      >
        <img src={deleteIcon} alt="delete" />
      </button>
    </div>
  );
};

const DragableComponent = ({ components }: { components: Component[] }) => {
  const [items, setItems] = useState<Component[]>(components);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 움직여야 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  useEffect(() => {
    // 변경 사항 db 저장
  }, [items]);

  const handleReset = (componentId: string) => {
    setItems((items) => {
      const originalItem = components.find((item) => item.id === componentId);
      if (!originalItem) {
        return items;
      }

      const targetItems = items.map((item) => {
        if (item.id === componentId) {
          return { ...item, ...originalItem };
        }

        return item;
      });

      return targetItems;
    });
  };

  const handleDelete = (componentId: string) => {
    console.log(`delete ${componentId}`);

    setItems((items) => {
      return items.filter((item) => item.id !== componentId);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className={styles.dragableComponent}>
          {items.map((component) => (
            <SortableItem
              key={component.id}
              component={component}
              onReset={handleReset}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DragableComponent;
