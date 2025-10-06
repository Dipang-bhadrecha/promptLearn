"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "../components/ui/sidebar";
import { useWorkflowStore } from "../lib/workflow-store";
import {
  RiAddLine,
  RiArrowDownBoxLine,
  RiComputerLine,
  RiGithubLine,
  RiKeyLine,
  RiMoonLine,
  RiSunLine,
} from "@remixicon/react";
import { MoreVerticalIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
// import ApiKeys from "./api-keys";
// import ImportDialog from "./import-dialogue";
import Logo from "./logo";

export function AppSidebar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Local rename state to avoid typing lag/drop issues caused by global state updates
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [localRenameValue, setLocalRenameValue] = useState<string>("");

  const { createWorkflow, switchWorkflow, currentWorkflowId, deleteWorkflow, renameWorkflow } =
    useWorkflowStore(
      useShallow((state) => ({
        createWorkflow: state.createWorkflow,
        switchWorkflow: state.switchWorkflow,
        currentWorkflowId: state.currentWorkflowId,
        deleteWorkflow: state.deleteWorkflow,
        renameWorkflow: state.renameWorkflow,
      }))
    );

  function handleStartRename(workflow: { id: string; name: string }) {
    setRenamingId(workflow.id);
    setLocalRenameValue(workflow.name);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this workflow?")) {
      console.log("Delete workflow", id);
      deleteWorkflow(id); // already in store
    }
  }

  // Save rename only once and only if still renaming the same id
  function handleSaveRename(id: string, newName: string) {
    const trimmed = newName.trim();
    if (trimmed) {
      renameWorkflow(id, trimmed);
    }
    setRenamingId(null);
  }

  function handleCancelRename() {
    setRenamingId(null);
    setLocalRenameValue("");
  }

  const workflows = useWorkflowStore(
    useShallow((state) =>
      state.workflows
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    )
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = workflows.map((workflow) => {
    const isRenaming = renamingId === workflow.id;

    return (
      <SidebarMenuItem key={workflow.id} className="relative group">
        {isRenaming ? (
          <input
            type="text"
            defaultValue={workflow.name}
            onBlur={(e) => handleSaveRename(workflow.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveRename(workflow.id, (e.target as HTMLInputElement).value);
              }
              if (e.key === "Escape") {
                handleCancelRename();
              }
            }}
            autoFocus
            ref={(el) => {
              if (el) el.select();
            }}

            className="w-full rounded px-2 py-1 text-sm bg-transparent outline-none border border-sidebar-border " // cursor-pointer pointer need to be fixed
          />
        ) : (
          <SidebarMenuButton
            onClick={() => switchWorkflow(workflow.id)}
            isActive={workflow.id === currentWorkflowId}
            className="w-full pr-8 relative"
          >
            <span className="truncate">{workflow.name}</span>
          </SidebarMenuButton>
        )}

      </SidebarMenuItem>
    );
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 flex items-center gap-2">
          {/* <Logo className="size-18" /> */}
          <span className="text-2xl tracking-tighter font-sans leading-none font-medium">
            Prompt
            <br />
            Flow
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>New</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => createWorkflow()}>
                  <RiAddLine className="size-4 shrink-0" />
                  New Flow
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                {/* <ImportDialog>
                  <SidebarMenuButton>
                    <RiArrowDownBoxLine className="size-4 shrink-0" />
                    Import Learning Docs
                  </SidebarMenuButton>
                </ImportDialog> */}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Workflows</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mounted ? (
                menuItems
              ) : (
                <>
                  <SidebarMenuSkeleton />
                  <SidebarMenuSkeleton />
                  <SidebarMenuSkeleton />
                  <SidebarMenuSkeleton />
                  <SidebarMenuSkeleton />
                  <SidebarMenuSkeleton />
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <ApiKeys>
              <SidebarMenuButton>
                <RiKeyLine className="size-4 shrink-0" />
                API Keys
              </SidebarMenuButton>
            </ApiKeys> */}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="https://github.com/Dipang-bhadrecha/promptLearn" target="_blank">
              <SidebarMenuButton>
                <RiGithubLine className="size-4 shrink-0" />
                GitHub
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            {mounted ? (
              <SidebarMenuButton
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                suppressHydrationWarning
              >
                {resolvedTheme === "dark" ? (
                  <RiSunLine className="size-4 shrink-0" suppressHydrationWarning />
                ) : (
                  <RiMoonLine className="size-4 shrink-0" suppressHydrationWarning />
                )}{" "}
                {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
              </SidebarMenuButton>
            ) : (
              <SidebarMenuSkeleton />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
