import { ComputeNodeFunction, ComputeNodeInput, formatInputs } from "../../lib/compute";
import { baseNodeDataSchema } from "../../lib/base-node";
import { z } from "zod";

export const promptNodeDataSchema = baseNodeDataSchema.extend({
  prompt: z.string(),
  label: z.string().optional(),
});

type PromptNodeData = z.infer<typeof promptNodeDataSchema>;

export const computePrompt: ComputeNodeFunction<PromptNodeData> = async (
  inputs: ComputeNodeInput[],
  data: PromptNodeData,
  abortSignal: AbortSignal,
) => {
  const currentData = { ...data };
  if (inputs.length > 0) {
    currentData.prompt = formatInputs(inputs);
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  // Check if operation was aborted
  if (abortSignal?.aborted) {
    throw new Error("Operation was aborted");
  }

  return {
    ...currentData,
    error: undefined,
    dirty: false,
    output: currentData.prompt,
  };
};