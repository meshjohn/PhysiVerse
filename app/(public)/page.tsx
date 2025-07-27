"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignout } from "@/hooks/use-signout";
import { authClient } from "@/lib/auth-client";

const features = [
  {
    title: "Comprehensive Courses",
    description:
      "Explore a wide range of physics topics designed to boost your understanding and skills.",
    icon: "📚",
  },
  {
    title: "Interactive Learning",
    description:
      "Interact with dynamic visuals and real-world examples to deepen your understanding.",
    icon: "🖥️",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with detailed progress tracking and analytics.",
    icon: "📈",
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of learners and instructors to share knowledge and experiences.",
    icon: "🤝",
  },
];

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = useSignout();

  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">Revolutionizing Physics Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Explore the Universe of Physics
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Master physics concepts through our modern, interactive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/courses" className={buttonVariants({ size: "lg" })}>
              Explore Courses
            </Link>

            {session ? (
              <button
                onClick={handleSignOut}
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="text-4xl">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
