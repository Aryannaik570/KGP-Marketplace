import { PrismaClient } from '@prisma/client';

// Hard-bypass global for this session to force new schema map into memory
export const prisma = new PrismaClient();
