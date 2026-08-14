"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { containers, items, subitems, topics } from "@/db/schema";

export async function createContainerAction(
  title: string,
  slug: string,
  description?: string,
) {
  try {
    await db.insert(containers).values({
      title,
      slug,
      description,
    });
    revalidatePath("/admin/qb");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Failed to create container" };
  }
}

export async function deleteContainerAction(id: string) {
  try {
    await db.delete(containers).where(eq(containers.id, id));
    revalidatePath("/admin/qb");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Failed to delete container" };
  }
}

export async function createItemAction(
  containerId: string,
  name: string,
  slug: string,
  code: string,
  qbSlug: string,
) {
  try {
    await db.insert(items).values({
      id: slug,
      containerId,
      name,
      slug,
      code,
    });
    revalidatePath(`/admin/qb/${qbSlug}`);
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Failed to create item" };
  }
}

export async function deleteItemAction(itemId: string, qbSlug: string) {
  try {
    await db.delete(items).where(eq(items.id, itemId));
    revalidatePath(`/admin/qb/${qbSlug}`);
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Failed to delete item" };
  }
}

export async function createSubitemAction(
  itemId: string,
  qbSlug: string,
  itemSlug: string,
  name: string,
  slug: string,
  paper?: string,
) {
  try {
    await db.insert(subitems).values({
      itemId,
      name,
      slug,
      paper,
    });
    revalidatePath(`/admin/qb/${qbSlug}/${itemSlug}`);
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Failed to create subitem" };
  }
}

export async function deleteSubitemAction(
  subitemId: string,
  qbSlug: string,
  itemSlug: string,
) {
  try {
    await db.delete(subitems).where(eq(subitems.id, subitemId));
    revalidatePath(`/admin/qb/${qbSlug}/${itemSlug}`);
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Failed to delete subitem" };
  }
}

export async function createTopicAction(
  subitemId: string,
  qbSlug: string,
  itemSlug: string,
  subitemSlug: string,
  name: string,
  slug: string,
) {
  try {
    await db.insert(topics).values({
      subitemId,
      name,
      slug,
    });
    revalidatePath(`/admin/qb/${qbSlug}/${itemSlug}/${subitemSlug}`);
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Failed to create topic" };
  }
}

export async function deleteTopicAction(
  topicId: string,
  qbSlug: string,
  itemSlug: string,
  subitemSlug: string,
) {
  try {
    await db.delete(topics).where(eq(topics.id, topicId));
    revalidatePath(`/admin/qb/${qbSlug}/${itemSlug}/${subitemSlug}`);
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Failed to delete topic" };
  }
}
