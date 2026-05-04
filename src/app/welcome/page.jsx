import Link from "next/link";
import { Button } from "@/components/ui/button";

const VIDEO_SRC = "/WELCOME.mp4";
const BOOKING_URL = "https://cal.com/usatii/onboarding";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
        <h1 className="text-sm font-black tracking-tight italic text-black sm:text-base">
          USATII MEDIA
        </h1>

        <div className="w-full text-left">
          <h2 className="text-3xl font-bold tracking-tight text-black">Say hello to the future of content marketing.</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-700">
            This video walks through our video editing packs and shows how our content marketing workflow runs
            end-to-end at Usatii Media. You will get a clear picture of how we plan, edit, and ship content
            in a repeatable system.
          </p>
        </div>

        <video
          src={VIDEO_SRC}
          controls
          playsInline
          className="w-full max-w-5xl h-auto aspect-video"
        >
          Sorry, your browser does not support the video tag.
        </video>

        <Link href={BOOKING_URL} target="_blank">
          <Button className="cursor-pointer rounded-lg bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black hover:scale-[1.02]">
            Book a call with me
          </Button>
        </Link>
      </div>
    </main>
  );
}
