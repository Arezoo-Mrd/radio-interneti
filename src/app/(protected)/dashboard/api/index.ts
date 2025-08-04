import { API_PREFIX } from "@/app/(auth)/login/api/constants";
import { getCookie } from "@/lib/cookies";
import { fetchInstance } from "@/lib/fetch";

const DASHBOARD_INFO = `${API_PREFIX}/dashboard/info`;
const LOGS = `${API_PREFIX}/dashboard/logs`;



export type DashboardInfo = {
    listeners: number;
    musics: number;
    most_liked_musics: {
        title: string;
        likes: number;
    }[];
    visitors: {
        date: string;
        visitor: number;
    }[];
}


export const getDashboardInfo = async ({
    token,
}: {
    token?: string;
}) => {

    const currentToken = token || (await getCookie("token"));

    const response = await fetchInstance<DashboardInfo>({
        path: DASHBOARD_INFO,
        options: {
            method: "GET",
        },
        token: currentToken!,
    });


    return response?.data;
};


export const getLogs = async ({
    token,
}: {
    token?: string;
}) => {
    const currentToken = token || (await getCookie("token"));

    const response = await fetchInstance<{
        logs: string[];
    }>({
        path: LOGS,
        options: {
            method: "GET",
        },
        token: currentToken!,
    });


    return response?.data;
}

