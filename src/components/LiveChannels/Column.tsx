"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { GetAllLiveResponse } from "@/app/(protected)/live-channels/api/api.types";
import { Button } from "@/components/ui/button";
import { formattedDate } from "@/lib/formatDate";
import { Trash } from "iconsax-react";
import { useDeleteLiveMutation } from "@/app/(protected)/live-channels/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import isLiveNow from "@/lib/isLiveNow";
import { useError } from "@/hooks/use-error";


const Columns = () => {
    const queryClient = useQueryClient();
    const { mutate } = useDeleteLiveMutation();
    const { errorHandler } = useError()
    const columns: ColumnDef<GetAllLiveResponse[0]>[] = [
        {
            accessorKey: "name",
            header: "موضوع لایو",
            cell: ({ row }) => {
                const liveShow = row.original;
                const isLive = isLiveNow(liveShow);

                return (
                    <div className="text-[15px] text-right! gap-4 px-5 min-w-[300px] flex items-center ">
                        <span>  {row.getValue("name")}</span>
                        {isLive && (
                            <div className="flex gap-2 text-xs border border-[#7367F0] bg-[#7367F0]/10 text-[#7367F0] rounded-sm px-[14px] py-[8px] font-PeydaMedium text-[12px]">
                                <div className="flex items-center gap-1">
                                    {[4, 3, 1, 2, 3].map((item, index) => (
                                        <span
                                            key={index}
                                            className="w-[2px] bg-[#7367F0] rounded-full"
                                            style={{
                                                height: `${item * 5}px`,
                                                animation: `pulse-height 0.4s linear ${item * 0.1}s infinite alternate`,
                                                transformOrigin: 'bottom',
                                                display: 'inline-block',
                                            }}
                                        ></span>
                                    ))}
                                </div>
                                <span>در حال پخش</span>
                            </div>
                        )}

                    </div>
                );
            },
        },
        {
            accessorKey: "presenter",
            header: "افراد حاضر در لایو",
            cell: ({ row }) => {
                const presenters = row.getValue("presenter") as { name: string }[];
                const presenterString = presenters.map((p) => p.name).join(", ");
                return (
                    <div className=" text-sm truncate  w-[160px]">{presenterString}</div>
                );
            },
        },
        {
            accessorKey: "start_date",
            header: "زمان شروع",
            cell: ({ row }) => {
                const startDate = row.getValue("start_date") as string;
                const startTime = row.original.start_time as string;

                return (
                    <div dir="ltr" className="text-center text-sm">
                        {formattedDate(startDate + "T" + startTime)}
                    </div>
                );
            },
        },
        {
            accessorKey: "end_date",
            header: "زمان پایان",
            cell: ({ row }) => {
                const endTime = row.original.end_time as string;
                const endDate = row.original.end_date as string;

                return (
                    <div dir="ltr" className="text-center text-sm">
                        {formattedDate(endDate + "T" + endTime)}
                    </div>
                );
            },
        },

        {
            accessorKey: "id",
            header: "عملیات",

            cell: ({ row }) => {
                const liveShow = row.original;

                const isLive = isLiveNow(liveShow);

                return (
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={isLive}
                        className="bg-[#F11A3B]/20 cursor-pointer w-6 h-6"
                        onClick={() => mutate(liveShow.id.toString(), {
                            onSuccess() {
                                toast.success("لایو با موفقیت حذف شد");
                                queryClient.invalidateQueries({ queryKey: ["live-channels"] });
                            },
                            onError(error) {
                                errorHandler(error)
                            },
                        })}
                    >
                        <Trash size={20} color="#F11A3B" variant="Linear" />
                    </Button>
                );
            },
        },
    ];
    return columns;
};

export default Columns;
