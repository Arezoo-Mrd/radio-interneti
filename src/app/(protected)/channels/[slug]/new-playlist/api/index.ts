import { getCookie } from "@/lib/cookies";
import { fetchInstance } from "@/lib/fetch";
import { appendQueryParams } from "@/lib/queryParams";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DetachMusicFromPlaylistType, PlaylistResponseType, SinglePlaylistResponseType, StorePlaylistResponseType, StorePlaylistType, UpdateMusicPositionType } from "./api.types";
import { ALL_PLAYLIST, DELETE_PLAYLIST, DETACH_MUSIC_FROM_PLAYLIST, SHOW_PLAYLIST, STORE_PLAYLIST, UPDATE_MUSIC_POSITION, UPDATE_PLAYLIST } from "./constants";
import { useError } from "@/hooks/use-error";


export const getAllPlaylist = async ({
    params,
    token,
}: {
    params?: {
        channel_id?: number,
        activate?: 0 | 1,
    };
    token?: string;
}) => {
    const queryParams = appendQueryParams(params || {});
    const currentToken = token || (await getCookie("token"));

    const response = await fetchInstance<PlaylistResponseType[0]>({
        path: params ? ALL_PLAYLIST + "?" + queryParams : ALL_PLAYLIST,
        options: {
            method: "GET",
        },
        token: currentToken!,
    });


    return response;
};


const getSinglePlaylist = async (id: string, token?: string) => {
    const currentToken = token || await getCookie("token");
    const response = await fetchInstance<SinglePlaylistResponseType>({
        path: SHOW_PLAYLIST(id),
        options: {
            method: "GET",
        },
        token: currentToken!,
    });
    return response?.data;
}

export const getPlaylist = async (id: string, token?: string) => {
    const currentToken = token || await getCookie("token");
    const response = await fetchInstance<PlaylistResponseType[0]>({
        path: SHOW_PLAYLIST(id),
        options: {
            method: "GET",
            cache: "no-store",
        },
        token: currentToken!,
    });
    return response?.data;
};

const postStorePlaylist = async (data: StorePlaylistType) => {
    const currentToken = await getCookie("token");
    data.activate = true
    data.start_date = new Date(data.start_date).toISOString().split("T")[0] as unknown as Date
    data.end_date = new Date(data.end_date).toISOString().split("T")[0] as unknown as Date

    const response = await fetchInstance<StorePlaylistResponseType>({
        path: STORE_PLAYLIST,
        options: {
            method: "POST",
            body: JSON.stringify(data),
        },
        token: currentToken!,
    });

    return response;
};

const updatePlaylist = async ({
    id,
    data,

}: {
    id: string,
    data: StorePlaylistType,

}) => {
    const currentToken = await getCookie("token");
    data.activate = true
    data.start_date = new Date(data.start_date).toISOString().split("T")[0] as unknown as Date
    data.end_date = new Date(data.end_date).toISOString().split("T")[0] as unknown as Date
    data.start_time = data.start_time.split(":")[0] + ":" + data.start_time.split(":")[1]
    data.end_time = data.end_time.split(":")[0] + ":" + data.end_time.split(":")[1]

    const response = await fetchInstance<StorePlaylistResponseType>({
        path: UPDATE_PLAYLIST(id),
        options: {
            method: "PUT",
            body: JSON.stringify(data),
        },
        token: currentToken!,
    });

    return response;
}

const updateMusicPosition = async (data: UpdateMusicPositionType) => {
    const currentToken = await getCookie("token");

    const response = await fetchInstance({
        path: UPDATE_MUSIC_POSITION,
        options: {
            method: "PUT",
            body: JSON.stringify(data),
        },
        token: currentToken!,
    });

    return response;
}


const deletePlaylist = async (id: string) => {
    const currentToken = await getCookie("token");

    const response = await fetchInstance<any>({
        path: DELETE_PLAYLIST(id),
        options: {
            method: "DELETE",
        },
        token: currentToken!,
    });

    return response;
};

const detachMusicFromPlaylist = async (data: DetachMusicFromPlaylistType) => {
    const currentToken = await getCookie("token");
    const response = await fetchInstance({
        path: DETACH_MUSIC_FROM_PLAYLIST,
        options: {
            method: "DELETE",
            body: JSON.stringify(data),
        },
        token: currentToken!,
    });

    return response;
}

export const useDeletePlaylistMutation = () => {
    const { errorHandler } = useError()
    return useMutation({
        mutationFn: deletePlaylist,
        mutationKey: ["delete-playlist"],
        onSuccess() {
            toast.success("پلی‌لیست با موفقیت حذف شد");
        },
        onError(error) {
            errorHandler(error)
        },
    });
};


export const useStorePlaylistMutation = () => {
    const { errorHandler } = useError()
    return useMutation({
        mutationFn: postStorePlaylist,
        mutationKey: ["store-playlist"],
        onSuccess() {
            toast.success("پلی‌لیست با موفقیت ثبت شد");
        },
        onError(error) {
            errorHandler(error)
        },
    });
}


export const useGetPlaylistQuery = (id: string) => {
    return useQuery({
        queryKey: ["playlist", id],
        queryFn: () => getPlaylist(id),
        enabled: !!id,
        gcTime: 0,
        refetchOnWindowFocus: true,
        staleTime: 0,
    });
}

export const useUpdatePlaylistMutation = () => {
    const { errorHandler } = useError()
    return useMutation({
        mutationFn: updatePlaylist,
        mutationKey: ["update-playlist"],
        onSuccess() {
            toast.success("پلی‌لیست با موفقیت به روز شد");
        },
        onError(error) {
            errorHandler(error)
        },
    });
}


export const useUpdateMusicPositionMutation = () => {
    const queryClient = useQueryClient()
    const { errorHandler } = useError()
    return useMutation({
        mutationFn: updateMusicPosition,
        mutationKey: ["update-music-position"],
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["single-playlist"] })
        },
        onError(error) {
            errorHandler(error)
        }
    });
}
export const useGetSinglePlaylistQuery = (id: string) => {
    return useQuery({
        queryKey: ["single-playlist", id],
        refetchOnWindowFocus: true,
        staleTime: 0,
        queryFn: () => getSinglePlaylist(id),
        enabled: !!id,
    });
}

export const useDetachMusicFromPlaylistMutation = () => {
    const { errorHandler } = useError()
    return useMutation({
        mutationFn: detachMusicFromPlaylist,
        mutationKey: ["detach-music-from-playlist"],
        onSuccess() {
            toast.success("موزیک با موفقیت از پلی‌لیست حذف شد");
        },
        onError(error) {
            errorHandler(error)
        },
    });
}   