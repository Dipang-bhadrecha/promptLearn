"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { PromptNode } from "./nodes/prompt-node";
import { Panels } from "./panel";

// Register node types
const nodeTypes = {
    prompt: PromptNode,
};

export default function Workflow() {
    const { resolvedTheme } = useTheme();
    const [disableZoom, setDisableZoom] = useState(false);

    const [nodes, setNodes] = useState([
        {
            id: "prompt-1",
            type: "prompt",
            position: { x: 250, y: 150 },
            data: { label: "First Prompt", prompt: "" },
        },
    ]);
    const [edges, setEdges] = useState<any[]>([]);

    // Global click handler to re-enable zoom when clicking outside nodes
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            // Check if the click is on the ReactFlow pane (background)
            const target = e.target as HTMLElement;
            if (target.classList.contains('react-flow__pane') || 
                target.closest('.react-flow__pane')) {
                setDisableZoom(false);
            }
        };

        document.addEventListener('click', handleGlobalClick);
        return () => document.removeEventListener('click', handleGlobalClick);
    }, []);

    // Handle dragging nodes
    const onNodesChange = (changes: any) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    };

    // Handle edges
    const onEdgesChange = (changes: any) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    };

    // Connect nodes
    const onConnect = useCallback(
        (params: any) => {
            const isAlreadyConnected = edges.some(
                (e) => e.target === params.target && e.targetHandle === params.targetHandle
            );
            if (params.targetHandle === "bottom" && isAlreadyConnected) {
                console.warn("Bottom handle already connected, skipping...");
                return;
            }
            setEdges((eds) => addEdge(params, eds));
        },
        [edges]
    );

    // Handle pane clicks to re-enable zoom
    const handlePaneClick = () => {
        setDisableZoom(false);
    };

    // Enhanced node creation with setDisableZoom prop
    const enhancedNodes = nodes.map(node => ({
        ...node,
        data: {
            ...node.data,
            setDisableZoom: setDisableZoom,
        }
    }));

    return (
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <ReactFlow
                nodes={enhancedNodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onPaneClick={handlePaneClick}
                zoomOnScroll={!disableZoom}
                panOnDrag={[2]} // Still allow right-click drag for canvas
                selectionOnDrag={true} // Allows selecting + dragging with left click
                preventScrolling={disableZoom} // Prevent scrolling when zoom is disabled
            >
                <Background />
                <Controls />
                <Panels />
            </ReactFlow>
        </div>
    );
}

