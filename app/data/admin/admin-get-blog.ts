import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function adminGetBlog(id: string) {
  await requireAdmin();

  const data = await prisma.blog.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      fileKey: true,
      slug: true,
      summary: true,
      status: true,

    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}

export type AdminBlogSingularType = Awaited<ReturnType<typeof adminGetBlog>>;
