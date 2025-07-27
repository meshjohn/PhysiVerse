import "server-only";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getIndividualBlog(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      content: true,
      fileKey: true,
      summary: true,
    },
  });

  if (!blog) {
    return notFound();
  }
  return blog;
}
