"use client";

import { useLoginMutation } from "@/app/(auth)/login/api";
import { loginSchema, LoginSchema } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input, PasswordInput } from "../ui/input";

const Form = () => {
    const { mutate: login, isPending } = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = (data: LoginSchema) => {
        login(data);
    };

    return (
        <form
            className="w-full flex flex-col pt-14 justify-between h-full md:pt-8 relative z-10"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-4">
                <Input
                    placeholder="ایمیل"
                    {...register("email")}
                    error={errors.email?.message}
                />
                <PasswordInput
                    placeholder="رمز"
                    {...register("password")}
                    error={errors.password?.message}
                />
                {/* <div className="flex items-center gap-2">
     <Checkbox id="remember" />
     <label htmlFor="remember" className="text-sm text-slate-smoke">
      مرا به خاطر بسپار.
     </label>
    </div> */}
            </div>
            <div className="w-full md:pt-4">
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "در حال ورود..." : "ورود"}
                </Button>
            </div>
        </form>
    );
};

export default Form;
