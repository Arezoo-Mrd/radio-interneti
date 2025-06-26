import { cookies } from "next/headers";
import { getAllLive } from "./api";
import { LiveChannels } from "@/components/LiveChannels";

export default async function LiveChannelsPage() {
 const token = (await cookies()).get("token")?.value || undefined;

 const allLive = await getAllLive({
  token,
  params: {
   page: 1,
   per_page: 30,
  },
 });

 return <LiveChannels data={allLive?.data} />;
}
