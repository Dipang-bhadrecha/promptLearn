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
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "./ui/sidebar";

import {
  RiAddLine,
  RiComputerLine,
  RiGithubLine,
  RiMoonLine,
  RiSunLine,
  RiMoreLine,
} from "@remixicon/react";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useChatStore } from "./chat/chat.store";
import { apiRequest } from "../lib/api";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialogue";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

export function AppSidebar() {
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const setConversationId = useChatStore((s) => s.setConversationId);
  const currentConversationId = useChatStore((s) => s.currentConversationId);

  const isInChatView = pathname === "/chat" || pathname === "/";

  // Mark mounted (avoids hydration issues with theme switch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load conversations from backend
  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await apiRequest("/api/chat", {
          method: "GET",
        });
        setConversations(data);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoadingConversations(false);
      }
    }

    loadConversations();
  }, []);

  // Build sidebar items
  const menuItems = conversations.map((conv) => {
    const isActive = String(currentConversationId) === String(conv.id);
    const isEditing = String(editingId) === String(conv.id);

    return (
      <SidebarMenuItem key={conv.id}>
        {isEditing ? (
          <div
            className="flex w-full items-center rounded-md bg-sidebar-accent px-2 py-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameSave();
                }
                if (e.key === "Escape") {
                  cancelInlineRename();
                }
              }}
              onBlur={() => handleRenameSave()}
              className="h-8"
              autoFocus
            />
          </div>
        ) : (
          <>
            <SidebarMenuButton
              onClick={() => setConversationId(conv.id)}
              className="cursor-pointer select-none"
              isActive={isActive}
            >
              <span className="truncate">
                {conv.title || "New Chat"}
              </span>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer data-[state=open]:opacity-100"
                >
                  <RiMoreLine className="size-4" />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="start"
                sideOffset={6}
                className="w-44 rounded-xl border border-sidebar-border bg-sidebar/95 p-1.5 text-sidebar-foreground shadow-lg backdrop-blur-sm"
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    startInlineRename(conv.id, conv.title);
                  }}
                  className="cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent"
                >
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-sidebar-border" />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog(conv.id, conv.title);
                  }}
                  className="cursor-pointer rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                >
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </SidebarMenuItem>
    );
  });

  function handleNewConversation() {
    // Reset selection; conversation will be created on first user message
    setConversationId(null);
  }

  function startInlineRename(conversationId: string, currentTitle: string) {
    setEditingId(conversationId);
    setEditingValue(currentTitle || "New Chat");
  }

  function cancelInlineRename() {
    setEditingId(null);
    setEditingValue("");
  }

  async function handleRenameSave() {
    if (!editingId) return;
    const trimmed = editingValue.trim();
    if (!trimmed) {
      cancelInlineRename();
      return;
    }

    try {
      await apiRequest(`/api/chat/${editingId}`, {
        method: "PATCH",
        body: JSON.stringify({ title: trimmed }),
      });

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          String(conv.id) === String(editingId) ? { ...conv, title: trimmed } : conv
        )
      );
    } catch (err) {
      console.error("Failed to rename conversation", err);
    } finally {
      cancelInlineRename();
    }
  }

  async function handleDelete(conversationId: string) {
    try {
      setDeleteLoading(true);
      await apiRequest(`/api/chat/${conversationId}`, {
        method: "DELETE",
      });

      // Update local state
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));

      // If deleting current conversation, reset to null
      if (String(currentConversationId) === String(conversationId)) {
        setConversationId(null);
      }
      if (String(editingId) === String(conversationId)) {
        cancelInlineRename();
      }
      closeDeleteDialog();
    } catch (err) {
      console.error("Failed to delete conversation", err);
    } finally {
      setDeleteLoading(false);
    }
  }

  function openDeleteDialog(id: string, title: string) {
    setDeleteTarget({ id, title: title || "New Chat" });
    setDeleteDialogOpen(true);
  }

  function closeDeleteDialog(open?: boolean) {
    if (deleteLoading) return;
    if (open === true) {
      setDeleteDialogOpen(true);
      return;
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 flex items-center gap-2">
          {/* <Logo className="size-18" /> */}
          <span className="text-2xl tracking-tighter font-sans leading-none font-medium">
            Prompt Learn
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
  <SidebarGroup>
    <SidebarGroupLabel>New</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleNewConversation}>
            <RiAddLine className="size-4 shrink-0" />
            New Chat
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>

  {/* Section 2 — Conversations list */}
  <SidebarGroup>
    <SidebarGroupLabel>Conversations</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {loadingConversations ? (
          <>
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
          </>
        ) : (
          menuItems
        )}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {isInChatView ? (
            <SidebarMenuItem>
              <Link href="/graph">
                <SidebarMenuButton>
                  <RiComputerLine className="size-4 shrink-0" />
                  Switch to graph
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <Link href="/chat">
                <SidebarMenuButton>
                  <RiComputerLine className="size-4 shrink-0" />
                  Switch to chat
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}

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
              >
                {resolvedTheme === "dark" ? (
                  <RiSunLine className="size-4 shrink-0" />
                ) : (
                  <RiMoonLine className="size-4 shrink-0" />
                )}
                {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
              </SidebarMenuButton>
            ) : (
              <SidebarMenuSkeleton />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <Dialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent className="sm:max-w-[420px] rounded-xl border border-sidebar-border bg-sidebar/95 text-sidebar-foreground shadow-xl backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Delete chat?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-sidebar-foreground/70">
            This will delete{" "}
            <span className="text-sidebar-foreground font-medium">
              {deleteTarget?.title}
            </span>
            .
          </div>
          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
              disabled={deleteLoading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
