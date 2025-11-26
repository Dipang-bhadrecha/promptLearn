"use client";

import React from "react";
import { NodeCard } from "../node-card";
import { Handle, Position } from "@xyflow/react";

export function TextNode(props: any) {
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
        <textarea placeholder="Enter content here" className="w-full h-32 p-2 bg-transparent text-sm outline-none nodrag" />
      </NodeCard>

      {/* Handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </>
  );
}
