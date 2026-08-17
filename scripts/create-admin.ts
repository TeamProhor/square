import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = "admin@square.dev";
  const password = "square2026";
  const name = "Admin";
  const role = "admin";

  console.log(`Creating or updating user ${email}...`);

  try {
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    console.log("Sign up response:", res);
  } catch (error) {
    console.log("Sign up attempt note:", error instanceof Error ? error.message : error);
  }

  // Ensure role is admin and email is verified in the database
  const updated = await db
    .update(user)
    .set({
      role: role,
      emailVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(user.email, email))
    .returning();

  console.log("Updated user in DB:", updated);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
