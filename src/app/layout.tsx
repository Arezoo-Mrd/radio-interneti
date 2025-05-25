import "@/assets/styles/globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "رادیو اینترنتی",
 description: "رادیو اینترنتی",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="en" dir="rtl">
   <body className={`font-Peyda`}>
    <QueryProvider>{children}</QueryProvider>
   </body>
  </html>
 );
}
