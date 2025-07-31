"use client";

import { useGetAllMusicQuery, useGetFilterOptions } from "@/app/(protected)/media-archive/api";
import { useSelectedFilters } from "@/hooks/use-selected-filter";
import { ADD_MEDIA_STATE } from "@/states/add-media";
import { useAtom, useAtomValue } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import AddMedia from "./AddMedia";
import Columns from "./Columns";
import { DataTable } from "./DataTable";

type MediaArchiveProps = {
};

const MediaArchive = ({

}: MediaArchiveProps) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const searchParams = useSearchParams();
    const { data: filterOptions, isLoading: isLoadingFilterOptions } = useGetFilterOptions();
    const { selectedFilters } = useSelectedFilters(
        filterOptions?.data || {
            playlists: [],
            artists: [],
            genres: [],
        }
    );


    const {
        data: musicResponse,
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
            is_ads: Number(selectedFilters.mediaType.id) === 1 ? 1 : 0,
        }),
        ...(selectedFilters.title && {
            title: selectedFilters.title.toString(),
        }),
    }, true);



    const currentPage =
        searchParams.get("page") || musicResponse?.paginate?.current_page || 1;
    const currentPageSize =
        searchParams.get("page_size") || musicResponse?.paginate?.per_page || 10;

    const columns =
        Columns({
            playlists: filterOptions?.data?.playlists || [],
        })



    const [addMediaState, setAddMediaState] = useAtom(ADD_MEDIA_STATE)

    useEffect(() => {
        return () => {
            setAddMediaState({
                ...addMediaState,
                showEditMode: false,
            })
        }
    }, [])



    const router = useRouter();




    const currentPagination = musicResponse?.paginate || musicResponse?.paginate;

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



    return (
        <div className="w-full overflow-x-hidden px-6.5">
            {isLoading || isLoadingFilterOptions ? (
                <div className="flex items-center flex-col gap-4 justify-center p-8">
                    <Skeleton className="h-15 w-full" />
                    <Skeleton className="h-15 w-full" />
                    <Skeleton className="h-15 w-full" />
                    <Skeleton className="h-15 w-full" />
                    <Skeleton className="h-15 w-full" />
                </div>
            ) : (
                addMediaState.showEditMode ? <AddMedia /> :
                    <DataTable
                        columns={columns}
                        data={musicResponse?.data || []}
                        filterOptions={
                            filterOptions?.data || {
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
