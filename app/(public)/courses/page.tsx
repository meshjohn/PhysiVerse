// app/(routes)/courses/page.tsx

import { getAllCourses } from "@/app/data/course/get-all-courses";
import PublicCoursesClient from "../_components/PublicCourseClient";
import { PublicCourseCardSkeleton } from "../_components/PublicCourseCard";
import { Suspense } from "react";

export default async function CoursesPage({
  searchParams,
}: NextPageProps<{}, { search?: string }>) {
  const resolvedSearchParams = await searchParams; // Renamed to avoid confusion

  // Now you can safely access properties on resolvedSearchParams
  const search = resolvedSearchParams?.search ?? "";
  const courses = await getAllCourses(search);

  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our wide rang of courses designed to help you achieve your
          learning goals.
        </p>
      </div>
      <Suspense fallback={<LoadingSkeletonLayout />}>
        <PublicCoursesClient courses={courses} />
      </Suspense>
    </div>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
