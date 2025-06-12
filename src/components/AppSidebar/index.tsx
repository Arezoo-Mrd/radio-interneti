"use client";
import {
 Sidebar,
 SidebarContent,
 SidebarGroup,
 SidebarGroupContent,
 SidebarGroupLabel,
 SidebarMenu,
 SidebarMenuButton,
 SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
 ArrowLeft2,
 Home2,
 Icon,
 Music,
 MusicFilter,
 MusicPlaylist,
} from "iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import RadioLogo from "@/assets/pngs/radio-logo.png";

type MenuItem = {
 title: string;
 url: string;
 icon: Icon;
};

const menuItems: MenuItem[] = [
 {
  title: "پیشخوان",
  url: "/dashboard",
  icon: Home2,
 },
 {
  title: "آرشیو مدیا",
  url: "/media-archive",
  icon: Music,
 },
 {
  title: "پلی لیست کانال یک",
  url: "/channels/1",
  icon: MusicPlaylist,
 },
 {
  title: "پلی لیست کانال دو",
  url: "/channels/2",
  icon: MusicPlaylist,
 },
 {
  title: "لایو مجری‌ها",
  url: "/live-channels",
  icon: MusicFilter,
 },
];

export function AppSidebar() {
 const pathname = usePathname();

 return (
  <Sidebar side="right">
   <SidebarContent>
    <SidebarGroup className="px-0">
     <SidebarGroupLabel className=" flex items-center border-b border-gray-200 px-4 rounded-none py-8">
      <Image src={RadioLogo} alt="radio-logo" width={100} height={100} />
     </SidebarGroupLabel>
     <SidebarGroupContent>
      <SidebarMenu className="pt-8">
       {menuItems.map((item) => (
        <SidebarMenuItem className="px-2.25  first:pb-3.5" key={item.title}>
         <SidebarMenuButton asChild>
          <Link
           className={`px-3 py-2.25 h-10 flex justify-between items-center ${
            pathname === item.url
             ? "text-white bg-[linear-gradient(270deg,_rgba(115,103,240,0.7)_0%,_#7367F0_100%)]"
             : ""
           }`}
           href={item.url}
          >
           <div className="flex items-center gap-2">
            <item.icon
             className={`w-5.5 h-5.5`}
             color={pathname === item.url ? "#fff" : "#292D32"}
            />
            <span className="text-md">{item.title}</span>
           </div>
           <ArrowLeft2
            className={`w-5.5 h-5.5 `}
            color={pathname === item.url ? "#fff" : "#292D32"}
           />
          </Link>
         </SidebarMenuButton>
        </SidebarMenuItem>
       ))}
      </SidebarMenu>
     </SidebarGroupContent>
    </SidebarGroup>
   </SidebarContent>
  </Sidebar>
 );
}
