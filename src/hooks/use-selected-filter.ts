import { useMemo } from "react";
import type {
    BaseFilterOptionType,
    FilterOptionsType,
} from "@/app/(protected)/media-archive/api/api.types";
import { useFilterParams } from "./use-filter-params";

export const defaultFilterOption: BaseFilterOptionType = {
    id: 0,
    name: "همه",
};

const mediaTypes: BaseFilterOptionType[] = [
    { id: -1, name: "همه" },
    { id: 0, name: "آهنگ" },
    { id: 1, name: "تبلیغ" },
];

export function useSelectedFilters(filterOptions: FilterOptionsType) {
    const { getFilterValue } = useFilterParams();

    const selectedFilters = useMemo(() => {
        const playlistId = getFilterValue("playlist");
        const artistName = getFilterValue("artist");
        const genreId = getFilterValue("genre");
        const mediaTypeId = getFilterValue("mediaType");
        const title = getFilterValue("title");

        return {
            playlist:
                filterOptions.playlists.find((p) => p.id === playlistId) ||
                defaultFilterOption,
            artist:
                filterOptions.artists.find((a) => a.name === artistName) ||
                defaultFilterOption,
            genre:
                filterOptions.genres.find((g) => g.id === genreId) || defaultFilterOption,
            mediaType:
                mediaTypes.find((m) => m.id === mediaTypeId) || defaultFilterOption,
            title,
        };
    }, [filterOptions, getFilterValue]);

    return { selectedFilters, mediaTypes };
}
