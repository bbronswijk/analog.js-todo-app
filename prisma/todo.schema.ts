import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string(),
  description: z.string().min(2),
  completed: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number(),
});
