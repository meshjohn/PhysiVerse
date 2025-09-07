// types/next-page-props.d.ts (or similar shared types file)
// You might already have a types folder, if not, create one.

type NextPageProps<
  P = Record<string, string | string[] | undefined>, // This is for dynamic routes like /courses/[id]
  S = Record<string, string | string[] | undefined>, // This is for search params like ?search=query
> = {
  params: Promise<P>; // <-- Make params a Promise
  searchParams?: Promise<S>; // <-- Make searchParams a Promise (if it's not already)
};

declare module "@prisma/nextjs-monorepo-workaround-plugin" {
  export class PrismaPlugin {}
}
