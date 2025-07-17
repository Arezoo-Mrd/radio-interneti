import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { twMerge } from "tailwind-merge";

type DropDownProps = {
    label: string;
    onValueChange: (value: string) => any;
    placeholder: string;
    items: { label: string; value: string }[];
    id: string;
    wrapperClassName?: string;
    triggerClassName?: string;
    errorMessage?: string
};

const DropDown = ({
    items,
    label,
    onValueChange,
    placeholder,
    errorMessage,
    id,
    wrapperClassName,
    triggerClassName,
}: DropDownProps) => {
    return (
        <div className={twMerge("space-y-2 ", wrapperClassName)}>
            <label htmlFor={id} className="text-right block">
                {label}
            </label>
            <Select onValueChange={onValueChange}>
                <SelectTrigger
                    className={twMerge(
                        "bg-transparent w-full h-10! mb-0 shadow-none border-[#CECECE]",
                        triggerClassName
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent dir="rtl">
                    {items.map((item) => {
                        return (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
            <span className="text-red-500 text-[10px]">{errorMessage}</span>
        </div>
    );
};

export default DropDown;
