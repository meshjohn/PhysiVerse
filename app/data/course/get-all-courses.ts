import "server-only";
import { prisma } from "@/lib/db";

export async function getAllCourses() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const data = await prisma.course.findMany({
    where: { status: "Published" },
    orderBy: { createdAt: "desc" },
    include: {
      chapter: {
        include: {
          lessons: {
            include: {
              lessonProgress: true,
            },
          },
        },
      },
    },
  });

  return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
