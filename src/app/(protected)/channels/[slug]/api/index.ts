import { getCookie } from "@/lib/cookies";
import { fetchInstance } from "@/lib/fetch";
import { appendQueryParams } from "@/lib/queryParams";
import { ALL_PLAYLIST, DELETE_PLAYLIST } from "./constants";
import { PlaylistResponseType } from "./api.types";
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