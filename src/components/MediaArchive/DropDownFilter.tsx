import { BaseFilterOptionType } from "@/app/(protected)/media-archive/api/api.types";
import { ArrowDown2 } from "iconsax-react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const DropDownFilter = ({
    selected,
    options,
    onSelect,
    label,
}: {
    selected: BaseFilterOptionType;
    label: string;
    options: BaseFilterOptionType[];
    onSelect: (option: BaseFilterOptionType) => void;
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-2 border-0 shadow-none hover:bg-transparent focus:ring-0 focus:ring-offset-0"
                >
                    {label}
                    <span dir="ltr" className="font-PeydaBold truncate max-w-[50px]">{selected.name}</span>

                    <ArrowDown2 size="32" color="#090909" variant="Bold" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[500px] overflow-y-auto">
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.id}
                        onClick={() => onSelect(option)}
                        className="text-right"
                    >
                        {option.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropDownFilter;
