import { Button } from "@/components/ui/button";
import { ADD_MEDIA_STATE } from "@/states/add-media";
import { Loader2 } from "lucide-react";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";

type HeaderProps = {
    disabled: boolean;
    saveChanges: () => any;
    isEditMode: boolean;
    isLoading: boolean;
};

const Header = ({ disabled, saveChanges, isEditMode, isLoading }: HeaderProps) => {
    const router = useRouter();

    const setAddMediaState = useSetAtom(ADD_MEDIA_STATE);
    const goBack = () => {
        router.push("/media-archive");
        setAddMediaState({
            editableAudios: [],
            showEditMode: false,
        })

    };

    return (
        <div className="flex w-full items-center justify-between pt-6 pb-8 border-b border-[#2F2B3D1F]">
            <div className="flex flex-col gap-2">
                <h4 className="text-2xl font-PeydaBold">افزودن مدیا جدید</h4>
                {/* BreadCrumb */}
                <div className="flex items-center text-sm gap-2 ">
                    <Link href={"/media-archive"} className="text-[#6C757D]">
                        آرشیو مدیا
                    </Link>
                    <span>/</span>
                    <span className="text-[#212529]">افزودن مدیا جدید</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button onClick={goBack} size={"lg"} variant={"outline"} className="h-11">
                    بازگشت
                </Button>
                {!isEditMode && (
                    <Button
                        onClick={saveChanges}
                        size={"lg"}
                        disabled={disabled}
                        className={`h-11 w-32 ${disabled ? "bg-[#C3C3C3A6] text-[#7D7D7D]" : "bg-primary-main"
                            }`}
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره و اضافه"}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Header;
