import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function run() {
  try {
    const info = await client.execute("PRAGMA table_info(questions);");
    console.log("Questions table:", info.rows);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
