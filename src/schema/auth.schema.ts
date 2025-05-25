import { z } from "zod";

export const loginSchema = z.object({
 email: z.string().email("ایمیل نامعتبر است"),
 password: z.string().min(8, "رمز باید حداقل 8 کاراکتر باشد"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
