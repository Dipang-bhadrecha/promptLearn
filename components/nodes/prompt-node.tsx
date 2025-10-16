"use client";

import React from "react";
import { NodeCard } from "../node-card";
import { Handle, Position } from "@xyflow/react";
import { ChatPanel } from "../ui/chatPanel"; 
import { ChatInputBar } from "../ui/chatInputBar";

export function PromptNode(props: any) {
  return (
    <>
      <NodeCard
        node={props}
        title={
          <input
            type="text"
            placeholder="Enter node title"
            className="w-full bg-transparent text-sm font-bold outline-none nodrag h-3"
          />
        }
      >
        <ChatPanel />
        {/* <ChatInputBar /> */}
      </NodeCard>

      {/* Handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </>
  );
}
