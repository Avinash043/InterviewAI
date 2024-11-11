import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: "postgresql://interviewai_owner:83XeyIvWrnFk@ep-little-heart-a8s0ttp2.eastus2.azure.neon.tech/interviewai?sslmode=require",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",
  introspect: {
    casing: "camel",
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});