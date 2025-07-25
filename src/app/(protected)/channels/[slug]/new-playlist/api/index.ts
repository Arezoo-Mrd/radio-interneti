import { getCookie } from "@/lib/cookies";
import { fetchInstance } from "@/lib/fetch";
import { appendQueryParams } from "@/lib/queryParams";
import { ALL_PLAYLIST, DELETE_PLAYLIST, STORE_PLAYLIST } from "./constants";
import { PlaylistResponseType, StorePlaylistResponseType, StorePlaylistType } from "./api.types";
import { DELETE_LIVE } from "@/app/(protected)/live-channels/api/constants";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


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

    const response = await fetchInstance<PlaylistResponseType>({
        path: params ? ALL_PLAYLIST + "?" + queryParams : ALL_PLAYLIST,
        options: {
            method: "GET",
        },
        token: currentToken!,
    });


    return response;
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

export const useDeletePlaylistMutation = () => {
    return useMutation({
        mutationFn: deletePlaylist,
        mutationKey: ["delete-playlist"],
        onSuccess() {
            toast.success("پلی‌لیست با موفقیت حذف شد");
        },
        onError() {
            toast.error("خطا در حذف پلی‌لیست");
        },
    });
};


export const useStorePlaylistMutation = () => {
    return useMutation({
        mutationFn: postStorePlaylist,
        mutationKey: ["store-playlist"],
        onSuccess() {
            toast.success("پلی‌لیست با موفقیت ثبت شد");
        },
        onError(error) {
            toast.error(error.message);
        },
    });
}