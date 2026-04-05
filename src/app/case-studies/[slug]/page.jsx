import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax/svg";
import {
  getAllCaseStudies,
  getAllCaseStudySlugs,
  getCaseStudyBySlug,
} from "@/lib/case-studies";

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${study.title} | Case Studies`,
    description: study.excerpt,
  };
}

function Markdown({ content }) {
  return (
    <div
      className="
        prose prose-slate max-w-none
        prose-headings:font-semibold
        prose-headings:tracking-tight
        prose-headings:text-slate-950
        prose-p:text-slate-700
        prose-p:leading-8
        prose-li:text-slate-700
        prose-strong:text-slate-950
        prose-a:text-slate-950
        prose-a:no-underline
        hover:prose-a:underline
        prose-code:before:content-none
        prose-code:after:content-none
        prose-pre:bg-transparent
        prose-pre:p-0
        prose-img:rounded-2xl
        prose-hr:border-slate-200
        prose-blockquote:border-slate-300
        prose-blockquote:text-slate-700
        prose-th:text-slate-950
        prose-td:text-slate-700

        [&_mjx-container]:my-6
        [&_mjx-container]:max-w-full
        [&_mjx-container]:overflow-x-auto
        [&_mjx-container]:text-slate-950
        [&_mjx-container_svg]:max-w-none
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeMathjax]}
        components={{
          h1({ children, ...props }) {
            return (
              <h1
                className="mt-12 mb-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl"
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2({ children, ...props }) {
            return (
              <h2
                className="mt-12 mb-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            return (
              <h3
                className="mt-10 mb-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
                {...props}
              >
                {children}
              </h3>
            );
          },
          h4({ children, ...props }) {
            return (
              <h4
                className="mt-8 mb-3 text-xl font-semibold tracking-tight text-slate-950"
                {...props}
              >
                {children}
              </h4>
            );
          },
          h5({ children, ...props }) {
            return (
              <h5
                className="mt-6 mb-2 text-lg font-semibold text-slate-950"
                {...props}
              >
                {children}
              </h5>
            );
          },
          h6({ children, ...props }) {
            return (
              <h6
                className="mt-6 mb-2 text-base font-semibold uppercase tracking-[0.12em] text-slate-500"
                {...props}
              >
                {children}
              </h6>
            );
          },
          p({ children, ...props }) {
            const nodes = React.Children.toArray(children).filter((child) => {
              return !(typeof child === "string" && child.trim() === "");
            });

            const isImageLike = (child) => {
              if (!React.isValidElement(child)) return false;

              if (typeof child.props?.src === "string") return true;

              const nested = React.Children.toArray(child.props?.children).filter(
                (node) => !(typeof node === "string" && node.trim() === "")
              );

              return (
                nested.length === 1 &&
                React.isValidElement(nested[0]) &&
                typeof nested[0].props?.src === "string"
              );
            };

            const imageOnlyParagraph =
              nodes.length > 0 && nodes.every((child) => isImageLike(child));

            if (imageOnlyParagraph) {
              return (
                <div
                  className="my-8 grid grid-cols-2 gap-4 md:grid-cols-4 [&_img]:my-0"
                  {...props}
                >
                  {nodes}
                </div>
              );
            }

            return (
              <p className="my-5 text-[17px] leading-8 text-slate-700" {...props}>
                {children}
              </p>
            );
          },
          a({ href, children, ...props }) {
            const external = href?.startsWith("http");
            return (
              <a
                href={href}
                className="font-medium text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-950"
                {...(external
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
          strong({ children, ...props }) {
            return (
              <strong className="font-semibold text-slate-950" {...props}>
                {children}
              </strong>
            );
          },
          em({ children, ...props }) {
            return (
              <em className="italic text-slate-800" {...props}>
                {children}
              </em>
            );
          },
          del({ children, ...props }) {
            return (
              <del className="text-slate-500 line-through" {...props}>
                {children}
              </del>
            );
          },
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="my-8 rounded-r-2xl border-l-4 border-slate-300 bg-slate-50 px-5 py-4 text-[16px] italic leading-8 text-slate-700"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          hr(props) {
            return <hr className="my-10 border-slate-200" {...props} />;
          },
          ul({ children, ...props }) {
            return (
              <ul
                className="my-6 list-disc space-y-2 pl-6 text-[17px] leading-8 text-slate-700 marker:text-slate-400"
                {...props}
              >
                {children}
              </ul>
            );
          },
          ol({ children, ...props }) {
            return (
              <ol
                className="my-6 list-decimal space-y-2 pl-6 text-[17px] leading-8 text-slate-700 marker:font-medium marker:text-slate-500"
                {...props}
              >
                {children}
              </ol>
            );
          },
          li({ children, ...props }) {
            return (
              <li className="pl-1 text-slate-700" {...props}>
                {children}
              </li>
            );
          },
          table({ children, ...props }) {
            return (
              <div className="my-8 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full border-collapse text-left" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          thead({ children, ...props }) {
            return <thead className="bg-slate-50" {...props}>{children}</thead>;
          },
          tbody({ children, ...props }) {
            return <tbody className="bg-white" {...props}>{children}</tbody>;
          },
          tr({ children, ...props }) {
            return (
              <tr className="border-t border-slate-200" {...props}>
                {children}
              </tr>
            );
          },
          th({ children, ...props }) {
            return (
              <th
                className="px-4 py-3 text-sm font-semibold text-slate-950"
                {...props}
              >
                {children}
              </th>
            );
          },
          td({ children, ...props }) {
            return (
              <td
                className="px-4 py-3 align-top text-sm leading-7 text-slate-700"
                {...props}
              >
                {children}
              </td>
            );
          },
          img({ src, alt, ...props }) {
            return (
              <img
                src={src || ""}
                alt={alt || ""}
                className="my-8 h-auto w-full rounded-2xl border border-slate-200"
                {...props}
              />
            );
          },
          pre({ children, ...props }) {
            return (
              <pre
                className="my-8 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-5 text-sm leading-7 text-slate-100"
                {...props}
              >
                {children}
              </pre>
            );
          },
          code({ className, children, ...props }) {
            const isBlock = Boolean(className);

            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <code
                className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-slate-900"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;

  const [study, allStudies] = await Promise.all([
    getCaseStudyBySlug(slug),
    getAllCaseStudies(),
  ]);

  if (!study) notFound();

  const currentIndex = allStudies.findIndex((item) => item.slug === study.slug);
  const previousStudy = currentIndex > 0 ? allStudies[currentIndex - 1] : null;
  const nextStudy =
    currentIndex >= 0 && currentIndex < allStudies.length - 1
      ? allStudies[currentIndex + 1]
      : null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <Link href="/" className="block">
          <div className="text-center font-black italic tracking-tight hover:opacity-80">
            USATII MEDIA
          </div>
        </Link>

        <div className="px-6 py-8 sm:px-8 md:px-10 md:py-10">
          <div className="flex flex-wrap gap-2 text-xs font-bold text-neutral-600">
            {study.readingTime} min read • Written by Vlad Usatii
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
            {study.title}
          </h1>

          {study.excerpt ? (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {study.excerpt}
            </p>
          ) : null}
        </div>

        <article className="mx-auto mt-10 max-w-5xl">
          <Markdown content={study.content} />
        </article>

        {(previousStudy || nextStudy) && (
          <div className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-2">
            {previousStudy ? (
              <Link
                href={`/case-studies/${previousStudy.slug}`}
                className="rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Previous
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  {previousStudy.title}
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextStudy ? (
              <Link
                href={`/case-studies/${nextStudy.slug}`}
                className="rounded-[24px] border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Next
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  {nextStudy.title}
                </div>
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}