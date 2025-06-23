import { Input } from "@/components/ui/input";
import { ChangeEventHandler } from "react";
import { twMerge } from "tailwind-merge";

type ModifyInputType = {
 label: string;
 value: number | string;
 onChange: ChangeEventHandler<HTMLInputElement>;
 id: string;
 inputClassName?: string;
 wrapperClassName?: string;
};

const ModifyInput = ({
 label,
 id,
 value,
 onChange,
 inputClassName,
 wrapperClassName,
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
     inputClassName
    )}
   />
  </div>
 );
};

export default ModifyInput;
