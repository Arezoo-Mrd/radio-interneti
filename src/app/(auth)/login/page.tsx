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
   <div className="flex flex-col md:shadow md:bg-white md:rounded-xl w-full md:w-[409px] h-full md:h-fit p-6 md:p-8 md:border-[1px] border-white">
    <Header />
    <Form />
   </div>
  </div>
 );
}
