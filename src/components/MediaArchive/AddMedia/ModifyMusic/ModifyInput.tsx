import { Input } from "@/components/ui/input";
import { ChangeEventHandler } from "react";
import { twMerge } from "tailwind-merge";

type ModifyInputType = React.ComponentProps<"input"> & {
 label: string;
 value: number | string;
 onChange?: ChangeEventHandler<HTMLInputElement>;
 id: string;
 inputClassName?: string;
 wrapperClassName?: string;
 errorMessage?: string;
};

const ModifyInput = ({
 label,
 id,
 value,
 onChange,
 inputClassName,
 wrapperClassName,
 errorMessage,
 ...inputProps
}: ModifyInputType) => {
 return (
  <div className={twMerge("space-y-2 min-w-[215px]", wrapperClassName)}>
   <label htmlFor={id} className="block">
    {label}
   </label>
   <Input
    id={id}
    value={value}
    onChange={onChange}
    className={twMerge(
     "border-[#CECECE] shadow-none bg-transparent h-10 rounded-lg",
     errorMessage && "border-red-500",
     inputClassName
    )}
    error={errorMessage}
    {...inputProps}
   />
  </div>
 );
};

export default ModifyInput;
