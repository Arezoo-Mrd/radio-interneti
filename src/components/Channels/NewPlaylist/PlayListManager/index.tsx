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

import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DroppableArea from "./DroppableArea";
import PlaylistCard from "./PlayListCard";
import SortableItem from "./SortableItem";
import { useGetSinglePlaylistQuery, useUpdateMusicPositionMutation } from "@/app/(protected)/channels/[slug]/new-playlist/api";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { SinglePlaylistResponseType } from "@/app/(protected)/channels/[slug]/new-playlist/api/api.types";


export default function PlaylistManager({ playlistId }: { playlistId: number }) {

  const { data: playlistData, isLoading: isLoadingPlaylist } = useGetSinglePlaylistQuery(playlistId.toString())

  const { slug } = useParams()
  const router = useRouter()


  const [items, setItems] = useState<SinglePlaylistResponseType["musics"]>([] as SinglePlaylistResponseType["musics"]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { mutate: updateMusicPositionMutation, isPending } = useUpdateMusicPositionMutation()




  useEffect(() => {
    if (playlistData) {
      setItems(playlistData.musics)
    }
  }, [playlistData])


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
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const position = items.findIndex((item) => item.id === over?.id)
    if (active.id !== over?.id) {
      setItems((items) => {
        return arrayMove(items, oldIndex, position);
      });
    }

    setActiveId(null);
  }

  const activeItem = activeId
    ? items.find((item) => item.id === Number(activeId))
    : null;


  const updateMusicPosition = () => {
    updateMusicPositionMutation({
      playlist_id: playlistData?.id || 0,
      musics: items.map((item, index) => ({
        music_id: item.id,
        position: index + 1
      }))
    }, {
      onSuccess: () => {

        toast.success("پلی‌لیست با موفقیت به روز شد");
        router.push(`/channels/${slug}`)
      },
      onError: (error) => {
        toast.error(error.message);
      }
    })
  }




  return (isLoadingPlaylist ? <div className="flex justify-center items-center h-[400px]">
    <Loader2 className="w-11 h-11 animate-spin text-primary-main" />
  </div> :
    <div className="min-h-screen  p-6">
      <div className="">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-base text-[#373737] font-PeydaSemiBold">
            موزیک‌های پلی‌لیست
          </h1>
          <div className="flex gap-1">
            <Button
              type="submit"
              disabled={isPending}
              size={"lg"}
              className={` bg-primary-main ${isPending ? "opacity-50" : ""}`}
              onClick={updateMusicPosition}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره و اضافه"}
            </Button>
            <Button


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