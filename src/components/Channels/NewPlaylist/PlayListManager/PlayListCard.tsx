import { MusicType } from "@/app/(protected)/media-archive/api/api.types";
import { cn } from "@/lib/utils";
import { Clock, Heart, MoreVertical, Play } from "lucide-react";
import Image from "next/image";
function PlaylistCard({ item }: { item: MusicType }) {

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
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


export default PlaylistCard;