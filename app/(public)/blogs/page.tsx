import { getAllBlogs } from "@/app/data/blogs/get-all-blogs";
import {
  PublicCourseCardSkeleton,
  PublicCoursesCard,
} from "../_components/PublicCourseCard";
import { Suspense } from "react";
import { PublicBlogCard } from "../_components/PublicBlogCard";

export const dynamic = "force-dynamic";

export default function PublicBlogsroute() {
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
        <RenderBlogs />
      </Suspense>
    </div>
  );
}

async function RenderBlogs() {
  const blogs = await getAllBlogs();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <PublicBlogCard key={blog.id} data={blog} />
      ))}
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
