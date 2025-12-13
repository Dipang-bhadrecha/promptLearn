"use client";

import React from "react";
import { NodeCard } from "../node-card";
import { Handle, NodeResizeControl, Position } from "@xyflow/react";
import { RiDeleteBin2Line, RiExpandDiagonalS2Line, RiFileCopyLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

export function TextNode(props: any) {
  return (
    <NodeCard
      node={props}
      title={
        <div className="flex item-center gap-2">
          <p className="text-sm text-muted-forground">Text Node</p>
       </div>
      }
    >
      <Textarea
        name="text"
        // value={parsedData.data.text}
        // onChange={handleTextChange}
        placeholder="Write your note here..."
        className="nodrag nowheel min-h-0 dark:bg-transparent nopan font-handwriting shadow-none h-full w-full resize-none rounded-xl border-none bg-transparent !ring-0 text-muted-foreground !text-2xl"
      />

      {props.selected && (
        <NodeResizeControl
          minWidth={200}
          minHeight={100}
          className="!border-none !bg-transparent text-muted-foreground hover:text-foreground"
        >
          <RiExpandDiagonalS2Line className="size-4" />
        </NodeResizeControl>
      )}

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    {/* </div> */}
    </NodeCard>
  );
}
