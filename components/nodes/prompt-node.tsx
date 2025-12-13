"use client";

import React from "react";
import { NodeCard } from "../node-card";
import { Handle, Position } from "@xyflow/react";
import { ChatPanel } from "../ui/chatPanel"; 
import { ChatInputBar } from "../ui/chatInputBar";

export function PromptNode(props: any) {
  return (

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
    <div className="flex flex-col h-full min-h-0">
      <ChatPanel />
    </div>

      <Handle type="source" position={Position.Right} />
    <Handle type="target" position={Position.Left} />
      </NodeCard>
  );
}
