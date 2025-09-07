import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [courses] = await Promise.all([getAllCourses()]);
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">All Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to
        </p>
      </div>
      {courses.length === 0 ? (
        <EmptyState
          title="No courses purchased"
          description="You have not purchased any courses yet"
          buttonText="Browse Courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <CourseProgressCard key={course.id} data={course as any} />
          ))}
        </div>
      )}
    </>
  );
}
