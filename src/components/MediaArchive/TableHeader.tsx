"use client";

import {
    BaseFilterOptionType,
    FilterOptionsType,
} from "@/app/(protected)/media-archive/api/api.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFilterParams } from "@/hooks/use-filter-params";
import { useSelectedFilters } from "@/hooks/use-selected-filter";
import { Plus, Search } from "lucide-react";
import { useCallback } from "react";
import DropDownFilter from "./DropDownFilter";
import { useRouter } from "next/navigation";

interface MediaArchiveHeaderProps {
    filterOptions: FilterOptionsType;
}

export function MediaArchiveHeader({ filterOptions }: MediaArchiveHeaderProps) {
    const router = useRouter();
    const { selectedFilters, mediaTypes } = useSelectedFilters(filterOptions);

    const { updateFilter } = useFilterParams();

    const handleFilterSelect = useCallback(
        (
            filter: string | BaseFilterOptionType,
            type: "playlist" | "artist" | "genre" | "mediaType" | "title"
        ) => {
            if (type === "title") {
                updateFilter(type, filter as string);
            } else {
                updateFilter(type, (filter as BaseFilterOptionType).id);
            }
        },
        [updateFilter]
    );

    const onAddNew = () => {
        router.push("media-archive/add-media");
    };

    return (
        <div className="flex items-center justify-between gap-6  px-6 h-25 bg-background ">
            {/* Title */}
            <h1 className="text-[22px] font-PeydaMedium">آرشیو مدیا</h1>

            <div className="flex items-center gap-4 flex-1 justify-between">
                <div className="relative w-[229px]">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="جستجو..."
                        defaultValue={selectedFilters.title}
                        onChange={(e) => {
                            setTimeout(() => {
                                handleFilterSelect?.(e.target.value, "title");
                            }, 700);
                        }}
                        className="pr-10 text-right h-10"
                    />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex items-center gap-2">
                    {/* Genre Filter */}
                    <DropDownFilter
                        selected={selectedFilters.genre}
                        options={filterOptions?.genres || []}
                        onSelect={(filter) => handleFilterSelect(filter, "genre")}
                        label="ژانر موزیک"
                    />

                    {/* Media Type Filter */}
                    <DropDownFilter
                        selected={selectedFilters.mediaType}
                        options={mediaTypes}
                        onSelect={(filter) => handleFilterSelect(filter, "mediaType")}
                        label="نوع مدیا"
                    />
                    {/* Artist Filter */}
                    <DropDownFilter
                        selected={selectedFilters.artist}
                        options={filterOptions?.artists || []}
                        onSelect={(filter) => handleFilterSelect(filter, "artist")}
                        label="آرتیست"
                    />

                    {/* Playlist Filter */}
                    <DropDownFilter
                        selected={selectedFilters.playlist}
                        options={filterOptions?.playlists || []}
                        onSelect={(filter) => handleFilterSelect(filter, "playlist")}
                        label="پلی لیست"
                    />

                    {/* Add New Media Button */}
                    <Button onClick={onAddNew} className="gap-2 bg-[#7367F0]">
                        <Plus className="h-4 w-4" />
                        افزودن مدیا جدید
                    </Button>
                </div>
            </div>
        </div>
    );
}
