export const metadata = {
  title: 'Vladislav Usatii — Resume',
  description: 'Download Vladislav Usatii’s resume with an access password.',
  robots: { index: false, follow: false, nocache: true },
};

export default async function ResumePage({ searchParams }) {
  const params = await searchParams;
  return (
    <main className="min-h-screen bg-[#fafafa] px-6 py-16 text-neutral-950 sm:py-24">
      <div className="mx-auto max-w-lg">
        <a href="/" className="text-sm font-semibold tracking-tight">USATII MEDIA</a>
        <div className="mt-12 border-t border-neutral-300 pt-7">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Vladislav Usatii</h1>
          <p className="mt-3 text-neutral-600">Resume · PDF</p>
          <p className="mt-6 leading-relaxed text-neutral-700">Enter your access password to download my resume.</p>
          <form action="/resume/download" method="post" className="mt-6">
            <label htmlFor="password" className="block text-sm font-medium">Access password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={128}
              aria-describedby={params?.error ? 'password-error' : undefined}
              className="mt-2 block w-full border border-neutral-400 bg-white px-3 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black" />
            {params?.error && <p id="password-error" role="alert" className="mt-3 text-sm text-red-700">That password didn’t match. Please try again.</p>}
            <button type="submit" className="mt-4 w-full bg-neutral-950 px-5 py-3 font-medium text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">Download resume</button>
          </form>
          <p className="mt-6 text-sm text-neutral-600">Need access? <a className="underline underline-offset-4" href="mailto:vlad@usatii.com">vlad@usatii.com</a></p>
        </div>
      </div>
    </main>
  );
}
