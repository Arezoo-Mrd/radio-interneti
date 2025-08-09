import { useDetachMusicFromPlaylistMutation } from "@/app/(protected)/channels/[slug]/new-playlist/api";
import { SinglePlaylistResponseType } from "@/app/(protected)/channels/[slug]/new-playlist/api/api.types";
import { MusicType } from "@/app/(protected)/media-archive/api/api.types";
import { Button } from "@/components/ui/button";
import { convertTimeToFarsi } from "@/lib/convertTimeToFarsi";
import { convertToFaNum } from "@/lib/convertToFaNum";
import { cn } from "@/lib/utils";
import { ADD_PLAYLIST_STATE } from "@/states/add-playlist";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash } from "iconsax-react";
import { useAtom } from "jotai";
import { GripVertical, Heart, Play } from "lucide-react";
import Image from "next/image";

function SortableItem({ item }: { item: SinglePlaylistResponseType["musics"][0] | MusicType }) {
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


    const [addPlaylistState, setAddPlaylistState] = useAtom(ADD_PLAYLIST_STATE)



    const { mutate: detachMusicFromPlaylist, isPending: isDetachingMusicFromPlaylist } = useDetachMusicFromPlaylistMutation();

    const deleteMusic = (id: string) => {
        const filteredMusics = addPlaylistState.musics.filter((music) => music.id !== Number(id))
        detachMusicFromPlaylist({
            playlist_id: addPlaylistState.playListId,
            musics: [{
                music_id: Number(id)
            }]
        }, {
            onSuccess: () => {
                setAddPlaylistState((prev) => {
                    return {
                        ...prev,
                        musics: filteredMusics
                    }
                })
            }
        })

    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-white/50 rounded-xl border-dashed border-purple-300 h-fit opacity-50"
            />
        );
    }




    return (
        <div
            ref={setNodeRef}
            style={style}
            className=" rounded-xl shadow-sm border bg-[#F5F5F5] border-gray-100 px-4 py-2 hover:shadow-md transition-all duration-200 hover:scale-[1.01] group relative overflow-hidden"
        >
            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing  group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="w-5 h-5 text-black" />
            </div>

            <div className="flex items-center justify-between pr-8">
                <div className="flex items-center gap-4">
                    <div className="relative group/play">
                        <Image
                            src={item.cover || "/mic.png"}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-xl object-cover shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 group-hover/play:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-6 h-6 text-white fill-current" />
                        </div>
                    </div>

                    <div>
                        <div className="font-semibold text-gray-800 text-lg">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.artist}</div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">
                            {convertToFaNum(item.guest_like)}
                        </span>
                        <Heart
                            className={cn(
                                "w-5 h-5 transition-colors cursor-pointer",
                                item.guest_like ? "text-red-500 fill-current" : "text-gray-400 hover:text-red-400"
                            )}
                        />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span className="text-[15px] text-[#2F2B3D]">{convertTimeToFarsi(item.duration)}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-[#F11A3B]/20 cursor-pointer w-6 h-6"
                        onClick={() => {
                            deleteMusic(item.id.toString())

                        }}
                    >
                        <Trash size={20} color="#F11A3B" variant="Linear" />
                    </Button>
                </div>
            </div>
        </div>
    );
}


export default SortableItem;