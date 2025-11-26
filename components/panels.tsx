"use client";

import { Button } from "./ui/button";
import { getCleanedWorkflow, useWorkflowStore, type WorkflowState } from "../lib/workflow-store";
import { SidebarTrigger } from "./ui/sidebar";
import { Input } from "./ui/input";
import {
  RiAiGenerate2,
  RiArrowUpBoxLine,
  RiChatQuoteLine,
  RiDeleteBin2Line,
  RiMarkdownLine,
  RiStopLine,
  RiTextSnippet,
} from "@remixicon/react";
import { Panel, useReactFlow } from "@xyflow/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { memo, useCallback } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

export const Panels = memo(function Panels() {
  return (
    <>
      <BottomCenterPanel />
      <TopLeftPanel />
    </>
  );
});

const TopLeftPanel = memo(function TopLeftPanel() {
  const { updateWorkflowName, currentName, currentWorkflowId } = useWorkflowStore(
    useShallow((state: WorkflowState) => ({
      updateWorkflowName: state.updateWorkflowName,
      currentName: state.getCurrentWorkflow()?.name,
      currentWorkflowId: state.currentWorkflowId,
    }))
  );

  return (
    <Panel position="top-left">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
    </Panel>
  );
});

const BottomCenterPanel = memo(function BottomCenterPanel() {
  const instance = useReactFlow();
  const addNode = useWorkflowStore((state: WorkflowState) => state.addNode);

  const handleAddNode = useCallback(
    (type: string) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const position = instance.screenToFlowPosition({ x: screenWidth / 2, y: screenHeight / 2 });
      switch (type) {
        case "prompt":
          addNode({
            data: { prompt: "" },
            position,
            height: 500,
            width: 450,
            type: type,
          });
          break;
        case "TextNode":
          addNode({
            data: { text: "" },
            position,
            height: 500,
            width: 450,
            type: type,
          });
          break;
        case "markdown":
          addNode({
            data: {},
            position,
            height: 500,
            width: 450,
            type: type,
          });
          break;
        case "annotation":
          addNode({
            data: { text: "" },
            position,
            height: 150,
            width: 400,
            type: type,
          });
          break;
      }
    },
    [addNode, instance]
  );

  return (
    <Panel position="bottom-center">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => handleAddNode("prompt")}>
          <RiTextSnippet className="size-5 shrink-0" />
          <span className="hidden sm:block">Prompt</span>
        </Button>
        <Button variant="outline" onClick={() => handleAddNode("ai")}>
          <RiAiGenerate2 className="size-5 shrink-0" />
          <span className="hidden sm:block">TextNode</span>
        </Button>
        {/* <Button variant="outline" onClick={() => handleAddNode("markdown")}>
          <RiMarkdownLine className="size-5 shrink-0" />
          <span className="hidden sm:block">Button 3</span>
        </Button>
        <Button variant="outline" onClick={() => handleAddNode("annotation")}>
          <RiChatQuoteLine className="size-5 shrink-0" />
          <span className="hidden sm:block">Button 4</span>
        </Button> */}
      </div>
    </Panel>
  );
});

