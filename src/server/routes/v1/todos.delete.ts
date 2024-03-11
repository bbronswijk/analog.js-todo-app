import { defineEventHandler, readBody } from 'h3';
import { z } from 'zod';
import { prisma } from '../../prisma-client';

export const DeleteManyTodosRequestSchema = z.object({
  deleteIds: z.string().array(),
});

export type DeleteManyTodosRequestType = z.infer<typeof DeleteManyTodosRequestSchema>;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { deleteIds }: DeleteManyTodosRequestType = DeleteManyTodosRequestSchema.parse(body);

  await prisma.todo.deleteMany({
    where: {
      id: {
        in: deleteIds
      }
    }
  });
});
