import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetUsers() {
  await requireAdmin();
  const data = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });
  return data;
}

export type AdminUsersType = Awaited<ReturnType<typeof adminGetUsers>>[0];
