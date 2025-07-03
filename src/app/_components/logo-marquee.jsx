'use client'
import React from 'react';

export default function LogoMarquee({ images = [] }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex w-max animate-marquee">
        {[1, 2].map((_, groupIndex) => (
          <div key={groupIndex} className="flex gap-x-[100px] items-center opacity-50 whitespace-nowrap">
            {images.map((src, i) => {
              const isGamma = src === 'https://i.postimg.cc/3xdwqqdh/GAMMAIMAGE.png';
              const isSpectres = src === 'https://i.postimg.cc/YCZSBxWW/SPECTRESIMAGE.png';
              return (
                <img
                  key={`${groupIndex}-${i}`}
                  src={src}
                  alt=""
                  draggable="false"
                  className={`flex-shrink-0 filter grayscale w-auto ${
                    isGamma ? 'h-[105px]' : isSpectres ? 'h-[50px] mr-16' : 'h-[75px]'
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
