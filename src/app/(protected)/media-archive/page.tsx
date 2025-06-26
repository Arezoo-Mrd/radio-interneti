import MediaArchive from "@/components/MediaArchive";
import { cookies } from "next/headers";
import { getAllFilterData, getAllMusic } from "./api";

export default async function MediaArchivePage() {
 const token = (await cookies()).get("token")?.value || undefined;

 const allMusic = await getAllMusic({ token: token });
 const filterOptions = await getAllFilterData({ token: token });

 return (
  <MediaArchive
   initialData={allMusic?.data}
   initialPagination={allMusic?.paginate}
   filterOptions={filterOptions?.data}
  />
 );
}
