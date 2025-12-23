"use client";

import { SidebarProvider } from "../../components/ui/sidebar";
import dynamic from "next/dynamic";
import { AppSidebar } from "../../components/app.sidebar";
import Chat from "@/src/components/chat/chat";

const Workflow = dynamic(() => import("../../components/workflow"), { ssr: false });

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Chat />
    </SidebarProvider>
  );
}
