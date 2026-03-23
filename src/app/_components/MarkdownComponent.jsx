import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeMathjaxSvg from "rehype-mathjax/svg";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MarkdownContent({ content }) {
  return (
    <div className="case-study-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeMathjaxSvg]}
        components={{
          h1: ({ className, ...props }) => (
            <h1
              className={cn(
                "mt-10 text-4xl font-semibold tracking-tight text-slate-950 first:mt-0 sm:text-5xl",
                className
              )}
              {...props}
            />
          ),
          h2: ({ className, ...props }) => (
            <h2
              className={cn(
                "mt-12 border-t border-slate-200 pt-8 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl",
                className
              )}
              {...props}
            />
          ),
          h3: ({ className, ...props }) => (
            <h3
              className={cn(
                "mt-8 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl",
                className
              )}
              {...props}
            />
          ),
          p: ({ className, ...props }) => (
            <p
              className={cn(
                "mt-5 text-[16px] leading-8 text-slate-700",
                className
              )}
              {...props}
            />
          ),
          a: ({ className, ...props }) => (
            <a
              className={cn(
                "font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-4 transition hover:text-indigo-700",
                className
              )}
              {...props}
            />
          ),
          ul: ({ className, ...props }) => (
            <ul
              className={cn(
                "mt-5 space-y-3 pl-6 text-[16px] leading-8 text-slate-700 marker:text-indigo-500 list-disc",
                className
              )}
              {...props}
            />
          ),
          ol: ({ className, ...props }) => (
            <ol
              className={cn(
                "mt-5 space-y-3 pl-6 text-[16px] leading-8 text-slate-700 marker:font-semibold marker:text-slate-500 list-decimal",
                className
              )}
              {...props}
            />
          ),
          li: ({ className, ...props }) => (
            <li className={cn("pl-1", className)} {...props} />
          ),
          blockquote: ({ className, ...props }) => (
            <blockquote
              className={cn(
                "mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700",
                className
              )}
              {...props}
            />
          ),
          hr: ({ className, ...props }) => (
            <hr className={cn("my-10 border-slate-200", className)} {...props} />
          ),
          table: ({ className, ...props }) => (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table
                className={cn("min-w-full bg-white text-left", className)}
                {...props}
              />
            </div>
          ),
          thead: ({ className, ...props }) => (
            <thead className={cn("bg-slate-50", className)} {...props} />
          ),
          th: ({ className, ...props }) => (
            <th
              className={cn(
                "border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900",
                className
              )}
              {...props}
            />
          ),
          td: ({ className, ...props }) => (
            <td
              className={cn(
                "border-b border-slate-100 px-4 py-3 text-sm text-slate-700 align-top",
                className
              )}
              {...props}
            />
          ),
          code({ inline, className, children, ...props }) {
            if (inline) {
              return (
                <code
                  className={cn(
                    "rounded-md bg-slate-100 px-1.5 py-1 font-mono text-[0.92em] text-slate-900",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <pre className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-5 text-sm text-slate-100">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          img: ({ className, alt, ...props }) => (
            <img
              className={cn(
                "mt-8 w-full rounded-3xl border border-slate-200 bg-white object-cover shadow-sm",
                className
              )}
              alt={alt || ""}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}