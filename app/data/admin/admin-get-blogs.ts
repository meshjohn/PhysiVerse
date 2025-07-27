import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetBlogs() {
  await new Promise((resolve) => setTimeout(resolve, 10000));

  await requireAdmin();
  const data = await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      content: true,
      summary: true,
      status: true,
      fileKey: true,
      slug: true,
    },
  });
  return data;
}

export type AdminBlogsType = Awaited<ReturnType<typeof adminGetBlogs>>[0];
