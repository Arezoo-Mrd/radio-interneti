"use client";

import {
 type ColumnDef,
 flexRender,
 getCoreRowModel,
 useReactTable,
 getSortedRowModel,
 type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

import type { MusicType } from "@/app/(protected)/media-archive/api/api.types";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData extends MusicType, TValue> {
 columns: ColumnDef<TData, TValue>[];
 data: TData[] | undefined;
}

export function DataTable<TData extends MusicType, TValue>({
 columns,
 data,
}: DataTableProps<TData, TValue>) {
 const [sorting, setSorting] = useState<SortingState>([]);

 const table = useReactTable({
  data: data || [],
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: setSorting,
  state: {
   sorting,
  },
 });

 return (
  <div className="">
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
        داده ای یافت نشد
       </TableCell>
      </TableRow>
     )}
    </TableBody>
   </Table>
  </div>
 );
}
