/* eslint-disable no-var */
import { PrismaClient } from './generated/prisma';

declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize PrismaClient without the unsupported enableTracing option
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
