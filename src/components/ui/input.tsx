import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
 return (
  <input
   type={type}
   data-slot="input"
   className={cn(
    "file:text-foreground bg-white border-slate-light border-[1px] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30  flex w-full min-w-0 px-3.5 py-3.5 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed h-12 rounded-[10px] disabled:opacity-50  md:text-sm",
    "",
    " aria-invalid:border-destructive",
    className
   )}
   {...props}
  />
 );
}

export { Input };
