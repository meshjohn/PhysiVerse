import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetDashboardStats() {
  await requireAdmin();

  const [totalSignUps, totalCourses, totalLessons] =
    await Promise.all([
      prisma.user.count(),
      prisma.course.count(),

      prisma.lesson.count(),
    ]);
  return {
    totalSignUps,
    totalCourses,
    totalLessons,
  };
}
