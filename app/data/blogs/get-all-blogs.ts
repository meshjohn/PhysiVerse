import "server-only";
import { prisma } from "@/lib/db";

export async function getAllBlogs() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const data = await prisma.blog.findMany({
    where: { status: "Published" },
    orderBy: { createdAt: "desc" },
  });

  return data;
}

export type PublicBlogType = Awaited<ReturnType<typeof getAllBlogs>>[0];
