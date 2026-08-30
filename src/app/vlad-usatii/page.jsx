import Link from "next/link";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { buildPageMetadata } from "@/lib/trades-page-utils";

export const metadata = buildPageMetadata({
  title: "Letters from Vlad Usatii",
  description:
    "Writing from USATII founder Vlad Usatii on the software industry and letters to clients.",
  path: "/vlad-usatii",
});

const posts = [
  {
    date: "Aug 30, 2026",
    title: "Your company should do the least work possible",
    description:
      "On building systems that remove operational complexity instead of creating another place to manage it.",
    href: "/vlad-usatii/your-company-should-do-the-least-work-possible",
  },
  {
    date: "Coming soon",
    title: "What it means to own your operating system",
    description:
      "A letter to clients on control, continuity, and owning the workflows that run your business.",
  },
  {
    date: "Coming soon",
    title: "The case for smaller software stacks",
    description:
      "Why connected systems will replace sprawling collections of software subscriptions.",
  },
  {
    date: "Coming soon",
    title: "Building for the way your team works",
    description:
      "A letter to clients on learning an operation before deciding what technology belongs inside it.",
  },
];

function PostCard({ post }) {
  const content = (
    <article>
      <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-neutral-400">
        {post.date}
      </p>
      <h3 className="mt-4 text-xl font-normal leading-[1.05] tracking-[-0.025em]">
        {post.title}
      </h3>
      <p className="mt-5 text-sm leading-5 text-neutral-600">
        {post.description}
      </p>
      <p className="mt-5 inline-block border-b border-neutral-300 pb-0.5 text-xs text-neutral-400">
        ↳ Read More
      </p>
    </article>
  );

  return post.href ? (
    <Link href={post.href} className="group block">
      {content}
    </Link>
  ) : content;
}

export default function FounderLettersPage() {
  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        <section className="mx-auto max-w-7xl px-6 pb-40 pt-16 lg:px-8 lg:pb-56 lg:pt-20">
          <h1 className="text-5xl font-normal leading-none tracking-[-0.055em] sm:text-7xl lg:text-[5.75rem]">
            Letters from Vlad Usatii
          </h1>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-8 lg:pb-44">
          <h2 className="max-w-md text-3xl font-normal leading-[0.95] tracking-[-0.04em] sm:text-4xl">
            Read the latest from Vlad Usatii:
          </h2>

          <div className="mt-20 grid gap-x-12 gap-y-20 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-x-14 lg:gap-y-24">
            {posts.map((post) => (
              <PostCard key={post.title} post={post} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
