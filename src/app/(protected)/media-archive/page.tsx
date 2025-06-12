import MediaArchive from "@/components/MediaArchive";
import { getAllMusic } from "./api";

export default async function MediaArchivePage() {
 const allMusic = await getAllMusic({ isServer: true });
 console.log(allMusic);

 return <MediaArchive data={allMusic?.data} />;
}
