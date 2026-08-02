export default function DemoGridWithLiveVideo() {
  return (
    <section className="w-full bg-white px-6 py-24 text-left lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-medium tracking-[-0.035em] text-neutral-950 sm:text-6xl">Content is king.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
          Selected short-form work from the content systems that shaped USATII.
        </p>

        <div className="mt-10 grid min-h-[440px] gap-8 border-t border-neutral-200 bg-white py-8 md:grid-cols-[320px_minmax(0,1fr)] md:items-end lg:min-h-[520px] lg:grid-cols-[360px_minmax(0,1fr)] lg:py-10">
          <div className="h-[400px] overflow-hidden bg-neutral-950 sm:h-[460px] lg:h-[520px]">
            <iframe
              src="https://player.vimeo.com/video/1111406856?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0"
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Chris Stocks short-form video preview"
            />
          </div>

          <div className="pb-2 md:max-w-md">
            <h3 className="text-3xl font-medium tracking-[-0.03em] text-neutral-950">Short-form, built to hold attention.</h3>
            <p className="mt-4 text-base leading-7 text-neutral-600">
              A concise example of the research, editing, packaging, and publishing systems behind our content work. Muted by default.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
