"use client";

import { useGetAllMusicQuery } from "@/app/(protected)/media-archive/api";
import type {
 FilterOptionsType,
 MediaArchiveType,
} from "@/app/(protected)/media-archive/api/api.types";
import type { SuccessResponse } from "@/lib/fetch";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Columns from "./Columns";
import { DataTable } from "./DataTable";
import { useSelectedFilters } from "@/hooks/use-selected-filter";

type MediaArchiveProps = {
 initialData?: MediaArchiveType | undefined;
 initialPagination?: SuccessResponse<MediaArchiveType>["paginate"] | undefined;
 filterOptions: FilterOptionsType | undefined;
};

const MediaArchive = ({
 initialData,
 initialPagination,
 filterOptions,
}: MediaArchiveProps) => {
 const searchParams = useSearchParams();

 const currentPage =
  searchParams.get("page") || initialPagination?.current_page || 1;
 const currentPageSize =
  searchParams.get("page_size") || initialPagination?.per_page || 10;

 const columns = Columns({
  playlists: filterOptions?.playlists || [],
 });
 const [page, setPage] = useState(Number(currentPage));
 const [pageSize, setPageSize] = useState(Number(currentPageSize));

 const { selectedFilters } = useSelectedFilters(
  filterOptions || {
   playlists: [],
   artists: [],
   genres: [],
  }
 );

 const router = useRouter();

 const {
  data: musicResponse,
  refetch,
  isLoading,
 } = useGetAllMusicQuery({
  page: page,
  page_size: pageSize,
  ...(selectedFilters.artist.id && {
   artist: selectedFilters.artist.name,
  }),
  ...(selectedFilters.genre.id && {
   genre_id: Number(selectedFilters.genre.id),
  }),
  ...(selectedFilters.playlist.id && {
   playlist_id: Number(selectedFilters.playlist.id),
  }),
  ...(selectedFilters.mediaType.id && {
   media_type: Number(selectedFilters.mediaType.id),
  }),
  ...(selectedFilters.title && {
   title: selectedFilters.title.toString(),
  }),
 });

 // Use the fetched data or fall back to initial data
 const currentData = musicResponse?.data || initialData || [];
 const currentPagination = musicResponse?.paginate || initialPagination;

 const handlePageChange = (newPage: number) => {
  if (
   newPage !== page &&
   newPage >= 1 &&
   newPage <= (currentPagination?.last_page || 1)
  ) {
   setPage(newPage);
  }
 };

 const handlePageSizeChange = (newPageSize: number) => {
  if (newPageSize !== pageSize) {
   router.push(`/media-archive?page=${page}&page_size=${newPageSize}`);
   setPageSize(newPageSize);
   setPage(1); // Reset to first page when changing page size
  }
 };

 //  useEffect(() => {
 //   if (selectedFilters.title) {
 //    setTimeout(() => {
 //     refetch();
 //    }, 500);
 //   } else {
 //    refetch();
 //   }
 //  }, [page, pageSize, selectedFilters, refetch]);

 return (
  <div className="w-full overflow-x-hidden">
   {isLoading ? (
    <div className="flex items-center flex-col gap-4 justify-center p-8">
     <Skeleton className="h-15 w-full" />
     <Skeleton className="h-15 w-full" />
     <Skeleton className="h-15 w-full" />
     <Skeleton className="h-15 w-full" />
     <Skeleton className="h-15 w-full" />
    </div>
   ) : (
    <DataTable
     columns={columns}
     data={currentData}
     filterOptions={
      filterOptions || {
       playlists: [],
       artists: [],
       genres: [],
      }
     }
     pagination={currentPagination}
     currentPageSize={Number(currentPageSize)}
     currentPage={Number(currentPage)}
     onPageChange={handlePageChange}
     onPageSizeChange={handlePageSizeChange}
     isLoading={isLoading}
    />
   )}
  </div>
 );
};

export default MediaArchive;
