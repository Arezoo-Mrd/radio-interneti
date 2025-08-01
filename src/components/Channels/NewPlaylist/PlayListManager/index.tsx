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

import { useGetSinglePlaylistQuery, useUpdateMusicPositionMutation } from "@/app/(protected)/channels/[slug]/new-playlist/api";
import { useError } from "@/hooks/use-error";
import { useAtom } from "jotai";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddMusicToPlayList from "../AddMusicToPlayList";
import DroppableArea from "./DroppableArea";
import PlaylistCard from "./PlayListCard";
import SortableItem from "./SortableItem";


export default function PlaylistManager({ playlistId }: { playlistId: number }) {

  const { data: playlistData, isLoading: isLoadingPlaylist } = useGetSinglePlaylistQuery(playlistId.toString())
  const [addPlaylistState, setAddPlaylistState] = useAtom(ADD_PLAYLIST_STATE)
  const { errorHandler } = useError()
  const { slug } = useParams()
  const router = useRouter()



  const [activeId, setActiveId] = useState<string | null>(null);

  const { mutate: updateMusicPositionMutation, isPending } = useUpdateMusicPositionMutation()




  useEffect(() => {
    if (playlistData) {
      setAddPlaylistState((prev) => ({
        ...prev,
        musics: playlistData.musics
      }))
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
    const oldIndex = addPlaylistState.musics.findIndex((item) => item.id === active.id);
    const position = addPlaylistState.musics.findIndex((item) => item.id === over?.id)
    if (active.id !== over?.id) {
      setAddPlaylistState((prev) => {
        return {
          ...prev,
          musics: arrayMove(prev.musics, oldIndex, position)
        }
      });
    }

    setActiveId(null);
  }

  const activeItem = activeId
    ? addPlaylistState.musics.find((item) => item.id === Number(activeId))
    : null;


  const updateMusicPosition = () => {
    updateMusicPositionMutation({
      playlist_id: playlistData?.id || 0,
      musics: addPlaylistState.musics.map((item, index) => ({
        ...item,
        music_id: item.id,
        position: index + 1
      }))
    }, {
      onSuccess: () => {

        toast.success("پلی‌لیست با موفقیت به روز شد");
        router.push(`/channels/${slug}`)
      },
      onError: (error) => {
        errorHandler(error)
      }
    })
  }




  return (isLoadingPlaylist ? <div className="flex justify-center items-center h-[400px]">
    <Loader2 className="w-11 h-11 animate-spin text-primary-main" />
  </div> :
    <div className="h-fit p-6">
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

        <div className="pb-4">
          <AddMusicToPlayList playlistName={playlistData?.name || ""} playlistId={playlistData?.id || 0} />

        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          {/* Drop Zone */}
          <DroppableArea items={addPlaylistState.musics} >
            <div className="space-y-3">
              <SortableContext items={addPlaylistState.musics} strategy={verticalListSortingStrategy}>
                {addPlaylistState.musics.map((item) => (
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