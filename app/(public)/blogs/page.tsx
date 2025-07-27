import { getAllBlogs } from "@/app/data/blogs/get-all-blogs";
import { PublicCourseCardSkeleton } from "../_components/PublicCourseCard";
import { Suspense } from "react";
import PublicBlogsClient from "../_components/PublicBlogClient";

export const dynamic = "force-dynamic";

export default async function PublicBlogsroute({
  searchParams,
}: NextPageProps<{}, { search?: string }>) {
  const resolvedSearchParams = await searchParams; // Renamed to avoid confusion

  // Now you can safely access properties on resolvedSearchParams
  const search = resolvedSearchParams?.search ?? "";
  const blogs = await getAllBlogs(search);
  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Explore Blogs
        </h1>
        <p className="text-muted-foreground">
          Discover our wide rang of Blogs designed to help you achieve your
          learning goals.
        </p>
      </div>
      <Suspense fallback={<LoadingSkeletonLayout />}>
        <PublicBlogsClient blogs={blogs} />
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
