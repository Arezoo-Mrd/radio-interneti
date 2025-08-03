"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { useDeletePlaylistMutation } from "@/app/(protected)/channels/[slug]/api";
import { PlaylistResponseType } from "@/app/(protected)/channels/[slug]/api/api.types";
import { Button } from "@/components/ui/button";
import { formattedDate } from "@/lib/formatDate";
import { Edit2, Trash } from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { useError } from "@/hooks/use-error";
import isLiveNow from "@/lib/isLiveNow";


const Columns = () => {

  const pathname = usePathname();
  const { mutate } = useDeletePlaylistMutation();
  const { errorHandler } = useError()

  const columns: ColumnDef<PlaylistResponseType[0]>[] = [
    {
      accessorKey: "name",
      header: "نام پلی لیست",
      cell: ({ row }) => {
        const liveShow = row.original;
        const isLive = isLiveNow(liveShow);
        return (
          <div className="text-[15px] text-right! px-5 min-w-[300px] flex items-center gap-4">
            <div>
              {row.getValue("name")}
            </div>
            <div className="">
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
          </div>
        )
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
      header: "موزیک‌ها",
      cell: ({ row }) => {
        const id = row.getValue("id") as number;
        return <Link href={`/media-archive?playlist=${id}`} className="text-center text-[#7367F0] underline text-sm">مشاهده</Link>;
      },
    },

    {
      accessorKey: "id",
      header: "عملیات",

      cell: ({ row }) => {
        const liveShow = row.original;

        const isLive = isLiveNow(liveShow);
        return (
          <div className="flex items-center gap-2">

            <Button
              disabled={isLive}
              variant="ghost"
              size="icon"
              className="bg-[#F11A3B]/20 cursor-pointer w-6 h-6"
              onClick={() => {
                mutate(liveShow.id.toString(), {
                  onSuccess: () => {
                    toast.success("پلی لیست با موفقیت حذف شد");
                  },
                  onError: (error) => {
                    errorHandler(error)
                  }
                })
              }}
            >
              <Trash size={20} color="#F11A3B" variant="Linear" />
            </Button>
            <Button disabled={isLive} variant="ghost" size="icon" className="bg-[#7367F0]/20 cursor-pointer w-6 h-6" >
              <Link href={`${pathname}/new-playlist?playlist_id=${liveShow.id}&edit=true`}>
                <Edit2 size={20} color="#7367F0" variant="Linear" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
  return columns;
};

export default Columns;
