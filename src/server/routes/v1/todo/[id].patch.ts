import { defineEventHandler, getRouterParam, readBody } from 'h3';
import { prisma } from '../../../prisma-client';
import { todoSchema } from '../../../../../prisma/todo.schema';
import { z } from 'zod';

export const PatchTodoRequestSchema = todoSchema.pick({
  description: true,
  completed: true,
}).extend({
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export type PatchTodoRequestType = z.infer<typeof PatchTodoRequestSchema>;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = getRouterParam(event, 'id') as string;

  const data: PatchTodoRequestType = PatchTodoRequestSchema.parse(body);

  return prisma.todo.update({
    where: { id },
    data: {
      ...data.description !== undefined && { description: data.description },
      ...data.completed !== undefined && { completed: data.completed },
    },
  });
});
