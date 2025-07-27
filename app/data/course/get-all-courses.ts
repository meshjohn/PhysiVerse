// app/data/course/get-all-courses.ts
import "server-only";
import { prisma } from "@/lib/db";

export async function getAllCourses(search: string = "") {
  return await prisma.course.findMany({
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
          smallDescription: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
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
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
