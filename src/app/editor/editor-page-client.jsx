"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Captions, Check, Clock3, Crop, History, Layers3, Library, Mic2, Music2, Pause, Play, ScanFace, SlidersHorizontal, Sparkles, SwatchBook, Type, Volume2, VolumeX } from "lucide-react";

const capabilities = [
  [Layers3, "Multi-lane timeline", "Arrange video, audio, text, subtitles, and generated clips on separate lanes. Trim, move, duplicate, rename, and layer clips inside the project."],
  [Sparkles, "Prompted motion graphics", "Describe the graphic you need, render it, and place the result on the timeline. Revise the prompt and render another version without leaving the edit."],
  [Captions, "Editable subtitles", "Create subtitles from a video or audio clip, choose the language and words per subtitle, then edit every caption as a normal text clip."],
  [ScanFace, "Face Focus", "Analyze a video and create framing keyframes that follow the largest face. Review, adjust, or remove any keyframe before export."],
  [SlidersHorizontal, "Clip controls", "Set position, scale, rotation, opacity, crop, alignment, pivot, fit, reflection, and chroma key values from one inspector."],
  [Mic2, "Audio repair", "Remove noise, isolate voices, reduce echo, match loudness across selected clips, compress dynamics, and adjust tone."],
  [Library, "Media search", "Search royalty-free video and audio, preview the results, and import selected media directly into the current project."],
  [SwatchBook, "Reusable color looks", "Import .cube color looks, save them in the application, and control the strength of the look on each visual clip."],
  [History, "Project checkpoints", "Create named points in the edit, return to an earlier checkpoint, and export a progress pack when another person needs to review the work."],
];

const workflow = [
  ["01", "Bring in the footage", "Add a folder or individual media files, search the import list, switch between list and grid views, and relink a file if it moves."],
  ["02", "Build the cut", "Place clips on the timeline, make timing changes, add text or subtitles, and preview the full sequence or an individual clip."],
  ["03", "Finish each clip", "Adjust framing, crop, animation, color, playback speed, and audio from the inspector. Copy a finished appearance to another clip when it should match."],
  ["04", "Export the result", "Use Quick export for a prepared review file or Master export for final delivery. Choose landscape or portrait, H.264 or HEVC, quality, and frame rate."],
];

const outputOptions = ["MP4 and MOV video", "H.264 and HEVC encoding", "16:9 landscape and 9:16 portrait", "Quick and Master export modes", "M4A, WAV, and MP3 audio-only export", "Selectable quality and frame rate"];

function Reveal({ children, className = "", delay = 0, amount = 0.18 }) {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 28 }} whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function SectionLabel({ children }) {
  return <p className="text-sm tabular-nums text-neutral-400">{children}</p>;
}

function DemoPlayer() {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setStarted(true);
      try { await video.play(); } catch { setStarted(false); }
    } else video.pause();
  }

  function toggleAudio() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <div className="relative overflow-hidden rounded-[1.25rem] bg-neutral-950 shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:rounded-[2rem] md:shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
      <video ref={videoRef} src="/profit_example.mp4" aria-label="Motion graphic created inside USATII Editor" loop muted playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} className="aspect-video h-full w-full object-contain" />
      {!started ? (
        <button type="button" onClick={togglePlayback} className="absolute inset-0 grid place-items-center bg-neutral-950/20 text-white transition hover:bg-neutral-950/30" aria-label="Play Editor demo"><span className="inline-flex items-center gap-3 rounded-full bg-neutral-950/80 px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-sm"><Play className="h-4 w-4 fill-current" />Play demo</span></button>
      ) : (
        <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-4 sm:right-4">
          <button type="button" onClick={togglePlayback} className="grid h-11 w-11 place-items-center rounded-full bg-neutral-950/80 text-white backdrop-blur-sm" aria-label={playing ? "Pause demo" : "Play demo"}>{playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}</button>
          <button type="button" onClick={toggleAudio} className="grid h-11 w-11 place-items-center rounded-full bg-neutral-950/80 text-white backdrop-blur-sm" aria-label={muted ? "Turn demo sound on" : "Turn demo sound off"}>{muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}</button>
        </div>
      )}
    </div>
  );
}

function LargeHeading({ children }) {
  return <h2 className="mt-5 max-w-5xl text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[0.95] tracking-[-0.045em]">{children}</h2>;
}

export default function EditorPageClient() {
  return (
    <main className="overflow-hidden bg-white text-neutral-950">
      <section className="mx-auto w-full max-w-6xl px-5 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start lg:grid-cols-[minmax(0,1fr)_24rem]">
          <Reveal><SectionLabel>USATII / EDITOR</SectionLabel><h1 className="mt-5 max-w-4xl text-[clamp(2.7rem,6vw,5.5rem)] font-medium leading-[0.88] tracking-[-0.055em]">Edit faster without giving up <span className="text-violet-600">control.</span></h1></Reveal>
          <Reveal className="md:pt-5" delay={0.12}>
            <p className="text-xl font-medium leading-[1.15] tracking-[-0.03em] md:text-2xl">USATII Editor brings the timeline, motion graphics, subtitles, audio cleanup, and final export into one macOS application.</p>
            <p className="mt-5 max-w-sm text-base leading-7 text-neutral-600">It is built for editors who want faster routine work without giving up direct control over clips, timing, sound, text, or delivery settings.</p>
            <a href="#demo" className="mt-8 inline-flex w-full items-center justify-between border-b border-neutral-300 pb-2 text-sm font-medium transition-colors hover:border-violet-700 hover:text-violet-700">Watch the product demo<ArrowRight className="h-4 w-4" /></a>
          </Reveal>
        </div>
        <Reveal className="mt-12 sm:mt-14 md:mt-20" amount={0.1}><div className="overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-neutral-950 shadow-[0_18px_50px_rgba(15,23,42,0.14)] sm:rounded-[2rem]"><Image src="/USATII_EDITOR_DEMO.gif" alt="USATII Editor interface with imports, preview, inspector, and timeline" width={708} height={480} unoptimized className="h-auto w-full" /></div></Reveal>
      </section>

      <section id="demo" className="mx-auto w-full max-w-6xl scroll-mt-24 border-t border-neutral-200 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <Reveal><SectionLabel>01 / PRODUCT DEMO</SectionLabel></Reveal>
        <div className="mt-5 grid gap-8 md:grid-cols-2 md:items-end"><Reveal delay={0.05}><LargeHeading>Written direction becomes <span className="text-violet-600">editable media.</span></LargeHeading></Reveal><Reveal delay={0.1}><p className="max-w-lg text-base leading-7 text-neutral-600">This clip began as a written request for a shrinking circular chart that shows profit loss. Editor rendered the animation as a clip that can be timed, layered, transformed, and exported with the rest of the project.</p></Reveal></div>
        <Reveal className="mt-12 md:mt-16" amount={0.1}><DemoPlayer /></Reveal>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-neutral-200 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <Reveal><SectionLabel>02 / WORKFLOW</SectionLabel></Reveal><Reveal delay={0.05}><LargeHeading>One project from import to <span className="text-violet-600">final file.</span></LargeHeading></Reveal>
        <div className="mt-12 grid border-t border-neutral-200 md:mt-20 md:grid-cols-2">{workflow.map(([number, title, text], index) => <Reveal key={number} delay={index * 0.05} className="border-b border-neutral-200 py-8 md:odd:pr-10 md:even:border-l md:even:pl-10"><p className="text-sm tabular-nums text-violet-600">{number}</p><h3 className="mt-5 text-2xl font-medium leading-tight tracking-[-0.03em]">{title}</h3><p className="mt-4 max-w-md text-base leading-7 text-neutral-600">{text}</p></Reveal>)}</div>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-neutral-200 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <Reveal><SectionLabel>03 / CAPABILITIES</SectionLabel></Reveal><Reveal delay={0.05}><LargeHeading>The controls an editor <span className="text-violet-600">uses every day.</span></LargeHeading></Reveal>
        <div className="mt-12 grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">{capabilities.map(([Icon, title, text], index) => <Reveal key={title} delay={(index % 3) * 0.04} className="h-full bg-white p-7 sm:p-8"><Icon className="h-5 w-5 text-violet-600" /><h3 className="mt-8 text-xl font-medium tracking-[-0.025em]">{title}</h3><p className="mt-4 text-sm leading-6 text-neutral-600">{text}</p></Reveal>)}</div>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-neutral-200 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16"><Reveal><SectionLabel>04 / CONTROL</SectionLabel><LargeHeading>Every automatic change remains <span className="text-violet-600">editable.</span></LargeHeading></Reveal><Reveal delay={0.08} className="md:pt-8"><div className="space-y-8">
          {[[Clock3,"Keyframe timing","Add, update, delete, and jump between position and scale keyframes. Choose linear, ease-in, ease-out, ease-in-out, or a custom velocity curve for each segment."],[Crop,"Framing and appearance","Set crop values by side, lock the aspect ratio while cropping, choose contain or cover behavior, align the clip, set its pivot, or use chroma key controls."],[Type,"Text that remains editable","Change font, alignment, wrapping, placement, and timing after a title or subtitle has been added to the timeline."],[Music2,"Sound inside the project","Preview and render custom music to a new WAV clip, view audio measurements, and continue editing the result on the timeline."]].map(([Icon,title,text]) => <div key={title} className="grid grid-cols-[2rem_1fr] gap-4"><Icon className="mt-1 h-5 w-5 text-violet-600" /><div><h3 className="text-lg font-medium">{title}</h3><p className="mt-2 leading-7 text-neutral-600">{text}</p></div></div>)}
        </div></Reveal></div>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-neutral-200 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16"><Reveal><SectionLabel>05 / DELIVERY</SectionLabel><LargeHeading>Export for review or <span className="text-violet-600">final delivery.</span></LargeHeading></Reveal><Reveal delay={0.08} className="md:pt-8"><p className="text-xl font-medium leading-[1.2] tracking-[-0.025em]">Quick mode creates a prepared review file. Master mode exposes the format, encoding, quality, aspect ratio, and frame rate controls used for final output.</p><ul className="mt-10 grid gap-4">{outputOptions.map((option) => <li key={option} className="flex items-center gap-3 border-b border-neutral-200 pb-4 text-sm"><Check className="h-4 w-4 text-violet-600" />{option}</li>)}</ul></Reveal></div>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-neutral-200 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <Reveal><SectionLabel>06 / USER REVIEWS</SectionLabel></Reveal><div className="mt-5 grid gap-8 md:grid-cols-2 md:items-end"><Reveal delay={0.05}><LargeHeading>Reviews belong to the people who <span className="text-violet-600">used the product.</span></LargeHeading></Reveal><Reveal delay={0.1}><p className="max-w-lg text-base leading-7 text-neutral-600">Editor is still in private testing. We will publish attributed reviews here after testers approve their names, roles, and exact words for publication.</p></Reveal></div>
        <Reveal className="mt-12 md:mt-16"><div className="grid gap-8 border-y border-neutral-200 py-8 sm:grid-cols-[10rem_1fr] sm:items-center"><p className="text-sm font-medium text-violet-600">Private test group</p><p className="max-w-2xl text-sm leading-6 text-neutral-600">Each published review will include the tester&apos;s name, professional role, and unedited statement. This section is ready for those entries once publication consent is recorded.</p></div></Reveal>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-neutral-200 px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <Reveal><SectionLabel>07 / ACCESS</SectionLabel></Reveal><div className="mt-5 grid gap-10 md:grid-cols-2 md:items-end"><Reveal delay={0.05}><LargeHeading>Built for <span className="text-violet-600">Apple Silicon.</span></LargeHeading></Reveal><Reveal delay={0.1}><p className="max-w-lg text-base leading-7 text-neutral-600">The current application runs on Apple Silicon Macs. Request access if you want to test it with real footage and tell us where the editing process still takes too much time.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/quote-request" className="inline-flex items-center justify-between border-b border-neutral-950 pb-3 text-sm font-medium transition-colors hover:border-violet-700 hover:text-violet-700">Request access<ArrowRight className="h-4 w-4" /></Link><Link href="/editor/changelog" className="inline-flex items-center justify-between border-b border-neutral-300 pb-3 text-sm font-medium transition-colors hover:border-violet-700 hover:text-violet-700">Read the changelog<ArrowRight className="h-4 w-4" /></Link></div></Reveal></div>
      </section>
    </main>
  );
}
