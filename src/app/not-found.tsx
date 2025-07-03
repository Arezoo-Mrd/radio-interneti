
import Link from "next/link";

export default function NotFound() {
 return (
  <div className="text-black gap-5 h-full w-full flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
   <h1 className="text-4xl font-bold">این صفحه یافت نشد</h1>
   <p>صفحه مورد نظر شما یافت نشد. لطفا به صفحه اصلی بازگردید.</p>
   <Link href="/dashboard" className="bg-primary-button text-white px-4 py-2 rounded-md">بازگشت به صفحه اصلی</Link>

  </div>
 );
}