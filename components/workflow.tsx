"use client";

import React from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Panels } from "./panel";

export default function Workflow() {
  // Empty arrays for nodes and edges mean nothing is rendered on the canvas
  const nodes = [];
  const edges = [];

// const panOnDragButtons = [2];

  // Minimal props to allow pan, zoom, controls for empty canvas
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={() => {}}
        onEdgesChange={() => {}}
        onConnect={() => {}}
        zoomOnScroll={true}
        // panOnDrag={panOnDragButtons}
        // selectionOnDrag={false} 
      >
        <Background />
        <Controls />
        <Panels />
      </ReactFlow>
    </div>
  );
}
