export const fetchCache = "force-no-store";


import { NewPlaylist } from "@/components/Channels/NewPlaylist";
import { cookies } from "next/headers";
import { getPlaylist } from "./api";



export default async function NewPlaylistPage({ searchParams }: { searchParams: Promise<{ playlist_id?: string }> }) {
    const token = (await cookies()).get("token")?.value
    const playlistId = (await searchParams).playlist_id;
    const playlist = playlistId ? await getPlaylist(playlistId!, token) : null

    return <NewPlaylist playlist={playlist} />;
}