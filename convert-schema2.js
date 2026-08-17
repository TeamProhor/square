const fs = require("node:fs");

let schema = fs.readFileSync("src/db/schema.ts", "utf-8");

// Fix multiline integer -> timestamp
schema = schema.replace(
  /integer\("([^"]+)",\s*\{\s*mode:\s*"timestamp",?\s*\}\)/g,
  'timestamp("$1")',
);

// Replace standard timestamps which were stored as strings in sqlite
schema = schema.replace(
  /text\("([^"]+)"\)\.default\(sql`\(CURRENT_TIMESTAMP\)`\)/g,
  'timestamp("$1").defaultNow()',
);

fs.writeFileSync("src/db/schema.ts", schema);
console.log("Done!");
