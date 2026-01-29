"use client";

import {
  RightSidebar,
} from "./ui/right-sidebar";

export function AppRightSidebar() {
  return (
    <RightSidebar>
      <div className="p-4">
        <h2 className="text-sm font-semibold mb-3">
          Follow-up Prompts
        </h2>

        <div className="space-y-2 text-sm text-sidebar-foreground/80">
          <div className="rounded-md bg-sidebar-accent p-2">
            Summarize this conversation
          </div>
          <div className="rounded-md bg-sidebar-accent p-2">
            Explain more deeply
          </div>
          <div className="rounded-md bg-sidebar-accent p-2">
            Generate code example
          </div>
        </div>
      </div>
    </RightSidebar>
  );
}
