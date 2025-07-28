import { useDeleteMusicMutation } from "@/app/(protected)/media-archive/api";
import type {
  FilterOptionsType,
  MusicType,
} from "@/app/(protected)/media-archive/api/api.types";
import { convertTimeToFarsi } from "@/lib/convertTimeToFarsi";
import { convertToFaNum } from "@/lib/convertToFaNum";
import { ADD_MEDIA_STATE } from "@/states/add-media";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit2, Heart, MusicSquareAdd, Sort, Trash } from "iconsax-react";
import { useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { AddMediaDialog } from "./AddMediaDialog";
import { toast } from "sonner";

type ColumnsProps = {
  playlists: FilterOptionsType["playlists"];
};

const Columns = ({ playlists }: ColumnsProps) => {
  const queryClient = useQueryClient();
  const { mutate: deleteMusic } = useDeleteMusicMutation(

  );
  const closeBtnRef = useRef<HTMLButtonElement>(null);


  const [isShowAddMediaDialog, setIsShowAddMediaDialog] = useState(false);
  const setAddMediaState = useSetAtom(ADD_MEDIA_STATE);

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
        return (
          <div className="flex flex-col gap-2 text-right">
            {row.original.playlists.map((playlist) => {
              return <div key={playlist.id}>{playlist.name}</div>
            })}
          </div>
        )
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
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-[#F11A3B]/20 w-6 h-6"
              onClick={() => deleteMusic(row.original.id.toString(), {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["all-music"] });
                  toast.success("موزیک با موفقیت حذف شد")
                }
              })}
            >
              <Trash size={20} color="#F11A3B" variant="Linear" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShowAddMediaDialog(true)}
              className="bg-[#7367F0]/20 w-6 h-6"
            >
              <MusicSquareAdd size={20} color="#7367F0" variant="Outline" />
            </Button>
            <Button onClick={() => {
              setAddMediaState({
                showEditMode: true,
                editableAudios: [{
                  id: row.original.id.toString(),
                  artist: row.original.artist || "",
                  title: row.original.title || "",
                  duration: row.original.duration || 0,
                  cover: row.original.cover || null,
                  musicId: row.original.id,
                  genreId: row.original.genre.id,
                  is_ads: row.original.is_ads,
                }]
              })
            }} variant="ghost" size="icon" className="bg-[#7367F0]/20 w-6 h-6 cursor-pointer">
              <Edit2 size={20} color="#7367F0" variant="Linear" />
            </Button>
            <AddMediaDialog
              playlists={playlists}
              open={isShowAddMediaDialog}
              setOpen={setIsShowAddMediaDialog}
              closeBtnRef={closeBtnRef}
              musicId={row.original.id}
            />
          </div>
        );
      },
    },
  ];

  return columns;
};

export default Columns;
