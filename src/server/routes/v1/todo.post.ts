import { defineEventHandler, readBody } from 'h3';
import { prisma } from '../../prisma-client';
import { todoSchema } from '../../../../prisma/todo.schema';
import { z } from 'zod';

export const PostTodoRequestSchema = todoSchema.pick({
  description: true,
  completed: true,
});

export type PostTodoRequestType = z.infer<typeof PostTodoRequestSchema>;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const data: PostTodoRequestType = PostTodoRequestSchema.parse(body);

  return prisma.todo.create({data});
});
