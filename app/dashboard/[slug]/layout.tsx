import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-sidebar-data";

interface iAppProps {
  params: { slug: string };
  children: ReactNode;
}

export default async function CourseLayout({ params, children }: iAppProps) {
  const { slug } = params;
  const course = await getCourseSidebarData(slug);
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      {/* sidebar - 30% */}
      <div className="w-full md:w-[140px] sm:md:w-40 lg:w-80 border-b md:border-b-0 md:border-r border-border">
        <CourseSidebar course={course.course} />
      </div>
      {/* main content - 70% */}
      <div className="flex-1 overflow-hidden max-md:mt-5 max-md:mr-5">
        {children}
      </div>
    </div>
  );
}
