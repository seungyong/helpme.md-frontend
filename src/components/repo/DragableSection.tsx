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

import styles from "./DragableSection.module.scss";

import deleteIcon from "@assets/images/delete.svg";

import { Section } from "@src/types/section";
import { useSection } from "@src/hooks/useSection";

interface SortableItemProps {
  section: Section;
}

const SortableItem = ({ section }: SortableItemProps) => {
  const { deleteSection, clickSection } = useSection();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    clickSection(section);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSection(section.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.component}
      {...attributes}
      {...listeners}
      onClick={handleClick}
    >
      <div className={styles.componentDragHandle}>⋮⋮</div>
      <p className={styles.componentTitle}>{section.title}</p>
      <button
        className={styles.componentDeleteButton}
        onClick={handleDeleteClick}
      >
        <img src={deleteIcon} alt="delete" />
      </button>
    </div>
  );
};

const DragableSection = () => {
  const { sections, updateSectionOrder } = useSection();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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

    const oldIndex = sections.findIndex((item) => item.id === active.id);
    const newIndex = sections.findIndex((item) => item.id === over.id);

    const reorderedSections = arrayMove(sections, oldIndex, newIndex);
    updateSectionOrder(reorderedSections);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.dragableComponent}>
          {sections.map((section) => (
            <SortableItem key={section.id} section={section} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DragableSection;
