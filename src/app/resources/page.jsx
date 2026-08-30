import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import ResourcesExplorer from "./resources-explorer";
import { softwareCapabilities } from "@/lib/software-capabilities";

export const metadata = { title: "Custom Software Capabilities", description: "Explore the operational software features and systems Usatii can design and build.", alternates: { canonical: "/resources" } };

export default function ResourcesPage() {
  const publicCapabilities = softwareCapabilities.map(({ builtIn: _builtIn, ...feature }) => feature);
  return <div className="min-h-screen bg-white text-neutral-950"><Header /><main><section className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-16 sm:px-7 lg:pb-36 lg:pt-24"><h1 className="max-w-5xl text-5xl font-medium leading-[0.96] tracking-[-0.055em] sm:text-7xl">Software we know how to build</h1><p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">A catalog of features that we&apos;ve built and have used on the field, across web, cloud, and native mobile platforms. Select a feature to inspect its architecture.</p><ResourcesExplorer features={publicCapabilities} /></section></main><Footer /></div>;
}
