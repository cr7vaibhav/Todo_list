import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Create a standard PG connection pool
const pool = new pg.Pool({ 
    connectionString: process.env.DATABASE_URL 
});

// 2. Instantiate the Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the PrismaClient constructor
export const prisma = new PrismaClient({ adapter });