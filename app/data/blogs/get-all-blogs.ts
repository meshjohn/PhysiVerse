import "server-only";
import { prisma } from "@/lib/db";

export async function getAllBlogs(search: string = "") {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const data = await prisma.blog.findMany({
    where: {
      status: "Published",
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          summary: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return data;
}

export type PublicBlogType = Awaited<ReturnType<typeof getAllBlogs>>[0];
