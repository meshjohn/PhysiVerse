// PublicCoursesClient.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PublicCourseType } from "@/app/data/course/get-all-courses";
import Component from "@/components/comp-26";
import { PublicCoursesCard } from "./PublicCourseCard";

export default function PublicCoursesClient({
  courses,
}: {
  courses: PublicCourseType[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <Component onSearchChange={handleSearchChange} value={search} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <PublicCoursesCard key={course.id} data={course} />
        ))}
      </div>
    </div>
  );
}
