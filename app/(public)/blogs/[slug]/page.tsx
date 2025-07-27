import { getIndividualBlog } from "@/app/data/blogs/get-blog";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Separator } from "@/components/ui/separator";
import { env } from "@/lib/env";
import Image from "next/image";

type Params = Promise<{ slug: string }>;

// Utility to detect Arabic content
function isArabic(text: string) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const blog = await getIndividualBlog(slug);

  const contentText = JSON.stringify(blog.content); // assuming blog.content is a rich text JSON
  const arabic = isArabic(contentText);

  return (
    <div className="mt-5">
      <div className="w-full">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={`https://${env.NEXT_PUBLIC_S3_BUCKET_IMAGES}.fly.storage.tigris.dev/${blog.fileKey}`}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="mt-8 space-y-6 w-full">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{blog.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
              {blog.summary}
            </p>
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">Blog Content</h2>
            <div
              className={`w-full ${arabic ? "text-right" : "text-left"}`}
              dir={arabic ? "rtl" : "ltr"}
            >
              <RenderDescription json={JSON.parse(blog.content)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
