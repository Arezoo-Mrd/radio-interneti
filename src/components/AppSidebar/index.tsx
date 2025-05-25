import { Sidebar, SidebarContent, SidebarGroup } from "@/components/ui/sidebar";

export function AppSidebar() {
 return (
  <Sidebar side="right">
   <SidebarContent>
    <SidebarGroup />
    <SidebarGroup />
   </SidebarContent>
  </Sidebar>
 );
}
