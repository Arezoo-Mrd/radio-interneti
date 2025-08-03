import { getCookie } from "@/lib/cookies";
import { StoreMusicRequestType, StoreMusicResponseType, UpdateMusicRequestType } from "./api.types";
import { fetchInstance } from "@/lib/fetch";
import { STORE_MUSICS, UPDATE_MUSICS } from "./constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useError } from "@/hooks/use-error";

const postStoreMusic = async (body: StoreMusicRequestType) => {
    const formData = new FormData();


    body.music.forEach((file) => {
        formData.append("music", file);
    });

    const currentToken = await getCookie("token");
    const response = await fetchInstance<StoreMusicResponseType>({
        path: STORE_MUSICS,
        options: {
            method: "POST",
            body: formData,

        },
        token: currentToken!,
    });

    return response;
};

const postUpdateMusic = async (body: UpdateMusicRequestType) => {
    const formData = new FormData();

    formData.append("title", body.title);
    formData.append("artist", body.artist);
    formData.append("album", body.album || "");
    formData.append("cover", body.cover || "");
    formData.append("is_ads", body.is_ads ? "1" : "0");
    formData.append("musicId", body.musicId.toString());
    formData.append("genre_id", body.genre_id.toString());

    const currentToken = await getCookie("token");

    const response = await fetchInstance({
        path: UPDATE_MUSICS(body.musicId.toString()),
        options: {
            method: "POST",
            body: formData,
        },
        token: currentToken!,
    });

    return response;
}

export const useStoreMusicMutation = () => {
    const { errorHandler } = useError()
    return useMutation({
        mutationKey: ["store-music"],
        mutationFn: postStoreMusic,
        onError: (error) => {
            errorHandler(error)
        }
    });
};

export const useUpdateMusicMutation = () => {
    const queryClient = useQueryClient();
    const { errorHandler } = useError()
    return useMutation({
        mutationKey: ["update-music"],
        mutationFn: postUpdateMusic,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-music"] });
        },
        onError: (error) => {
            errorHandler(error)
        }
    });
};