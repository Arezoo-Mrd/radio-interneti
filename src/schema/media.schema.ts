import { z } from "zod";

export const addMediasToPlaylistSchema = z.object({
    playlist_id: z.number().min(1, {
        message: "لطفا حداقل یک پلی لیست را انتخاب کنید",
    }),
    musics: z.array(z.number()).min(1, {
        message: "لطفا حداقل یک موزیک را انتخاب کنید",
    }),
});

export const modifyMusicSchema = z.object({
    title: z.string().min(1, "وارد کردن نام برای آهنگ الزامی است"),
    artist: z.string().min(1, "وارد کردن نام برای خواننده الزامی است"),
    album: z.string().optional(),
    cover: z
        .instanceof(File)
        .refine(
            (file) =>
                file?.type && ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
            { message: "فرمت کاور می‌بایست شامل png یا jpg یا jpeg باشد" }
        )
        .optional(),
    genre_id: z.number().min(0, "انتخاب ژانر الزامی است"),
    is_ads: z.boolean(),
});

export type AddMediasToPlaylistSchemaType = z.infer<
    typeof addMediasToPlaylistSchema
>;

export type ModifyMusicSchemaType = z.infer<typeof modifyMusicSchema>;
