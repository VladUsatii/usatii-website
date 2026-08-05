import Link from "next/link";
import {
  AudioLines,
  Captions,
  ChevronRight,
  Gauge,
  Layers3,
  ScanFace,
  Sparkles,
} from "lucide-react";
import Footer from "@/app/_components/footer";
import Header from "@/app/_components/header";
import { SchemaScripts } from "@/app/_components/trades/chunky-seo-layout";
import ArticleToc from "@/app/services/_components/article-toc";
import TimWorkCarousel from "@/app/services/_components/tim-work-carousel";

const capabilities = [
  { icon: Sparkles, label: "Prompt-to-clip generation" },
  { icon: Captions, label: "AI transcription and subtitles" },
  { icon: ScanFace, label: "Automatic Face Focus" },
  { icon: Layers3, label: "Editable multi-lane timelines" },
  { icon: AudioLines, label: "Audio analysis and finishing" },
  { icon: Gauge, label: "Native preview and fast export" },
];

function DemoVideoPlaceholder({ title, caption }) {
  return (
    <figure className="my-12 min-w-0">
      <div className="group grid aspect-video place-items-center overflow-hidden rounded-sm border border-neutral-200 bg-neutral-950 text-white">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/25 bg-white/10 text-lg transition group-hover:scale-105">▶</span>
          <p className="mt-5 text-sm font-medium">{title}</p>
          <p className="mt-1 text-xs text-white/45">Video placeholder</p>
        </div>
      </div>
      <figcaption className="mt-3 text-xs leading-5 text-neutral-500">{caption}</figcaption>
    </figure>
  );
}

export default function UsatiiEditorRelease({ schemas }) {
  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        <SchemaScripts schemas={schemas} />

        <header className="mx-auto max-w-3xl px-6 pb-20 pt-20 text-center lg:pb-24 lg:pt-28">
          <p className="text-xs text-neutral-500">Product&nbsp;&nbsp;·&nbsp;&nbsp;August 5, 2026</p>
          <h1 className="mt-7 text-5xl font-medium leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">Introducing Editor</h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
            A next-gen video editor that turns written direction into generated motion graphics, editable projects, intelligent captions, and finished media.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/editor" className="rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-neutral-700">Request access ↗</Link>
            <Link href="/editor/changelog" className="rounded-full bg-neutral-100 px-5 py-2.5 text-xs font-medium transition hover:bg-neutral-200">Read changelog</Link>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-32 lg:grid-cols-[13rem_minmax(0,42rem)] lg:justify-center lg:gap-16 lg:px-8">
          <aside className="hidden lg:block">
            <ArticleToc />
          </aside>

          <article className="min-w-0 text-[15px] leading-7 text-neutral-800">
            <p className="text-xl leading-8 tracking-[-0.02em] text-neutral-950">
              Video creation has gained powerful AI tools, but the workflow around them is fragmented and broken. A generated asset often has to leave one product, enter another, be rebuilt on a timeline, captioned somewhere else, and exported through a stack of three to seven different utilities.
            </p>
            <p className="mt-6">Editor is our answer to that fragmentation. It is a full desktop editing suite designed around generating content to live inside the edit alongside real production workflows.</p>

            <TimWorkCarousel />

            <section id="one-workspace" className="scroll-mt-28">
              <h2 className="text-3xl font-medium leading-tight tracking-[-0.04em] text-neutral-950">From idea to final render</h2>
              <p className="mt-6">The editor uses a four-pane workspace: Imports, Preview, Modification, and Timeline. A/V, text, generated assets, and subtitles live on editable lanes inside the project.</p>
              <p className="mt-5">You can arrange, copy, trim, and rename media, adjust transforms, change speed, work with text layers, preview isolated or timeline clips, and export the same composition to MP4, MOV, and several other formats.</p>
            </section>

            <section id="generation" className="scroll-mt-28 pt-16">
              <h2 className="text-3xl font-medium leading-tight tracking-[-0.04em] text-neutral-950">Generated media becomes a project asset</h2>
              <p className="mt-6">Editor lets you write prompts and outputs a generated SVG animation. The generation layer asks our LLM for an animated visual, validates the result, renders it to video, stores its generation metadata, and places it into the project.</p>
              <p className="mt-5">The generated clip becomes a real piece of media. It can be positioned, timed, layered, combined with footage, and rendered as part of a complete sequence. AI supplies material; the editor preserves authorship.</p>
            </section>

            <DemoVideoPlaceholder
              title="USATII Editor generation demo"
              caption="Reserved for a product walkthrough showing a written prompt becoming generated motion and entering the editable timeline."
            />

            <section id="intelligence" className="scroll-mt-28">
              <h2 className="text-3xl font-medium leading-tight tracking-[-0.04em] text-neutral-950">AI does literally all the rote work</h2>
              <p className="mt-6">Spoken audio is transcribed with word-level timing and converted into subtitle lanes. Editors can choose language, model quality, words per caption, and timing limits, among other things. The captions remain editable text clips, with SRT, VTT, transcript, and run metadata retained alongside the project.</p>
              <p className="mt-5">Face Focus analyzes footage and builds multivariable keyframes around the largest detected face. You can create, update, and delete them, or reshape any with linear, ease-in, ease-out, ease-in-out, and custom velocity curves.</p>
            </section>

            <DemoVideoPlaceholder
              title="USATII Editor editing demo"
              caption="Reserved for a product walkthrough covering subtitles, Face Focus, keyframes, timeline editing, preview, and export."
            />

            <blockquote className="my-16 border-y border-neutral-200 py-10 text-3xl font-medium leading-tight tracking-[-0.04em] text-neutral-950 sm:text-4xl">
              Editing is time-consuming. Give the editor the best raw material and automation possible to minimize rote work.
            </blockquote>

            <section id="performance" className="scroll-mt-28">
              <h2 className="text-3xl font-medium leading-tight tracking-[-0.04em] text-neutral-950">Reliability guarantee</h2>
              <p className="mt-6">Editor includes proxy generation for demanding source media, background timeline pre-rendering, waveform generation, media probing, thumbnail services, LUT templates, clip retiming, audio processing, and cache inspection. We currently support only Apple Silicon.</p>
              <p className="mt-5">Export is split into Quick and Master paths. Quick export can use prepared timeline cache for fast delivery. Master export exposes format, H.264 or HEVC encoding, quality, aspect ratio, and frame-rate controls. Audio-only output supports M4A, WAV, and MP3.</p>
              <p className="mt-5">Other features include:</p>

              <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-neutral-200 bg-neutral-200 sm:grid-cols-2">
                {capabilities.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 bg-white p-5 text-sm font-medium text-neutral-950"><Icon className="h-4 w-4" />{label}</div>
                ))}
              </div>
            </section>

            <section className="pt-16">
              <h2 className="text-3xl font-bold italic leading-tight tracking-[-0.04em] text-neutral-950">We still deliver real work.</h2>
              <p className="mt-6">If you run a company or create content and need a scalable marketing or content strategy, this is still a real wheelhouse for our team. Schedule a call to understand how we do business. Over time, you may even consider adopting our Editor for your business needs.</p>
            </section>

            <section className="pt-16">
              <h2 className="text-3xl font-medium leading-tight tracking-[-0.04em] text-neutral-950">For production pipelines</h2>
              <p className="mt-6">Usatii began building Editor from the same pressure that shaped our marketing work: short deadlines, thousands of deliverables, repeated revisions, multiple aspect ratios, and the need to turn founder-led ideas into socially-acceptable media.</p>
              <p className="mt-5">We are the first proven operator around our own software pipeline. The software is designed around the operating loop our team actually uses in-house.</p>
            </section>

            <section id="availability" className="scroll-mt-28 pt-16">
              <h2 className="text-3xl font-medium leading-tight tracking-[-0.04em] text-neutral-950">Availability</h2>
              <p className="mt-6">Usatii's Editor is currently in active development for macOS, with Apple Silicon as the primary supported platform.</p>
              <Link href="/editor" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-neutral-950 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-950">Request the product <ChevronRight className="h-4 w-4" /></Link>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
