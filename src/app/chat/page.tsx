"use client";

import { SidebarProvider, SidebarInset, RightSidebarProvider, Sidebar } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app.sidebar";
import Chat from "../../components/chat/chat";
import RightSidebar from "../../components/chat/right.sidebar";
import ChatStreamPanel from "@/src/components/chat/chatStreamPanel";

export default function Home() {
  return (
    <div className="flex h-dvh w-full overflow-hidden">

      <SidebarProvider>
  <RightSidebarProvider>

    <AppSidebar />

    <Chat />

    <Sidebar side="right">
      <RightSidebar />
    </Sidebar>

  </RightSidebarProvider>
</SidebarProvider>


    </div>
  );
}