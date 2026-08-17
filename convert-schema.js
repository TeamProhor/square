const fs = require("node:fs");

let schema = fs.readFileSync("src/db/schema.ts", "utf-8");

schema = schema.replace(/drizzle-orm\/sqlite-core/g, "drizzle-orm/pg-core");
schema = schema.replace(/sqliteTable/g, "pgTable");

// Add new imports
schema = schema.replace(
  /import \{[\s\S]*?\} from "drizzle-orm\/pg-core";/,
  `import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  json,
  uuid,
  uniqueIndex
} from "drizzle-orm/pg-core";`,
);

// Convert boolean
schema = schema.replace(
  /integer\("([^"]+)",\s*\{\s*mode:\s*"boolean"\s*\}\)/g,
  'boolean("$1")',
);

// Convert timestamp
schema = schema.replace(
  /integer\("([^"]+)",\s*\{\s*mode:\s*"timestamp"\s*\}\)/g,
  'timestamp("$1")',
);

// Convert JSON
schema = schema.replace(
  /text\("([^"]+)",\s*\{\s*mode:\s*"json"\s*\}\)/g,
  'json("$1")',
);

// Replace standard timestamps which were stored as strings in sqlite
schema = schema.replace(
  /text\("([^"]+)"\)\.default\(sql`\(CURRENT_TIMESTAMP\)`\)/g,
  'timestamp("$1").defaultNow()',
);
schema = schema.replace(
  /timestamp\("([^"]+)"\)\.default\(sql`\(CURRENT_TIMESTAMP\)`\)/g,
  'timestamp("$1").defaultNow()',
);

fs.writeFileSync("src/db/schema.ts", schema);
console.log("Done!");
