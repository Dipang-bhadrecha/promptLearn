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
} from "./ui/sidebar";

import {
  RiAddLine,
  RiComputerLine,
  RiGithubLine,
  RiMoonLine,
  RiSunLine,
} from "@remixicon/react";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useChatStore } from "./chat/chat.store";
import Logo from "./logo";
import { apiRequest } from "../lib/api";

export function AppSidebar() {
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const setConversationId = useChatStore((s) => s.setConversationId);

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
  const menuItems = conversations.map((conv) => (
    <SidebarMenuItem key={conv.id}>
      <SidebarMenuButton
        onClick={() => setConversationId(conv.id)}
        className="w-full pr-2"
      >
        <span className="truncate">
          {conv.title || "New Chat"}
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));

  async function handleNewConversation() {
    try {
      // Create empty conversation on backend
      const data = await apiRequest("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: " " })
      });

      const newConv = {
        id: data.conversationId,
        title: "New Chat"
      };

      // Put new chat at top of sidebar
      setConversations(prev => [newConv, ...prev]);

      // Switch chat panel to this conversation
      setConversationId(String(data.conversationId));

    } catch (err) {
      console.error("Failed to create conversation", err);
    }
  }


  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 flex items-center gap-2">
          <Logo className="size-18" />
          <span className="text-2xl tracking-tighter font-sans leading-none font-medium">
            Prompt<br />Learn
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
          <SidebarMenuItem>
            <Link href="/graph">
              <SidebarMenuButton>
                <RiComputerLine className="size-4 shrink-0" />
                Switch to graph
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/chat">
              <SidebarMenuButton>
                <RiComputerLine className="size-4 shrink-0" />
                Switch to chat
              </SidebarMenuButton>
            </Link>
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
    </Sidebar>
  );
}
