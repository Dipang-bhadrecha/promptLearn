"use client";

import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app.sidebar";
import Chat from "../../components/chat/chat";
import RightSidebar from "../../components/chat/right.sidebar";

export default function Home() {
  return (
    <div className="flex h-dvh w-full overflow-hidden">

      {/* LEFT SIDEBAR PROVIDER */}
      <SidebarProvider>

        {/* Left Sidebar */}
        <AppSidebar />

        {/* MAIN CONTENT + RIGHT SIDEBAR PROVIDER */}
        <SidebarProvider>

          {/* Main Content */}
          <SidebarInset >
            <Chat />
          </SidebarInset>

          {/* Right Sidebar */}
          <RightSidebar />

        </SidebarProvider>

      </SidebarProvider>

    </div>
  );
}