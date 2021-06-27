import { z } from "zod";


export const writeLambdaInputSchema = z.object({
  itemsToWrite: z.number().min(1).max(2000),
  pkNumber: z.number().min(1).max(20).optional()
})

export type WriteLambdaInput = z.infer<typeof writeLambdaInputSchema>;