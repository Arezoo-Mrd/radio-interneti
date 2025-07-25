import { useGetAllMusicQuery } from "@/app/(protected)/media-archive/api";
import { MusicType } from "@/app/(protected)/media-archive/api/api.types";
import { Button } from "@/components/ui/button";
import { ADD_PLAYLIST_STATE } from "@/states/add-playlist";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DroppableArea from "./DroppableArea";
import PlaylistCard from "./PlayListCard";
import SortableItem from "./SortableItem";


export default function PlaylistManager() {
  const { data: musics } = useGetAllMusicQuery({}, true)
  const [addPlaylistState, setAddPlaylistState] = useAtom(ADD_PLAYLIST_STATE)


  console.log('addPlaylistState', addPlaylistState)


  type ItemType = MusicType & { position: number }



  const [items, setItems] = useState<ItemType[]>([] as ItemType[]);
  const [activeId, setActiveId] = useState<string | null>(null);

  console.log('items', items)


  useEffect(() => {
    if (musics) {
      const selectedMusics = musics?.data.filter((music) => addPlaylistState.musics.some((item) => item.music_id === music.id))
      setItems(selectedMusics?.map((music, index) => ({
        ...music,
        position: index + 1
      })) || [])
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
    <div className="min-h-screen  p-6">
      <div className="">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-base text-[#373737] font-PeydaSemiBold">
            موزیک‌های پلی‌لیست
          </h1>
          <div className="flex gap-1">
            <Button
              type="submit"
              disabled
              size={"lg"}
              className={` bg-primary-main`}
            >
              {"ذخیره و اضافه"}
            </Button>
            <Button
              onClick={() => {
                console.log({
                  items,
                  playListId: addPlaylistState.playListId
                })
              }}

              size={"lg"} className="gap-2 flex items-center bg-primary-main">
              <Link href={`/media-archive/add-media`} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                افزودن پلی‌لیست جدید
              </Link>
            </Button>

          </div>
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
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-1 rotate-2  h-fit ">
                <PlaylistCard item={activeItem} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>


      </div>
    </div>
  );
}