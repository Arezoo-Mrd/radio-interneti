import { z } from "zod";

export const addMediasToPlaylistSchema = z.object({
 playlist_id: z.number(),
 musics: z.array(z.object({ music_id: z.number() })).min(1, {
  message: "لطفا حداقل یک موزیک را انتخاب کنید",
 }),
});

export type AddMediasToPlaylistSchemaType = z.infer<
 typeof addMediasToPlaylistSchema
>;
