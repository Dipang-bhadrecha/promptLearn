import { SidebarProvider } from "@/src/components/ui/sidebar";
import { RightSidebarProvider } from "@/src/components/ui/right-sidebar";
import { AppSidebar } from "@/src/components/app.sidebar";
import { AppRightSidebar } from "@/src/components/app.rightsidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <RightSidebarProvider>
        <div className="flex h-dvh w-full overflow-hidden">
          <AppSidebar />
          <div className="flex-1 relative">
            {children}
          </div>
          <AppRightSidebar />
        </div>
      </RightSidebarProvider>
    </SidebarProvider>
  );
}
