import { PrismaClient } from '@prisma/client';

export const db = globalThis.prisma || new PrismaClient(); //just like we used
//to do in mongoose declaration in types/types.d.ts as global variable
// similarly we wil do here.
// This allows us to use the same Prisma Client instance across different files
// without creating multiple connections to the database, which is especially useful
// in development mode where hot reloading can cause multiple instances to be created.

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}