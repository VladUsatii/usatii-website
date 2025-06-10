import Link from 'next/link'
import React from 'react'

const linkedInSteps = ['Find the intersection between current events and the client niche. Pick one.', 'Use the LinkedIn Blueprint to format your post.', 'Generate Mermaid diagram. Use Figma to style company logo with it.', 'Ensure a subtle CTA injection after the post.', 'Schedule during the day.'];
const total = 100;
const increment = total / (linkedInSteps.length - 1); // Divide full circle by number of gaps


function Systems() {
  return (
    <div className="min-h-screen text-black p-5 flex flex-col items-center">
      {/* Brand */}
      <Link href="/"><h1 className="font-black text-center text-md text-black/80 hover:text-black/100">USATII MEDIA</h1></Link>

    <div className='flex flex-col max-w-[850px] w-full px-5 mt-10 gap-y-3'>
        <h1 className='text-3xl font-black '>Systems showcase.</h1>
        <p>Learn how content is made by platform.</p>
        <div className='my-10 border p-5 rounded-xl shadow-sm'>
            <h2 className='font-black text-2xl'>LinkedIn</h2>
            <p className='text-sm text-neutral-600'>How deliverables are created for every client - a simple formula that scales.</p>

            
           <div className="mt-6 flex flex-col gap-y-4">
                {linkedInSteps.map((step, index) => {
                    return (
                    <div key={index} className="flex items-center gap-x-4">
                        <b >{index + 1}</b>
                        <svg width="24" height="24" viewBox="0 0 36 36" className="w-12 h-12 text-blue-500">
                        <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="opacity-20"
                        />
                        <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray="100"
                            strokeDashoffset={total - increment * index}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                        />
                        </svg>
                        <span className="text-md font-medium"> {step}</span>
                    </div>
                    );
                })}
                </div>

        </div>
    </div>
    </div>
  )
}

export default Systems