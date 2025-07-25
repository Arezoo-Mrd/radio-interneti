"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { GetAllLiveResponse } from "@/app/(protected)/live-channels/api/api.types";
import { Button } from "@/components/ui/button";
import { formattedDate } from "@/lib/formatDate";
import { Trash } from "iconsax-react";
import { useDeleteLiveMutation } from "@/app/(protected)/live-channels/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const Columns = () => {
    const queryClient = useQueryClient();
    const { mutate } = useDeleteLiveMutation();
    const columns: ColumnDef<GetAllLiveResponse[0]>[] = [
        {
            accessorKey: "name",
            header: "موضوع لایو",
            cell: ({ row }) => (
                <div className="text-[15px] text-right! px-5 min-w-[300px]">
                    {row.getValue("name")}
                </div>
            ),
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

                return (
                    <div dir="ltr" className="text-center text-sm">
                        {formattedDate(startDate)}
                    </div>
                );
            },
        },
        {
            accessorKey: "end_date",
            header: "زمان پایان",
            cell: ({ row }) => {
                const endTime = row.getValue("end_date") as string;

                return (
                    <div dir="ltr" className="text-center text-sm">
                        {formattedDate(endTime)}
                    </div>
                );
            },
        },

        {
            accessorKey: "id",
            header: "عملیات",

            cell: ({ row }) => {
                const liveShow = row.original;
                return (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-[#F11A3B]/20 cursor-pointer w-6 h-6"
                        onClick={() => mutate(liveShow.id.toString(), {
                            onSuccess() {
                                toast.success("لایو با موفقیت حذف شد");
                                queryClient.invalidateQueries({ queryKey: ["live-channels"] });
                            },
                            onError(error) {
                                toast.error(error.message);
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
