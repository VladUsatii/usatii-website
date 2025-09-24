'use client';
// /posts/[postId]/page.jsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { posts } from "../_components/article-card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { use } from "react";

export default function PostPage({ params }) {
  // unwrap the params Promise (Next.js 15+)
  const { postId } = use(params);

  const post = posts.find((p) => p.id === postId);

  if (!post) return notFound();

  return (
    <main className="flex flex-col items-center px-4 py-10">
      {/* Brand link */}
      <Link href="/">
        <h1 className="font-black text-center text-sm text-neutral-700 hover:text-black tracking-tight italic">
          USATII MEDIA
        </h1>
      </Link>

      <article className="w-full max-w-[750px] mt-6">
        {/* Title */}
        <h1 className="font-bold text-3xl text-black mb-2">{post.title}</h1>

        {/* Date */}
        {post.date && (
          <p className="text-gray-500 text-sm mb-6">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {/* Excerpt */}
        <p className="text-lg font-semibold text-black mb-6">{post.excerpt}</p>

        {/* Markdown body */}
        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-extrabold mt-6 mb-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-bold mt-5 mb-3 text-black" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-semibold mt-4 mb-2 text-black" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="leading-relaxed mb-4 text-black" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="ml-2 text-black" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-600 underline hover:text-blue-800 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              code: ({ node, inline, ...props }) => (
                <code
                  className="px-2 py-0.5 rounded-lg bg-neutral-100 text-purple-600"
                  {...props}
                />
              ),
              table: ({ node, ...props }) => (
                <table
                  className="w-full border-collapse border border-gray-200 text-sm text-left mb-6"
                  {...props}
                />
              ),
              thead: ({ node, ...props }) => (
                <thead
                  className="bg-gray-100 text-gray-700 font-semibold"
                  {...props}
                />
              ),
              tbody: ({ node, ...props }) => (
                <tbody className="divide-y divide-gray-200" {...props} />
              ),
              tr: ({ node, ...props }) => (
                <tr className="hover:bg-gray-50 transition-colors" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className="px-4 py-2 border border-gray-200 font-semibold" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="px-4 py-2 border border-gray-200" {...props} />
              ),
            }}
          >
            {post.body}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
