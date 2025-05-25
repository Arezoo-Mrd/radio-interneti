import Form from "@/components/Login/Form";
import Header from "@/components/Login/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "ورود به رادیو اینترنتی",
 description: "رادیو اینترنتی",
};

export default function LoginPage() {
 return (
  <div className="w-full flex h-full justify-center items-center">
   <div className="flex flex-col shadow bg-white rounded-xl w-[409px] h-fit p-8 border-[1px] border-white">
    <Header />
    <Form />
   </div>
  </div>
 );
}
