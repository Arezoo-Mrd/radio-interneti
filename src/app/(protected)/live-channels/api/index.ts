import { fetchInstance } from "@/lib/fetch";
import { GetAllLiveResponse } from "./api.types";
import { GetAllMusicQueryParams } from "../../media-archive/api/api.types";
import { ALL_LIVE, DELETE_LIVE } from "./constants";
import { getCookie } from "@/lib/cookies";
import { appendQueryParams } from "@/lib/queryParams";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const getAllLive = async ({
    params,
    token,
}: {
    params?: GetAllMusicQueryParams;
    token?: string;
}) => {
    const queryParams = appendQueryParams(params || {});
    const currentToken = token || (await getCookie("token"));

    const response = await fetchInstance<GetAllLiveResponse>({
        path: params ? ALL_LIVE + "?" + queryParams : ALL_LIVE,
        options: {
            method: "GET",
        },
        token: currentToken!,
    });

    return response;
};

const deleteLive = async (id: string) => {
    const currentToken = await getCookie("token");

    const response = await fetchInstance<GetAllLiveResponse>({
        path: DELETE_LIVE(id),
        options: {
            method: "DELETE",
        },
        token: currentToken!,
    });

    return response;
};

export const useDeleteLiveMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLive,
        mutationKey: ["delete-live"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["live-channels"] });
        }

    });
}
