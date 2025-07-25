import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({
 className,
 error,
 ...props
}: React.ComponentProps<"textarea"> & { error?: string }) {
 return (
  <textarea
   data-slot="textarea"
   className={cn(
    "border-text-body placeholder:text-muted-foreground     aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border-[0.5px] bg-transparent px-3 py-2 text-sm  shadow-xs transition-[color,box-shadow] outline-none  disabled:cursor-not-allowed disabled:opacity-50 ",
    className,
    error && "border-red-500"
   )}
   {...props}
  />
 );
}

export { Textarea };
