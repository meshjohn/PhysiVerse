import { ChartBarInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent";
import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "./courses/_components/AdminCourseCard";
import { Suspense } from "react";
import { EmptyState } from "@/components/general/EmptyState";
import { adminGetDashboardStats } from "../data/admin/admin-get-dashboard-stats";

export default async function AdminIndexPage() {
  const stats = await adminGetDashboardStats();

  // If ChartBarInteractive expects an array of stats, you need to transform the object accordingly.
  // For now, let's assume you want to show totalSignUps as a single data point:
  const chartData = [
    {
      date: new Date().toISOString().split('T')[0], // today's date as an example
      total: stats.totalSignUps,
    },
  ];

  return (
    <>
      <SectionCards />
      <ChartBarInteractive data={chartData} title="User Signups" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses"
          >
            View All Courses
          </Link>
        </div>
        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();
  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create new Course"
        description="you don't have any courses. create some to see them here"
        title="You don't have any courses yet!"
        href="/admin/courses/create"
      />
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
