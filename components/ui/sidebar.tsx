// components/ui/sidebar.tsx
import React from "react";

// Sidebar Header
export const SidebarHeader = () => (
  <div className="p-4 text-xl font-bold border-b border-gray-300">
    My App
  </div>
);

// Sidebar Menu Item
export interface SidebarMenuItemProps {
  label: string;
  onClick?: () => void;
}
export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-2 hover:bg-gray-200 transition-colors"
  >
    {label}
  </button>
);

// Sidebar Menu (list of items)
export interface SidebarMenuProps {
  items: { label: string; onClick?: () => void }[];
}
export const SidebarMenu: React.FC<SidebarMenuProps> = ({ items }) => (
  <div className="flex flex-col">
    {items.map((item, index) => (
      <SidebarMenuItem key={index} label={item.label} onClick={item.onClick} />
    ))}
  </div>
);
