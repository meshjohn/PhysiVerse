import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { EmptyState } from "@/components/general/EmptyState";
import { Suspense } from "react";
import { AdminCourseCardSkeleton } from "../courses/_components/AdminCourseCard";
import { adminGetBlogs } from "@/app/data/admin/admin-get-blogs";
import { AdminBlogCard } from "./_components/AdminBlogsCard";

export const dynamic = "force-dynamic";

export default function BlogsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Blogs</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          Create Blogs
        </Link>
      </div>
      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderBlogs />
      </Suspense>
    </>
  );
}

async function RenderBlogs() {
  const data = await adminGetBlogs();

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No Blogs Found"
          description="Create a new Blog to get started"
          buttonText="Create Blog"
          href="/admin/blogs/create"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
          {data.map((blog) => (
            <AdminBlogCard key={blog.id} data={blog} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
