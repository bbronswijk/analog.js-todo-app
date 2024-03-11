import { defineEventHandler, getRouterParam } from 'h3';
import { prisma } from '../../../prisma-client';

export default defineEventHandler(async (event) => prisma.todo.delete({
  where: { id: getRouterParam(event, 'id') as string },
}));
