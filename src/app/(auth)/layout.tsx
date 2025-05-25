import LoginBg from "@/assets/pngs/loginBg.png";
import Image from "next/image";
export default function AuthLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <div className="bg-login-bg w-full h-svh md:h-screen ">
   <Image
    src={LoginBg}
    alt="loginBg"
    className="w-full absolute top-0 h-full object-cover"
   />
   {children}
  </div>
 );
}
