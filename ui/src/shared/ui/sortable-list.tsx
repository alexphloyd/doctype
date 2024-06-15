import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    UniqueIdentifier,
    DraggableSyntheticListeners,
} from '@dnd-kit/core';
import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import type { DropAnimation } from '@dnd-kit/core';
import type { Active } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    CSSProperties,
    Fragment,
    PropsWithChildren,
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';
import type { ReactNode } from 'react';

const DROP_ANIMATION_CONFIG: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.1',
            },
        },
    }),
};

const SortableItemContext = createContext<SortableItemContext>({
    attributes: {},
    listeners: undefined,
    ref() {},
});

export function SortableItem({
    children,
    id,
}: PropsWithChildren<{
    id: UniqueIdentifier;
}>) {
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id });
    const context = useMemo(
        () => ({
            attributes,
            listeners,
            ref: setActivatorNodeRef,
        }),
        [attributes, listeners, setActivatorNodeRef]
    );
    const style: CSSProperties = {
        opacity: isDragging ? 0.3 : undefined,
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <SortableItemContext.Provider value={context}>
            <li
                className="justify-between items-center p-3 rounded-sm border border-borderPrimary bg-transparent h-fit flex"
                ref={setNodeRef}
                style={style}
            >
                {children}
            </li>
        </SortableItemContext.Provider>
    );
}

export function DragHandle() {
    const { attributes, listeners, ref } = useContext(SortableItemContext);

    return (
        <button
            className="-mr-2 flex p-2 w-fit h-fit justify-center items-center touch-none cursor-pointer rounded-sm"
            {...attributes}
            {...listeners}
            ref={ref}
        >
            <svg
                id="grip"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5.5 4.625C6.12132 4.625 6.625 4.12132 6.625 3.5C6.625 2.87868 6.12132 2.375 5.5 2.375C4.87868 2.375 4.375 2.87868 4.375 3.5C4.375 4.12132 4.87868 4.625 5.5 4.625ZM9.5 4.625C10.1213 4.625 10.625 4.12132 10.625 3.5C10.625 2.87868 10.1213 2.375 9.5 2.375C8.87868 2.375 8.375 2.87868 8.375 3.5C8.375 4.12132 8.87868 4.625 9.5 4.625ZM10.625 7.5C10.625 8.12132 10.1213 8.625 9.5 8.625C8.87868 8.625 8.375 8.12132 8.375 7.5C8.375 6.87868 8.87868 6.375 9.5 6.375C10.1213 6.375 10.625 6.87868 10.625 7.5ZM5.5 8.625C6.12132 8.625 6.625 8.12132 6.625 7.5C6.625 6.87868 6.12132 6.375 5.5 6.375C4.87868 6.375 4.375 6.87868 4.375 7.5C4.375 8.12132 4.87868 8.625 5.5 8.625ZM10.625 11.5C10.625 12.1213 10.1213 12.625 9.5 12.625C8.87868 12.625 8.375 12.1213 8.375 11.5C8.375 10.8787 8.87868 10.375 9.5 10.375C10.1213 10.375 10.625 10.8787 10.625 11.5ZM5.5 12.625C6.12132 12.625 6.625 12.1213 6.625 11.5C6.625 10.8787 6.12132 10.375 5.5 10.375C4.87868 10.375 4.375 10.8787 4.375 11.5C4.375 12.1213 4.87868 12.625 5.5 12.625Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                ></path>
            </svg>
        </button>
    );
}

export function SortableOverlay({ children }: PropsWithChildren) {
    return <DragOverlay dropAnimation={DROP_ANIMATION_CONFIG}>{children}</DragOverlay>;
}

export function SortableList<T extends BaseItem>({
    items,
    onChange,
    renderItem,
}: SortableListProps<T>) {
    const [active, setActive] = useState<Active | null>(null);
    const activeItem = useMemo(
        () => items.find((item) => item.id === active?.id),
        [active, items]
    );
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext
            sensors={sensors}
            onDragStart={({ active }) => {
                setActive(active);
            }}
            onDragEnd={({ active, over }) => {
                if (over && active.id !== over?.id) {
                    const activeIndex = items.findIndex(({ id }) => id === active.id);
                    const overIndex = items.findIndex(({ id }) => id === over.id);

                    onChange(arrayMove(items, activeIndex, overIndex));
                }
                setActive(null);
            }}
            onDragCancel={() => {
                setActive(null);
            }}
        >
            <SortableContext items={items}>
                <ul className="w-full flex flex-col px-4 h-fit gap-4" role="application">
                    {items.map((item) => (
                        <Fragment key={item.id}>{renderItem(item)}</Fragment>
                    ))}
                </ul>
            </SortableContext>
            <SortableOverlay>{activeItem ? renderItem(activeItem) : null}</SortableOverlay>
        </DndContext>
    );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;

interface SortableItemContext {
    attributes: Record<string, any>;
    listeners: DraggableSyntheticListeners;
    ref(node: HTMLElement | null): void;
}

interface BaseItem {
    id: UniqueIdentifier;
}

interface SortableListProps<T extends BaseItem> {
    items: T[];
    onChange(items: T[]): void;
    renderItem(item: T): ReactNode;
}
