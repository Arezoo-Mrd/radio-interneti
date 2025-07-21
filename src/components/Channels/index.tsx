"use client";

import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { GetAllLiveResponse } from "@/app/(protected)/live-channels/api/api.types";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import Columns from "./Column";

import { Skeleton } from "../ui/skeleton";
import { Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { PlaylistResponseType } from "@/app/(protected)/channels/[slug]/api/api.types";
import Link from "next/link";
import { useParams } from "next/navigation";

interface DataTableProps<TData> {
  data: TData[] | undefined;
  isLoading?: boolean;
}

export function Channels<TData extends PlaylistResponseType[0]>({
  data = [],
  isLoading,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { slug } = useParams();

  const columns = Columns();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-8 py-11 px-6">
      <div className="flex items-center justify-between gap-6  px-6 h-25 bg-background ">
        {/* Title */}
        <h1 className="text-[22px] font-PeydaMedium">پلی‌لیست کانال یک</h1>

        <div className="flex items-center gap-4 flex-1 justify-between">
          <div className="relative w-[229px]">
            <Search className="absolute right-3 top-[20px] transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="جستجو..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="w-[260px] pr-10 h-10 shadow-none"
            />
          </div>

          {/* Add New live Button */}
          <Button onClick={() => console.log("hi")} className="gap-2 flex items-center bg-[#7367F0]">
            <Link href={`/channels/${slug}/new-playlist`} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              افزودن پلی‌لیست جدید
            </Link>
          </Button>
        </div>
      </div>

      <>
        {isLoading && <Skeleton className="h-10 w-full" />}
        <div className="w-full overflow-x-auto min-h-[500px] flex flex-col justify-between overflow-y-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead
                        key={header.id + index}
                        className={`${header.id === "name" ? "text-right! px-10" : "text-center"
                          }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  const isSelected = row.getIsSelected();
                  return (
                    <TableRow
                      className={`py-0! h-15`}
                      key={row.id}
                      data-state={isSelected && "selected"}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell className="text-center py-0!" key={cell.id + index}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    هیچ نتیجه‌ای یافت نشد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>


        </div>
      </>
    </div>
  );
}
