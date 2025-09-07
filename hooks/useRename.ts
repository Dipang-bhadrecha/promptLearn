import { useState } from "react";
import { useWorkflowStore } from "../lib/workflow-store";

export function useRename() {
  const renameWorkflow = useWorkflowStore((s) => s.renameWorkflow);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  function startRename(workflow: { id: string; name: string }) {
    setRenamingId(workflow.id);
    setRenameValue(workflow.name);
  }

  function saveRename(id: string, newName: string) {
    if (newName.trim()) {
      renameWorkflow(id, newName.trim());
    }
    setRenamingId(null);
  }

  function cancelRename() {
    setRenamingId(null);
    setRenameValue("");
  }

  return {
    renamingId,
    renameValue,
    startRename,
    saveRename,
    cancelRename,
    setRenameValue,
  };
}
