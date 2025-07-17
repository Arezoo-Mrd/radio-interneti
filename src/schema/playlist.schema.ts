import { z } from "zod";

export const createPlaylistSchema = z.object({
 name: z.string().min(1, "نام پلی‌لیست الزامی است"),
 description: z.string().optional(),
 start_date: z.string().min(1, "تاریخ شروع الزامی است"),
 end_date: z.string().min(1, "تاریخ پایان الزامی است"),
 start_time: z.string().min(1, "زمان شروع الزامی است").refine((time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
 }, { message: "زمان شروع معتبر نیست" }),
 end_time: z.string().min(1, "زمان پایان الزامی است").refine((time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
 }, { message: "زمان پایان معتبر نیست" }),
 active: z.boolean().optional(),
}).refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  return startDate < endDate;
}, { message: "تاریخ شروع نباید بزرگتر از تاریخ پایان باشد" });

export type CreatePlaylistSchemaType = z.infer<typeof createPlaylistSchema>;