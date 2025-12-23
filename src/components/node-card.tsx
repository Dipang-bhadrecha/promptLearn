import { cn } from "../lib/utils";
import { Node, NodeProps, NodeResizeControl } from "@xyflow/react";
import { RiExpandDiagonalS2Line } from "@remixicon/react";

export function NodeCard({
  children,
  title,
  node,
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
  node: NodeProps<Node>;
}) {
  return (
    <div
      className={cn(
        "flex flex-col bg-card rounded-xl h-full transition-all text-card-foreground border border-border"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "bg-card transition-colors border-b p-3 flex items-center gap-3 rounded-t-xl",
          node.selected && "bg-muted"
        )}
      >
        <div
          className={cn(
            "text-sm text-muted-foreground transition-colors",
            node.selected && "text-primary"
          )}
        >
          {title}
        </div>
      </div>

      {/* Resize control appears when node is selected */}
      {node.selected && (
        <NodeResizeControl
          minWidth={300}
          minHeight={200}
          className="hover:text-foreground text-muted-foreground !border-none !bg-transparent"
        >
          <RiExpandDiagonalS2Line className="size-5 shrink-0" />
        </NodeResizeControl>
      )}

      {/* Node-specific content */}
      {children}
    </div>
  );
}
