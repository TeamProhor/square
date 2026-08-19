import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { account, user } from "../db/schema";
import { auth } from "../lib/auth";

async function main() {
  const adminEmail = "admin@square.edu";
  const adminPassword = "square2026";
  const adminName = "Admin";

  console.log("Ensuring issuer column exists in account table...");
  await db.execute(
    sql`ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "issuer" text;`,
  );

  console.log(`Checking if user ${adminEmail} already exists...`);

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, adminEmail),
  });

  if (existingUser) {
    console.log(
      `User found (id: ${existingUser.id}). Deleting old records to re-create cleanly...`,
    );
    await db.delete(account).where(eq(account.userId, existingUser.id));
    await db.delete(user).where(eq(user.id, existingUser.id));
  }

  console.log("Creating admin account via Better-Auth...");
  const res = await auth.api.signUpEmail({
    body: {
      name: adminName,
      email: adminEmail,
      password: adminPassword,
    },
  });

  if (!res?.user) {
    throw new Error("Failed to create admin user through Better Auth");
  }

  console.log(`User created successfully with ID: ${res.user.id}`);

  console.log(
    "Promoting user to role 'admin' and setting emailVerified = true...",
  );
  await db
    .update(user)
    .set({
      role: "admin",
      emailVerified: true,
    })
    .where(eq(user.id, res.user.id));

  const updatedAdmin = await db.query.user.findFirst({
    where: eq(user.id, res.user.id),
  });

  console.log("Admin account details:", {
    id: updatedAdmin?.id,
    name: updatedAdmin?.name,
    email: updatedAdmin?.email,
    role: updatedAdmin?.role,
    emailVerified: updatedAdmin?.emailVerified,
  });

  console.log("Admin created successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error creating admin user:", err);
  process.exit(1);
});
