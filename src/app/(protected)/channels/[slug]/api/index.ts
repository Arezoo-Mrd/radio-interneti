import { useError } from "@/hooks/use-error";
import { getCookie } from "@/lib/cookies";
import { fetchInstance } from "@/lib/fetch";
import { appendQueryParams } from "@/lib/queryParams";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlaylistResponseType } from "./api.types";
import { ALL_PLAYLIST, DELETE_PLAYLIST } from "./constants";


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
            cache: "no-store",
            next: {
                revalidate: 0
            }
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
    const { errorHandler } = useError()
    return useMutation({
        mutationFn: deletePlaylist,
        mutationKey: ["delete-playlist"],
        onSuccess(data) {
            toast.success("پلی‌لیست با موفقیت حذف شد");
            window.location.reload();

        },
        onError(error) {
            errorHandler(error)
        },
    });
};