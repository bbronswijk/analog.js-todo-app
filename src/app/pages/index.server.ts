import { prisma } from '../../server/prisma-client';
import { Todo } from '@prisma/client';

export const load = async (): Promise<{ todos: Todo[] }> => ({
  todos: await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  })
});
