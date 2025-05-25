import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
export default function ProtectedLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <SidebarProvider className="flex justify-between gap-6 bg-main-background">
   <AppSidebar />
   <main className="w-full p-6">
    <div className=" flex flex-col gap-6">
     <nav className="bg-white w-full h-[62px] rounded-md md:px-4  md:py-5">
      Top Menu
     </nav>
     <div className="bg-white w-full h-full rounded-md md:px-6 md:py-11">
      {children}
     </div>
    </div>
   </main>
  </SidebarProvider>
 );
}
