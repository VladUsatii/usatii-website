'use client'
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/WELCOME_SMALL.mp4"; // e.g. /reel.mp4 in /public
const VIDEO_POSTER = "/WELCOME.png"; // optional poster placed in /public (safe to delete if unused)
const VIDEO_DESCRIPTION = `A quick 3-minute tour of our organic content systems: market intelligence, episodic
campaigns, and a proprietary short‑form pipeline. This reel highlights how we turn raw footage into powerful content marketing systems.`;

const BOOKING_URL = "https://cal.com/usatii/onboarding";

export default function UsatiiVideoLanding() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Autoplay requires muted on most browsers
    v.muted = isMuted;
    const onTime = () => setProgress((v.currentTime / v.duration) * 100 || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [isMuted]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  };

  const restart = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0; v.play();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white selection:bg-white/20 selection:text-white">
      {/* Top nav */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[#0b0f14]/60 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <a href="/" className="font-bold tracking-tight text-lg md:text-xl">
            <span className="text-white italic">USATII MEDIA</span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href={BOOKING_URL}
              className="group inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 active:scale-[.98] transition"
            >
              <span>Book a call</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-70 group-hover:translate-x-0.5 transition">
                <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Hero with video */}
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_70%_10%,rgba(72, 0, 255, 0.18),transparent),radial-gradient(50%_60%_at_0%_100%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-white/70">
            <Badge>Enterprise‑grade systems</Badge>
            <Badge>Save 30 hrs/week</Badge>
            <Badge>Own your IP</Badge>
            <Badge>60+ human‑made videos/mo</Badge>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            We build marketing systems for teams.
          </h1>
          <p className="mt-3 w-full text-white/70">
            Clients save an average of 30 hours per week on content and $10,000 per year on software. We design content systems once, then operate forever. Our team excels at machine learning, computer vision, video technologies, and full-stack software development. We are your one-stop-shop for marketing systems.
          </p>

          {/* Video frame */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
            <div className="relative">
              <video
                ref={videoRef}
                src={VIDEO_SRC}
                poster={VIDEO_POSTER}
                autoPlay
                playsInline
                muted
                loop
                className="w-full h-[44vh] md:h-[62vh] object-cover"
              >
                Sorry, your browser doesn't support embedded videos.
              </video>

              {/* Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 rounded-full bg-black/50 backdrop-blur px-2 py-1.5">
                  <button onClick={togglePlay} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 transition">
                    {isPlaying ? (
                      <span className="flex items-center gap-1">
                        <IconPause /> <span>Pause</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <IconPlay /> <span>Play</span>
                      </span>
                    )}
                  </button>
                  <button onClick={restart} className="rounded-full px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 transition inline-flex items-center gap-1">
                    <IconReplay /> <span>Replay</span>
                  </button>
                  <button onClick={toggleMute} className="rounded-full px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 transition inline-flex items-center gap-1">
                    {isMuted ? <IconMuted /> : <IconVolume />} <span>{isMuted ? "Unmute" : "Mute"}</span>
                  </button>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full bg-white/70" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <a href={BOOKING_URL} className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white text-[#0b0f14] px-4 py-2 text-sm font-semibold hover:bg-white/90 active:scale-[.98] transition">
                  Book a call
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-70">
                    <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Description block */}
            <div className="border-t border-white/10 bg-[#0b0f14]/80 p-5 md:p-8">
              <div className="grid md:grid-cols-[1.2fr_.8fr] gap-6">
                <div>
                  <h2 className="text-lg md:text-xl font-bold">About this video</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/80">{VIDEO_DESCRIPTION}</p>
                </div>
                <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm text-white/70">Ready to turn content into a proprietary marketing system?</p>
                    <h3 className="mt-1 text-xl font-semibold">Book a 30‑minute intro</h3>
                    <ul className="mt-3 space-y-2 text-sm text-white/75">
                      <li className="flex items-center gap-2"><Dot />Intro to your brand</li>
                      <li className="flex items-center gap-2"><Dot />Quick marketing audit</li>
                      <li className="flex items-center gap-2"><Dot />Timeline and next steps</li>
                    </ul>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <a href={BOOKING_URL} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white text-[#0b0f14] px-4 py-2.5 font-semibold hover:bg-white/90 active:scale-[.98] transition">Book now</a>
                    <a href="#faq" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2.5 text-sm hover:bg-white/10">FAQ</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social proof row */}
          <h1 className="mt-10 text-2xl md:text-3xl font-semibold tracking-tight">Useful stats</h1>
          <p className="mt-2 max-w-2xl text-white/70">How we stack up over different metrics.</p>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-white/60">
            <Stat label="average follower increase / quarter" value="> 50%" />
            <Stat label="viewer retention @ 5s" value="> 95%" />
            <Stat label="short-form videos/month" value="60+" />
            <Stat label="time saved / week" value="30 hr" />
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Extensive growth systems</h2>
        <p className="mt-2 max-w-2xl text-white/70">Battle‑tested operating systems that turn your value prop into compounding attention and brand equity.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Feature title="Market intelligence" desc="24/7 scraping of industry chatter, social signals and competitor moves into your private data bank." />
          <Feature title="Strategic ideation" desc="Episodic campaigns distilled from OKRs and timelines; every idea ties to a growth goal." />
          <Feature title="Story engine" desc="Atomization pipeline that translates long‑form into shorts + text, multiplying output 10×." />
          <Feature title="Syndication systems" desc="Per‑platform cadence with last‑hour metrics sustaining content variety and reach." />
          <Feature title="Feedback formula" desc="Clean hubs surface hook‑rate, retention curves and conversion velocity; anomalies trigger retros." />
          <Feature title="Automation loop" desc="Zapier + Lambdas recycle winners into reusable playbooks, shaving ≥20 hrs/week." />
        </div>
      </section>

      {/* Big CTA */}
      <section className="relative py-14">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06))]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.07] to-white/[0.04] p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-sm text-white/70">Start in 7 days or less</p>
                <h3 className="mt-1 text-2xl md:text-3xl font-semibold">Design once. Operate forever.</h3>
                <p className="mt-3 text-white/75">One build + a light content retainer beats heavy agency fees and tool sprawl. Own the stack. Own the IP.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-10">FAQs</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <FAQ q="Can you work with our existing brand kit?" a="Yes. We match tone, colors, and voice. If you don’t have one, we can create a pragmatic kit during onboarding." />
          <FAQ q="What’s the usual turnaround?" a="Initial system build in ~7 days once assets are received; ongoing content weekly with daily micro‑iterations." />
          <FAQ q="Do we keep ownership of files and systems?" a="Yes—everything is yours. We favor local‑hosted, self‑owned systems to reduce recurring software costs." />
          <FAQ q="How do we measure success?" a="We define KPIs up‑front (hook‑rate, retention @5s, conversion velocity) and review weekly in a shared hub." />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-sm text-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} USATII MEDIA — build your audience organically.</p>
          <div className="flex items-center gap-3">
            <a href={BOOKING_URL} className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10">Book a call</a>
            <a href="/" className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10">Back to site</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] uppercase tracking-wide">
      {children}
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-white/60">{label}</div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-[radial-gradient(60%_80%_at_10%_0%,rgba(106, 0, 255, 0.18),transparent)]" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-white/70">{desc}</p>
    </div>
  );
}

function FAQ({ q, a }) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 open:bg-white/[0.06]">
      <summary className="flex cursor-pointer list-none items-center justify-between">
        <span className="text-base font-medium">{q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" className="transition group-open:rotate-45">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </summary>
      <p className="mt-3 text-sm text-white/75">{a}</p>
    </details>
  );
}

function Dot() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-70">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M8 5l10 7-10 7V5z" fill="currentColor" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" />
    </svg>
  );
}

function IconMuted() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 10v4h3l4 4V6l-4 4H5z" fill="currentColor" />
      <path d="M16 9l4 4M20 9l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconVolume() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 10v4h3l4 4V6l-4 4H5z" fill="currentColor" />
      <path d="M16 7a5 5 0 010 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconReplay() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 6V3L7 7l5 4V8a6 6 0 11-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
