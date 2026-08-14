import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "turso",
	tablesFilter: ["!__turso_*"],
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL || "file:local.db",
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
});
