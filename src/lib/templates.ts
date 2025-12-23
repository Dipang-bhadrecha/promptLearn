// lib/templates.ts
import { nanoid } from "nanoid";
import { Workflow } from "./workflow-store";

// Simple chat workflow template using your PromptNode
const createChatWorkflow = (id: string, name: string): Workflow => ({
  id,
  name,
  nodes: [
    {
      id: nanoid(),
      type: "prompt", // Maps to your PromptNode
      position: { x: 250, y: 150 },
      data: { 
        // Simple data structure for your chat node
        history: [],
        prompt: "",
        loading: false
      },
      width: 400,
      height: 600,
    },
  ],
  edges: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// ✅ Your custom templates (replaces the 6 complex ones)
export const templates: Workflow[] = [
  createChatWorkflow(nanoid(), "Welcome Prompt Flow 🤖"),
];

// ✅ Default template for new workflows
export const newWorkflow: Workflow = createChatWorkflow(nanoid(), "New Chat");
