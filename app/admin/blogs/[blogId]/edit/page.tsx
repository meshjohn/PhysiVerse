import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminGetBlog } from "@/app/data/admin/admin-get-blog";
import { EditBlogForm } from "./_components/EditBlogForm";

export const dynamic = "force-dynamic";

type Params = Promise<{ blogId: string }>;

export default async function EditRoute({ params }: { params: Params }) {
  const { blogId } = await params;
  const data = await adminGetBlog(blogId);
  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-8">
        Edit Blog: <span className="text-primary underline">{data.title}</span>
      </h1>
      <Tabs defaultValue="basic-info">
        <TabsList className="flex flex-1">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>
                Provide basic information about the course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditBlogForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
