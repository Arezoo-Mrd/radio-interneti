
import { MusicType } from "@/app/(protected)/media-archive/api/api.types";
import { convertTimeToFarsi } from "@/lib/convertTimeToFarsi";
import { cn } from "@/lib/utils";
import {
    useDroppable
} from "@dnd-kit/core";
import { Clock } from "iconsax-react";



function DroppableArea({ children, items }: { children: React.ReactNode, items: MusicType[] }) {
    const { isOver, setNodeRef } = useDroppable({
        id: "droppable",
    });



    const totalDuration = items.reduce((acc: number, item: MusicType) => {
        return acc + item.duration;
    }, 0);


    return (
        <div
            ref={setNodeRef}
            className={cn(
                " transition-all duration-300"
            )}
        >
            <div className=" rounded-lg p-4 mb-8  bg-[#7367F052]/40 border border-[#7367F052] text-center px-4 flex w-full justify-between">
                <div className="flex items-center justify-center gap-3 ">
                    <Clock color="#292D32" size={21} className="w-5 h-5" />
                    <span className="text-sm text-[#292D32]">مجموع زمان‌ها</span>
                </div>
                <div className="text-[15px] font-PeydaBold  text-[#2F2B3D]">
                    {convertTimeToFarsi(totalDuration)}
                </div>
            </div>
            {children}
        </div>
    );
}


export default DroppableArea;