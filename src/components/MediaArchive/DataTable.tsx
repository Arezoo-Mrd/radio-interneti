"use client";

import {
 type ColumnDef,
 flexRender,
 getCoreRowModel,
 getSortedRowModel,
 type SortingState,
 useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import type {
 FilterOptionsType,
 MusicType,
} from "@/app/(protected)/media-archive/api/api.types";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import type { SuccessResponse } from "@/lib/fetch";
import { generatePageNumbers } from "@/lib/generatePageNumbers";
import { Skeleton } from "../ui/skeleton";
import TableFooter from "./TableFooter";
import { MediaArchiveHeader } from "./TableHeader";

interface DataTableProps<TData extends MusicType, TValue> {
 columns: ColumnDef<TData, TValue>[];
 data: TData[] | undefined;
 pagination?: SuccessResponse<TData>["paginate"];
 onPageChange: (page: number) => void;
 onPageSizeChange: (pageSize: number) => void;
 currentPage: number;
 currentPageSize: number;
 isLoading?: boolean;
 onAddNew?: () => void;
 onPlaylistChange?: (playlist: string) => void;
 onArtistChange?: (artist: string) => void;
 onMediaTypeChange?: (mediaType: string) => void;
 onGenreChange?: (genre: string) => void;
 filterOptions: FilterOptionsType;
}

export function DataTable<TData extends MusicType, TValue>({
 columns,
 data,
 pagination,
 onPageChange,
 onPageSizeChange,
 isLoading,
 currentPage,
 currentPageSize,
 filterOptions,
}: DataTableProps<TData, TValue>) {
 const [sorting, setSorting] = useState<SortingState>([]);

 const table = useReactTable({
  data: data || [],
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: setSorting,
  manualPagination: true,
  state: {
   sorting,
  },
 });

 const pageNumbers = generatePageNumbers(pagination);

 return (
  <div className="space-y-4">
   {/* Media Archive Header */}
   <MediaArchiveHeader filterOptions={filterOptions} />

   {/* Table Content */}
   <>
    {isLoading && <Skeleton className="h-10 w-full" />}
    <div className="w-full overflow-x-auto min-h-[500px] flex flex-col justify-between overflow-y-hidden">
     <Table>
      <TableHeader>
       {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
         {headerGroup.headers.map((header) => {
          return (
           <TableHead key={header.id} className="text-center">
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
           className={` h-19`}
           key={row.id}
           data-state={isSelected && "selected"}
          >
           {row.getVisibleCells().map((cell) => (
            <TableCell className="text-center" key={cell.id}>
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

     {/* Pagination Controls */}
     {pagination && (
      <TableFooter
       pagination={pagination}
       onPageSizeChange={onPageSizeChange}
       currentPage={currentPage}
       currentPageSize={currentPageSize}
       onPageChange={onPageChange}
       pageNumbers={pageNumbers}
      />
     )}
    </div>
   </>
  </div>
 );
}
