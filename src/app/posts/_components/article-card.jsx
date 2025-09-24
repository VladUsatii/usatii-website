import { useState } from "react"
import {
  Card,
  CardDescription,
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
    excerpt: `Goal: Educate the client on how content is prepped, from start to finish.`,
    body: `### Market research

To build a content system that speaks to real customer demand, we combine qualitative insight with quantitative signals to choose pillars and cadence that predictably earn attention and drive conversions - even if on only a slightly-better scale.

**Define the audience**

At the beginning, we do some basic market research:

- Clarify ICP and the top “jobs to be done” your audience hires content to solve (learn, compare, decide, justify).
- Align research to 2–3 business KPIs (e.g., demo requests, CAC-efficient traffic).

**Content research**

- Competitor and adjacency audit, where we extract recurring themes, hook formats, retention curves, and CTA patterns from your (and any adjacent) categories.
- A matrix where we tag topics by \`volume * freshness * differentiation\` to find high-leverage angles competitors underuse.

**Demand quantification**

- Search intent & keywords. We cluster queries into problem, solution, and brand terms, then estimate volume and difficulty to inform long-form and short-form anchors.
- We capture questions, objections, and phrasing from comments, subreddits, TikTok Q&A, Twitter threads, Discords, and review sites to better understand the space.
- We identify seasonal spikes, product launch cycles, and news hooks to time campaigns - mostly from adjacent categories.

**Hook validation**

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
  },
  {
    id: "2",
    title:"Case Study: KALM",
    excerpt: "We took this brand from a 75 to 450 views per platform on average and got a 20% profile view-rate.",
    body: `**Website**: feelkalm.com
    
**Geography**: US Audiences

**Niche**: Health/Wellness/Well-being

### Context and constraints

KALM sells whole-plant, hemp-based supplements positioned for calm, focus, and sleep with strict structure and function language with no disease claims. To keep brand-safety and relevance high, we constrained creator sourcing to (1) US audience share at ≥80%, (2) wellness/mental-health/kindness creators, and (3) on-record openness to plant-based remedies.

This narrowed our reachable short-form viewerbase to ~8-10% high-intent segment of 100M.

Channels include:
* TikTok
* Instagram Reels
* YouTube Shorts

**Primary success metric**: qualified attention at 3-second hold rate, 75% view-thru.

**Secondary success metric**: brand search index and saves/shares.

## Hypothesis

Our bet: if we pair kindness- or healing-framed hooks with wellness or nutritional content, then in 2 months, we will lift:

* 3-second hold by 20%^ vs. each market-related post baseline
* 75% VTR (view-thru rate) on average
* Saves/shares rate by 15%

## Operating cadence

* Content produced: 60 videos / month (Months 1-4), 30 videos / month (Months 5-12)
* Duration produced: 11.5 months
* Creatives test grid: (1) Face, (2) Review, (3) Interview, (4) Cinematic, and (5) Kindness/Happiness remix content.

## Results

All are standardized. Statistics drawn from client profiles.

| Metric (6-month slice)                    | Value   |
| :---------------------------------------- | :------ |
| Posts                                     | 300     |
| Total video views                         | 135,405 |
| Total profile views                       | 1,137   |
| Total likes                               | 8,992   |
| Total comments                            | 380     |
| Total shares                              | 124     |
| Total engagements (likes+comments+shares) | 9,496   |
| Engagements per 1,000 views               | 70.13   |
| Likes per 1,000 views                     | 66.41   |
| Comments per 1,000 views                  | 2.81    |
| Shares per 1,000 views                    | 0.92    |
| Profile views per 1,000 views             | 8.40    |

| Per-post metric        | Average |
| :--------------------- | :------ |
| Views per post         | 451.35  |
| Likes per post         | 29.97   |
| Comments per post      | 1.27    |
| Shares per post        | 0.41    |
| Profile views per post | 3.79    |

Other results are omitted for brevity. Assume better statistics on YouTube, followed by Instagram.

**Full statistics** (how we performed over the year):

![6-month TikTok progress](/2/TT_1.png)

![YouTube year-long progress](/2/YT_2.png)

![Instagram year-long progress](/2/IG_3.png)

I hope this year-long case study helps anyone who is curious about what organic reach can look like. Keep in mind that this is a *hard* brand to scale through organic advertising, simply due to the number of regulations, constraints, and restrictions on this sort of content and niche in general. Take the results as more impressive than they appear - a scalar multiple of 2x or more is how much you'd see your numbers jump if you decide to work with us.

If you'd like more case studies, please don't hesitate to email me at vlad@usatii.com .
`,
    date: "2025-09-21"
  }
];


function ArticleCard({ id }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row items-center justify-center w-full">
        <Card className="relative cursor-pointer hover:shadow-lg transition-shadow max-w-[700px] w-full">
          <div className="absolute top-2 right-2 font-bold text-sm bg-black text-white flex items-center justify-center rounded-full w-8 h-8">
            {id + 1}
          </div>
          <CardHeader>
            <CardTitle className="font-bold text-2xl">{posts[id].title}</CardTitle>
            <CardDescription>{posts[id].excerpt}</CardDescription>
          </CardHeader>
        </Card>
        </div>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[750px] sm:max-w-[750px] overflow-y-auto max-h-[90vh]">
        <DialogClose className="absolute top-4 right-4" />
        <DialogTitle className="font-bold text-3xl text-black">{posts[id].title}</DialogTitle>

        {/* Preview (plain text / short excerpt) */}
        <p className="prose text-md font-semibold text-black">
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
                <h2 className="text-2xl font-bold mt-5 mb-3 text-black" {...props} />
              ),
              h3: ({node, ...props}) => (
                <h3 className="text-xl font-semibold mt-4 mb-2 text-black" {...props} />
              ),
              p: ({node, ...props}) => (
                <p className="leading-relaxed mb-4 text-black" {...props} />
              ),
              ul: ({node, ...props}) => (
                <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
              ),
              li: ({node, ...props}) => (
                <li className="ml-2 text-black" {...props} />
              ),
              a: ({node, ...props}) => (
                <a
                  className="text-blue-600 underline hover:text-blue-800 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              code: ({node, inline, ...props}) => (
                  <code className="px-2 py-0.5 rounded-lg bg-neutral-100 text-purple-600" {...props} />
              ),
              table: ({node, ...props}) => (
                  <table className="w-full border-collapse border border-gray-200 text-sm text-left mb-6" {...props} />
                ),
                thead: ({node, ...props}) => (
                  <thead className="bg-gray-100 text-gray-700 font-semibold" {...props} />
                ),
                tbody: ({node, ...props}) => (
                  <tbody className="divide-y divide-gray-200" {...props} />
                ),
                tr: ({node, ...props}) => (
                  <tr className="hover:bg-gray-50 transition-colors" {...props} />
                ),
                th: ({node, ...props}) => (
                  <th className="px-4 py-2 border border-gray-200 font-semibold" {...props} />
                ),
                td: ({node, ...props}) => (
                  <td className="px-4 py-2 border border-gray-200" {...props} />
                ),
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
