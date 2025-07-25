import NotFound from "@/app/not-found";
import { getAllPlaylist } from "./api";
import { cookies } from "next/headers";
import { Channels } from "@/components/Channels";



export default async function ChannelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = (await cookies()).get("token")?.value;

  if (slug !== "1" && slug !== "2") {
    return <NotFound />
  }

  const playlist = await getAllPlaylist({
    params: {
      channel_id: Number(slug),
      activate: 1,
    },
    token: token!,
  });


  return (
    <Channels data={playlist?.data} />
  )
}

