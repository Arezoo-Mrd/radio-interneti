import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

type HeaderProps = {
 disabled: boolean;
 saveChanges: () => any;
};

const Header = ({ disabled, saveChanges }: HeaderProps) => {
 const router = useRouter();

 const goBack = () => {
  router.back();
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
    <Button
     onClick={saveChanges}
     size={"lg"}
     disabled={disabled}
     className={`h-11 ${
      disabled ? "bg-[#C3C3C3A6] text-[#7D7D7D]" : "bg-primary-main"
     }`}
    >
     ذخیره و اضافه
    </Button>
   </div>
  </div>
 );
};

export default Header;
