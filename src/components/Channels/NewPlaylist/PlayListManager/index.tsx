import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Heart, Calendar, MoreVertical, Plus, Clock, GripVertical, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADD_PLAYLIST_STATE } from "@/states/add-playlist";
import { useAtom } from "jotai";
import { useGetAllMusicQuery } from "@/app/(protected)/media-archive/api";
import { MusicType } from "@/app/(protected)/media-archive/api/api.types";
import Image from "next/image";




function SortableItem({ item }: { item: MusicType }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white/50 rounded-xl border-2 border-dashed border-purple-300 h-20 opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.01] group relative overflow-hidden"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div className="flex items-center justify-between pl-8">
        <div className="flex items-center gap-4">
          <div className="relative group/play">
            <Image
              src={item.cover || "/mic.png"}
              alt={item.title}
              className="w-16 h-16 rounded-xl object-cover shadow-sm"
            />
            <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 group-hover/play:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
          </div>

          <div>
            <div className="font-semibold text-gray-800 text-lg">{item.title}</div>
            <div className="text-sm text-gray-500">{item.artist}</div>
            <div className="flex items-center gap-4 mt-1">

              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{item.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart
              className={cn(
                "w-5 h-5 transition-colors cursor-pointer",
                item.guest_like ? "text-red-500 fill-current" : "text-gray-400 hover:text-red-400"
              )}
            />
            <span className="text-sm text-gray-600 font-medium">
              {item.guest_like}
            </span>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PlaylistCard({ item }: { item: MusicType }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group/play">
            <Image
              src={item.cover || "/mic.png"}
              alt={item.title}
              className="w-16 h-16 rounded-xl object-cover shadow-sm"
            />
            <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 group-hover/play:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
          </div>

          <div>
            <div className="font-semibold text-gray-800 text-lg">{item.title}</div>
            <div className="text-sm text-gray-500">{item.artist}</div>
            <div className="flex items-center gap-4 mt-1">

              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{item.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart
              className={cn(
                "w-5 h-5 transition-colors cursor-pointer",
                item.guest_like ? "text-red-500 fill-current" : "text-gray-400 hover:text-red-400"
              )}
            />
            <span className="text-sm text-gray-600 font-medium">
              {item.guest_like}
            </span>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DroppableArea({ children, items }: { children: React.ReactNode, items: MusicType[] }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  const totalDuration = items.reduce((acc: number, item: MusicType) => {
    const [minutes, seconds] = item.duration.toString().split(':').map(Number);
    return acc + minutes * 60 + seconds;
  }, 0);

  const formatTotalDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 mb-8 transition-all duration-300",
        isOver ? "border-purple-400 bg-purple-50/50" : "border-purple-200 bg-gradient-to-br from-purple-25 to-blue-25"
      )}
    >
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-gray-800 mb-2">
          {formatTotalDuration(totalDuration)}
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Total Playlist Duration</span>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function PlaylistManager() {
  const { data: musics } = useGetAllMusicQuery({}, true)
  const [addPlaylistState, setAddPlaylistState] = useAtom(ADD_PLAYLIST_STATE)


  const [items, setItems] = useState<MusicType[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (musics) {
      const selectedMusics = musics?.data.filter((music) => addPlaylistState.musics.some((item) => item.music_id === music.id))
      setItems(selectedMusics || [])
    }
  }, [musics])


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

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  const activeItem = activeId
    ? items.find((item) => item.id === Number(activeId))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            My Playlist
          </h1>
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            <Plus className="w-4 h-4" />
            <span className="font-medium">Add New Track</span>
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          {/* Drop Zone */}
          <DroppableArea items={items}>
            <div className="space-y-3">
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                  <SortableItem key={item.id} item={item} />
                ))}
              </SortableContext>
            </div>
          </DroppableArea>

          <DragOverlay>
            {activeItem ? (
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 rotate-2 scale-105 ring-2 ring-purple-200">
                <PlaylistCard item={activeItem} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Recently Added Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Added</h2>
          <div className="space-y-3">
            {items.slice(0, 2).map((item, index) => (
              <PlaylistCard key={`recent-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}