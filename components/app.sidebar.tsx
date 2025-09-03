// components/app.sidebar.tsx
import React from "react";
import { SidebarHeader, SidebarMenu } from "./ui/sidebar";

export const AppSidebar = () => {
  const menuItems = [
    { label: "Dashboard" },
    { label: "Projects" },
    { label: "Settings" },
    { label: "Logout" },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-100 border-r border-gray-300 flex flex-col">
      <SidebarHeader />
      <SidebarMenu items={menuItems} />
    </aside>
  );
};
