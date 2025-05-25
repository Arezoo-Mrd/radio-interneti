"use client";
import RadioLogo from "@/assets/pngs/radioLogo.png";
import Image from "next/image";
const Header = () => {
 return (
  <div className="w-full flex flex-col items-center justify-center">
   <Image src={RadioLogo} alt="radioLogo" width={86.3} height={26.3} />
   <div className="flex flex-col items-center justify-center md:pt-8 md:gap-3">
    <h2 className="text-slate-dark text-2xl font-PeydaBold ">ورود </h2>
    <p className="text-sm text-slate-smoke">
     برای دسترسی به پنل مدیریت، وارد حساب کاربری خود شوید.
    </p>
   </div>
  </div>
 );
};

export default Header;
