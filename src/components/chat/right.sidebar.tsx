"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "../ui/sidebar";

export default function RightSidebar() {
  return (
    <Sidebar side="right" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Context Panel</SidebarGroupLabel>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-4 text-sm text-neutral-300">
          Right sidebar skeleton.  
          Later you can put prompt lists or references here.
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
