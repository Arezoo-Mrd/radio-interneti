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


const Columns = () => {

  const pathname = usePathname();
  const { mutate } = useDeletePlaylistMutation();


  const columns: ColumnDef<PlaylistResponseType[0]>[] = [
    {
      accessorKey: "name",
      header: "نام پلی لیست",
      cell: ({ row }) => (
        <div className="text-[15px] text-right! px-5 min-w-[300px]">
          {row.getValue("name")}
        </div>
      ),
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
        return (
          <div className="flex items-center gap-2">

            <Button
              variant="ghost"
              size="icon"
              className="bg-[#F11A3B]/20 cursor-pointer w-6 h-6"
              onClick={() => {
                mutate(liveShow.id.toString(), {
                  onSuccess: () => {
                    toast.success("پلی لیست با موفقیت حذف شد");
                  },
                  onError: (e) => {
                    if (e instanceof Error) {
                      toast.error(e.message);
                    }
                    toast.error("خطایی رخ داده است");
                  }
                })
              }}
            >
              <Trash size={20} color="#F11A3B" variant="Linear" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-[#7367F0]/20 cursor-pointer w-6 h-6" >
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
