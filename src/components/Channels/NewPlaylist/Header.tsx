import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type HeaderProps = {

};

const Header = ({ }: HeaderProps) => {
    const router = useRouter();
    const { slug } = useParams();

    const goBack = () => {
        router.push(`/channels/${slug}`);
    };

    return (
        <div className="flex w-full items-center justify-between pt-6 pb-8 border-b border-[#2F2B3D1F]">
            <div className="flex flex-col gap-2">
                <h4 className="text-2xl font-PeydaBold">افزودن پلی‌لیست جدید</h4>
                {/* BreadCrumb */}
                <div className="flex items-center text-sm gap-2 ">
                    <Link href={"/media-archive"} className="text-[#6C757D]">
                        پلی‌لیست کانال یک
                    </Link>
                    <span>/</span>
                    <span className="text-[#212529]">افزودن پلی‌لیست جدید</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button onClick={goBack} size={"lg"} variant={"outline"} className="h-11">
                    بازگشت
                </Button>

            </div>
        </div>
    );
};

export default Header;
