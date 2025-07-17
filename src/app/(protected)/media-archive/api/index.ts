import { defaultFilterOption } from "@/hooks/use-selected-filter";
import { getCookie } from "@/lib/cookies";
import { fetchInstance, SuccessResponse } from "@/lib/fetch";
import { appendQueryParams } from "@/lib/queryParams";
import { AddMediasToPlaylistSchemaType } from "@/schema/media.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AssignBulkMediasToPlaylistRequestType,
    FilterOptionsType,
    GetAllMusicQueryParams,
    GetFilterOptionsResponse,
    MediaArchiveType
} from "./api.types";
import {
    ADD_MEDIAS_TO_PLAYLIST,
    ALL_MUSIC,
    ASSIGN_BULK_MEDIAS_TO_PLAYLIST,
    DELETE_MUSIC,
    GET_FILTER_OPTIONS,
} from "./constants";

export const getAllMusic = async ({
    params,
    token,
}: {
    params?: GetAllMusicQueryParams;
    token?: string;
}) => {
    const queryParams = appendQueryParams(params || {});
    const currentToken = token || (await getCookie("token"));

    const response = await fetchInstance<MediaArchiveType>({
        path: params ? ALL_MUSIC + "?" + queryParams : ALL_MUSIC,
        options: {
            method: "GET",
        },
        token: currentToken!,
    });

    return response;
};

export const getAllFilterData = async ({
    token,
}: {
    token?: string;
}): Promise<SuccessResponse<FilterOptionsType> | undefined> => {
    const currentToken = token || (await getCookie("token"));

    const response = await fetchInstance<GetFilterOptionsResponse>({
        path: GET_FILTER_OPTIONS,
        options: {
            method: "GET",
        },
        token: currentToken!,
    });

    if (response && response?.data) {
        return {
            ...response,
            data: {
                genres: [defaultFilterOption, ...response.data.genres],
                playlists: [defaultFilterOption, ...response.data.playlists],
                artists: response.data.artists.map((artist: string) => ({
                    id: artist,
                    name: artist,
                })),
            },
        };
    }

    return undefined;
};

const deleteMusic = async (id: string) => {
    const currentToken = await getCookie("token");

    const response = await fetchInstance<{ message: string }>({
        path: DELETE_MUSIC(id),
        options: { method: "DELETE" },
        token: currentToken!,
    });

    return response;
};

const addMediasToPlaylist = async (data: AddMediasToPlaylistSchemaType) => {
    const currentToken = await getCookie("token");
    const response = await fetchInstance<{ message: string }>({
        path: ADD_MEDIAS_TO_PLAYLIST,
        options: { method: "POST", body: JSON.stringify(data) },
        token: currentToken!,
    });

    return response;
};

const putAssignBulkMediasToPlaylist = async (data: AssignBulkMediasToPlaylistRequestType) => {
    const currentToken = await getCookie("token");
    const response = await fetchInstance<{ message: string }>({
        path: ASSIGN_BULK_MEDIAS_TO_PLAYLIST,
        options: { method: "PUT", body: JSON.stringify(data) },
        token: currentToken!,
    });

    return response;
};

export const useGetAllMusicQuery = (params?: GetAllMusicQueryParams, isEnabled: boolean = false) => {
    return useQuery({
        queryKey: ["all-music", params],
        queryFn: () => getAllMusic({ params }),
        enabled: isEnabled,
    });
};

export const useDeleteMusicMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMusic,
        mutationKey: ["delete-music"],

    });
};

export const useAddMediasToPlaylistMutation = () => {
    return useMutation({
        mutationFn: addMediasToPlaylist,
        mutationKey: ["add-medias-to-playlist"],
    });
};

export const useGetFilterOptions = () => {
    return useQuery({
        queryKey: ["filter-options"],
        queryFn: () => getAllFilterData({ token: undefined }),
    });
};

export const usePutAssignBulkMediasToPlaylistMutation = () => {
    return useMutation({
        mutationFn: putAssignBulkMediasToPlaylist,
        mutationKey: ["put-assign-bulk-medias-to-playlist"],
    });
};
