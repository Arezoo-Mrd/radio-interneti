"use client";

import type {
 MediaArchiveType,
 MusicType,
} from "@/app/(protected)/media-archive/api/api.types";
import { convertTimeToFarsi } from "@/lib/convertTimeToFarsi";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { DataTable } from "./DataTable";
import { convertToFaNum } from "@/lib/convertToFaNum";
import { Heart, Sort } from "iconsax-react";
import { Button } from "../ui/button";

type MediaArchiveProps = {
 data: MediaArchiveType | undefined;
};

const MediaArchive = ({ data }: MediaArchiveProps) => {
 const columns: ColumnDef<MusicType>[] = [
  {
   id: "select",
   header: ({ table }) => (
    <div className="min-w-13 flex items-center justify-center">
     <Checkbox
      checked={
       table.getIsAllPageRowsSelected() ||
       (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="cursor-pointer"
     />
    </div>
   ),
   cell: ({ row }) => {
    return (
     <div className="flex items-center justify-center">
      <Checkbox
       onCheckedChange={(checked) => {
        row.toggleSelected(!!checked);
       }}
       className="cursor-pointer"
       checked={row.getIsSelected()}
      />
     </div>
    );
   },
  },
  {
   accessorKey: "title",
   header: ({ column }) => {
    return (
     <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto cursor-pointer p-0 font-normal hover:bg-transparent"
     >
      نام مدیا
      <Sort
       className=""
       size={16}
       color={column.getIsSorted() === "asc" ? "#7367F0" : "#6C757D"}
      />
     </Button>
    );
   },
   enableSorting: true,
  },
  {
   accessorKey: "artist",
   header: "نام آرتیست",
  },
  {
   accessorKey: "guest_like",
   header: ({ column }) => {
    return (
     <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 font-normal hover:bg-transparent"
     >
      تعداد لایک‌ها
      <Sort
       className=""
       size={16}
       color={column.getIsSorted() === "asc" ? "#7367F0" : "#6C757D"}
      />
     </Button>
    );
   },
   cell: ({ row }) => {
    const convertedNum = convertToFaNum(row.original.guest_like);
    const like =
     row.original.guest_like > 9999
      ? convertToFaNum((row.original.guest_like / 1000).toFixed(1)) + "K"
      : convertedNum;

    return (
     <div className="flex items-center gap-2">
      <span className="w-10">{like}</span>
      <Heart color="#F04248" size={24} variant="Bold" />
     </div>
    );
   },
   enableSorting: true,
   sortingFn: (rowA, rowB) => {
    return rowA.original.guest_like - rowB.original.guest_like;
   },
  },
  {
   accessorKey: "duration",
   header: ({ column }) => {
    return (
     <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 font-normal hover:bg-transparent"
     >
      مدت زمان موزیک
      <Sort
       className=""
       size={16}
       color={column.getIsSorted() === "asc" ? "#7367F0" : "#6C757D"}
      />
     </Button>
    );
   },
   cell: ({ row }) => {
    return (
     <div className="text-center">
      {convertTimeToFarsi(row.original.duration)}
     </div>
    );
   },
   enableSorting: true,
   sortingFn: (rowA, rowB) => {
    return rowA.original.duration - rowB.original.duration;
   },
  },
  {
   accessorKey: "playlists",
   header: ({ column }) => {
    return (
     <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 font-normal hover:bg-transparent"
     >
      پلی لیست
      <Sort
       className=""
       size={16}
       color={column.getIsSorted() === "asc" ? "#7367F0" : "#6C757D"}
      />
     </Button>
    );
   },
   cell: ({ row }) => {
    return <div>{row.original.playlists[0]?.name}</div>;
   },
   enableSorting: true,
   sortingFn: (rowA, rowB) => {
    const nameA = rowA.original.playlists[0]?.name || "";
    const nameB = rowB.original.playlists[0]?.name || "";
    return nameA.localeCompare(nameB);
   },
  },
  {
   accessorKey: "id",
   header: "عملیات",
  },
 ];

 return (
  <div>
   <DataTable columns={columns} data={data} />
  </div>
 );
};

export default MediaArchive;
