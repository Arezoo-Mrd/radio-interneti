import { AppSidebar } from "@/components/AppSidebar";
import TopMenu from "@/components/TopMenu";
import { Progress } from "@/components/ui/progress";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await auth();

    if (!user) {
        redirect("/login");
    }

    return (
        <SidebarProvider className="flex justify-between gap-6 bg-main-background">
            <Suspense fallback={<Progress value={33} className="w-full" />}>
                <AppSidebar />
                <main className="w-full  p-6">
                    <div className=" flex flex-col gap-6">
                        <nav className="bg-white w-full h-[62px] rounded-md md:px-4  md:py-5">
                            <TopMenu />
                        </nav>
                        <div className="bg-white w-full h-full rounded-md ">{children}</div>
                    </div>
                </main>
            </Suspense>
        </SidebarProvider>
    );
}
