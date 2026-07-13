import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node ./prisma/seed.js",
  },
  datasource: {
    url:
      process.env["DATABASE_URL"] ||
      process.env["NEON_DATABASE_URL_UNPOOLED"] ||
      process.env["NEON_DATABASE_URL"] ||
      process.env["NEON_POSTGRES_URL_NON_POOLING"] ||
      process.env["NEON_POSTGRES_URL"],
  },
});
