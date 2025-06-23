import MediaArchive from "@/components/MediaArchive";
import { cookies } from "next/headers";
import { getAllFilterData, getAllMusic } from "./api";

export default async function MediaArchivePage() {
 const token = (await cookies()).get("token")?.value || undefined;

 //  const allMusic = await getAllMusic({ token: token });
 //  const filterOptions = await getAllFilterData({ token: token });

 return (
  <MediaArchive
   initialData={[]}
   initialPagination={{
    current_page: 1,
    last_page: 0,
    per_page: 10,
    total: 10,
   }}
   filterOptions={{
    artists: [],
    genres: [],
    playlists: [],
   }}
  />
 );
}
