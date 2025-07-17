"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeSlash } from "iconsax-react";
import { useState } from "react";

function Input({
    className,
    type,
    error,
    ...props
}: React.ComponentProps<"input"> & { error?: string }) {
    return (
        <div className="flex flex-col gap-1">
            <input
                type={type}
                data-slot="input"
                autoComplete="off"
                className={cn(
                    "file:text-foreground bg-white focus:border-primary-light border-slate-light border-[1px] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30  flex w-full min-w-0 px-3.5 py-3.5 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed h-12 rounded-[10px] disabled:opacity-50  md:text-sm",
                    error && "border-red-500",
                    " aria-invalid:border-destructive",
                    className
                )}
                {...props}
            />
            <span className="text-red-500 text-[10px]">{error}</span>
        </div>
    );
}

function PasswordInput({
    className,
    error,
    ...props
}: React.ComponentProps<"input"> & { error?: string }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="flex flex-col gap-1">
            <div
                className={cn(
                    "file:text-foreground bg-white flex items-center px-3.5 py-3.5 justify-between focus:border-primary-light border-slate-light border-[1px] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30   w-full min-w-0  text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed h-12 rounded-[10px] disabled:opacity-50  md:text-sm",
                    error && "border-red-500",
                    " aria-invalid:border-destructive",
                    className
                )}
            >
                <input
                    autoComplete="off"
                    className="w-full h-full focus:outline-none"
                    type={isVisible ? "text" : "password"}
                    {...props}
                />
                <button
                    className="w-fit cursor-pointer"
                    onClick={() => setIsVisible(!isVisible)}
                    type="button"
                >
                    {isVisible ? (
                        <EyeSlash size="16" variant="Bold" color="#686868" />
                    ) : (
                        <Eye size="16" variant="Bold" color="#686868" />
                    )}
                </button>
            </div>
            <span className="text-red-500 text-[10px]">{error}</span>
        </div>
    );
}

export { Input, PasswordInput };
