import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  __prisma_v2: PrismaClient | undefined
}

const connectionString =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.NEON_POSTGRES_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://user:password@localhost:5432/boss_journal?schema=public"

if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL && !process.env.NEON_POSTGRES_URL && !process.env.POSTGRES_URL) {
  console.log("[v0] No database connection string found in env. Falling back to localhost, which will fail.")
}

// In a real serverless deployment, connection pooling config should be tuned.
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = globalForPrisma.__prisma_v2 ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.__prisma_v2 = prisma

export default prisma
