import { getCookie } from "@/lib/cookies";
import { StoreMusicRequestType, StoreMusicResponseType, UpdateMusicRequestType } from "./api.types";
import { fetchInstance } from "@/lib/fetch";
import { STORE_MUSICS, UPDATE_MUSICS } from "./constants";
import { useMutation } from "@tanstack/react-query";

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
            headers: {
                "Content-Type": "application/octet-stream",
            },
        },
        token: currentToken!,
    });

    return response;
};


const postUpdateMusic = async (body: UpdateMusicRequestType) => {
    const formData = new FormData();

    if (body.cover) {
        formData.append("cover", body.cover);
    }

    formData.append("title", body.title);
    formData.append("artist", body.artist);
    formData.append("album", body.album || "");
    formData.append("genre_id", body.genre_id.toString());
    formData.append("is_ads", body.is_ads.toString());

    const currentToken = await getCookie("token");
    const response = await fetchInstance({
        path: UPDATE_MUSICS(body.musicId.toString()),
        options: {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/octet-stream",
            },
        },
        token: currentToken!,
    });

    return response;
}

export const useStoreMusicMutation = () => {
    return useMutation({
        mutationKey: ["store-music"],
        mutationFn: postStoreMusic,
    });
};

export const useUpdateMusicMutation = () => {
    return useMutation({
        mutationKey: ["update-music"],
        mutationFn: postUpdateMusic,
    });
};