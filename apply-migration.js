const postgres = require('postgres');
const fs = require('fs');

async function main() {
  const sql = postgres(process.env.DATABASE_URL);
  const migration = fs.readFileSync('drizzle/0000_quick_jubilee.sql', 'utf8');
  console.log("Applying migration...");
  try {
    await sql.unsafe(migration);
    console.log("Migration applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await sql.end();
  }
}

main();
