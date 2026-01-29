"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";
import { Button } from "./button";
import { RiSideBarFill, RiSideBarLine } from "@remixicon/react";

const RIGHT_SIDEBAR_WIDTH = "16rem";
const RIGHT_SIDEBAR_WIDTH_ICON = "3rem";

type RightSidebarContextProps = {
  open: boolean;
  toggle: () => void;
};

const RightSidebarContext = React.createContext<RightSidebarContextProps | null>(null);

export function useRightSidebar() {
  const ctx = React.useContext(RightSidebarContext);
  if (!ctx) throw new Error("useRightSidebar must be used within RightSidebarProvider");
  return ctx;
}

export function RightSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  const toggle = () => setOpen((o) => !o);

  return (
    <RightSidebarContext.Provider value={{ open, toggle }}>
      <div
        style={{
          "--right-sidebar-width": RIGHT_SIDEBAR_WIDTH,
          "--right-sidebar-width-icon": RIGHT_SIDEBAR_WIDTH_ICON,
        } as React.CSSProperties}
        className="group/right-sidebar-wrapper flex min-h-svh w-full"
      >
        {children}
      </div>
    </RightSidebarContext.Provider>
  );
}

/* ===== Right Sidebar UI ===== */

export function RightSidebar({
  className,
  children,
}: React.ComponentProps<"div">) {
  const { open } = useRightSidebar();

  return (
    <div
      className="group peer hidden md:block text-sidebar-foreground"
      data-state={open ? "expanded" : "collapsed"}
      data-side="right"
    >
      {/* gap */}
      <div
        className={cn(
          "relative w-[var(--right-sidebar-width)] transition-[width] duration-200",
          !open && "w-0"
        )}
      />

      {/* container */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-10 h-svh w-[var(--right-sidebar-width)] transition-[right,width] duration-200 md:flex",
          !open && "right-[calc(var(--right-sidebar-width)*-1)]",
          className
        )}
      >
        <div className="bg-sidebar flex h-full w-full flex-col border-l">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ===== Trigger Button ===== */

export function RightSidebarTrigger({ className }: { className?: string }) {
  const { open, toggle } = useRightSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className={cn("size-9 cursor-pointer", className)}
    >
      {open ? <RiSideBarFill className="size-5" /> : <RiSideBarLine className="size-5" />}
    </Button>
  );
}
