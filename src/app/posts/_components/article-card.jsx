import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const posts = [
  {
    id: "1",
    title: "Short-form video workflow explained",
    excerpt: ``,
    body: `### Market research

To build a content system that speaks to real customer demand, we combine qualitative insight with quantitative signals to choose pillars and cadence that predictably earn attention and drive conversions - even if on only a slightly-better scale.

**Define the audience**

At the beginning, we do some basic market research:

- Clarify ICP and the top “jobs to be done” your audience hires content to solve (learn, compare, decide, justify).
- Align research to 2–3 business KPIs (e.g., demo requests, CAC-efficient traffic).

Afterwards, our content research includes:

- Competitor and adjacency audit, where we extract recurring themes, hook formats, retention curves, and CTA patterns from your (and any adjacent) categories.
- A matrix where we tag topics by \`volume * freshness * differentiation\` to find high-leverage angles competitors underuse.

We quantify demand through the following:

- Search intent & keywords. We cluster queries into problem, solution, and brand terms, then estimate volume and difficulty to inform long-form and short-form anchors.
- We capture questions, objections, and phrasing from comments, subreddits, TikTok Q&A, Twitter threads, Discords, and review sites to better understand the space.
- We identify seasonal spikes, product launch cycles, and news hooks to time campaigns - mostly from adjacent categories.

When it is time to validate hooks:

- We run a hook lab, where we transform insights into 20–40 testable hooks per pillar (promise, pattern interrupt, tension, proof).
- Rapid A/Bs with polls, small-budget boosts, and community samples to verify interest.

Then it is time to create a content calendar.

### Content calendar

- Convert research into 3–5 pillars (education, comparison, proof, POV, community, depending on the niche) and name recurring series that audiences recognize.
- Cadence & channel fit is done by assigning formats and posting rhythm by platform (TikTok/Shorts/Reels/LinkedIn/X/YouTube), optimizing for watch time and saves.
- We also maintain a repo of hooks, intros, and CTAs.

### Working with you

We create:

- An Airtable folder with your upload statuses
- A content calendar PDF you can follow (will be uploaded to Notion as well on request)
- A Drive with two folders: Raw and Final. Raw for raw clips that you send us, and Final for final packaged videos, ready for upload.

If necessary, we both send:

- Pertinent legal documents, NDAs, and tax forms
- Any special advice or requests for content

When we finish a video, we email or text you. All videos are usually done within 24 hours.

### KPIs & Analysis

- We track retention (A3/A5 hold), CTR, save/share rate, comments per view, and conversion assists.
- Content R&D is done by feeding winners back into the calendar, iterating on near-misses, and retiring low-signal pillars.
- The voice of the customer is of utmost importance. Continuously harvest phrasing from DMs, sales calls, and support tickets to sharpen scripts and captions.`,
    date: "2025-05-24"
  }
];


function ArticleCard({ id }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-bold text-2xl">{posts[id].title}</CardTitle>
          </CardHeader>
        </Card>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[750px] sm:max-w-[750px] overflow-y-auto max-h-[90vh]">
        <DialogClose className="absolute top-4 right-4" />
        <DialogTitle className="font-bold text-2xl">{posts[id].title}</DialogTitle>

        {/* Preview (plain text / short excerpt) */}
        <p className="prose text-md text-neutral-600">
          {posts[id].excerpt}
        </p>

        {/* Full Markdown body */}
        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => (
                <h1 className="text-3xl font-extrabold mt-6 mb-4" {...props} />
              ),
              h2: ({node, ...props}) => (
                <h2 className="text-2xl font-bold mt-5 mb-3 text-neutral-800" {...props} />
              ),
              h3: ({node, ...props}) => (
                <h3 className="text-xl font-semibold mt-4 mb-2 text-neutral-700" {...props} />
              ),
              p: ({node, ...props}) => (
                <p className="leading-relaxed mb-4 text-neutral-600" {...props} />
              ),
              ul: ({node, ...props}) => (
                <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
              ),
              li: ({node, ...props}) => (
                <li className="ml-2 text-neutral-700" {...props} />
              ),
              a: ({node, ...props}) => (
                <a
                  className="text-blue-600 underline hover:text-blue-800 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              code: ({node, inline, ...props}) =>
                  <code className="px-2 py-0.5 rounded-lg bg-neutral-100 text-purple-600" {...props} />
            }}
          >
            {posts[id].body}
          </ReactMarkdown>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ArticleCard
