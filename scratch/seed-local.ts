import { db } from "../src/db";
import { containers, items, subitems, topics } from "../src/db/schema";

async function seed() {
  console.log("Seeding local database...");

  // 1. Create a Container
  const [qb] = await db
    .insert(containers)
    .values({
      slug: "hsc-2026",
      title: "HSC 2026 প্রস্তুতি প্রশ্নব্যাংক",
      description: "HSC 2026 ব্যাচের শিক্ষার্থীদের জন্য অধ্যায়ভিত্তিক প্রশ্নব্যাংক",
    })
    .returning();

  console.log("Created container:", qb.title);

  // 2. Create Items (Subjects directly named)
  const [phy1st] = await db
    .insert(items)
    .values({
      id: "physics-1st",
      containerId: qb.id,
      name: "পদার্থবিজ্ঞান ১ম পত্র",
      code: "174",
      slug: "physics-1st",
    })
    .returning();

  const [math2nd] = await db
    .insert(items)
    .values({
      id: "higher-math-2nd",
      containerId: qb.id,
      name: "উচ্চতর গণিত ২য় পত্র",
      code: "266",
      slug: "higher-math-2nd",
    })
    .returning();

  console.log("Created items:", phy1st.name, math2nd.name);

  // 3. Create Subitems (Chapters)
  const [vector] = await db
    .insert(subitems)
    .values({
      itemId: phy1st.id,
      name: "ভেক্টর (Vector)",
      slug: "vector",
      orderNo: 2,
    })
    .returning();

  const [complexNumbers] = await db
    .insert(subitems)
    .values({
      itemId: math2nd.id,
      name: "জটিল সংখ্যা (Complex Numbers)",
      slug: "complex-numbers",
      orderNo: 3,
    })
    .returning();

  console.log("Created chapters:", vector.name, complexNumbers.name);

  // 4. Create Topics
  const [topic1] = await db
    .insert(topics)
    .values({
      subitemId: vector.id,
      name: "ভেক্টর ডট ও ক্রস গুণন",
      slug: "dot-and-cross-product",
    })
    .returning();

  console.log("Created topic:", topic1.name);
  console.log("✅ PostgreSQL database successfully seeded!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
