import { sql } from "drizzle-orm";
import { db } from "@/db";

async function main() {
  console.log("Creating tables...");

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS \`courses\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`slug\` text NOT NULL,
      \`title\` text NOT NULL,
      \`subtitle\` text,
      \`description\` text NOT NULL,
      \`hsc_batch\` text NOT NULL,
      \`price\` integer NOT NULL,
      \`original_price\` integer,
      \`image\` text NOT NULL,
      \`badge\` text,
      \`is_published\` integer DEFAULT true,
      \`order_index\` integer DEFAULT 0,
      \`created_at\` integer NOT NULL,
      \`updated_at\` integer NOT NULL
    );
  `);

  await db.run(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS \`courses_slug_unique\` ON \`courses\` (\`slug\`);
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS \`course_details\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`course_id\` text NOT NULL,
      \`routine_pdf_url\` text,
      \`telegram_group_url\` text,
      \`features\` text,
      \`modules\` text,
      \`faqs\` text,
      \`instructors\` text,
      FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );
  `);

  await db.run(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS \`course_details_course_id_unique\` ON \`course_details\` (\`course_id\`);
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS \`course_enrollment_requests\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`user_id\` text NOT NULL,
      \`course_id\` text NOT NULL,
      \`payment_method\` text NOT NULL,
      \`sender_number\` text NOT NULL,
      \`transaction_id\` text NOT NULL,
      \`amount_paid\` integer NOT NULL,
      \`status\` text DEFAULT 'pending',
      \`admin_note\` text,
      \`reviewed_by\` text,
      \`reviewed_at\` integer,
      \`created_at\` integer NOT NULL,
      FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY (\`reviewed_by\`) REFERENCES \`user\`(\`id\`) ON UPDATE no action ON DELETE no action
    );
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS \`course_enrollments\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`user_id\` text NOT NULL,
      \`course_id\` text NOT NULL,
      \`request_id\` text,
      \`status\` text DEFAULT 'active',
      \`enrolled_at\` integer NOT NULL,
      FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY (\`request_id\`) REFERENCES \`course_enrollment_requests\`(\`id\`) ON UPDATE no action ON DELETE no action
    );
  `);

  console.log("Tables created successfully.");
}

main().catch(console.error);
