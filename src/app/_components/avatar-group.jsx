import Image from 'next/image';

export default function AvatarGroup({
  size = 48,      // px
  total = 5,      // how many faces
  overlap = true, // toggle spacing style
  className = '',
}) {
  // helper for RandomUser URLs – alternates male / female for variety
  const src = (idx) =>
    `https://randomuser.me/api/portraits/${idx % 2 ? 'women' : 'men'}/${10 +
      idx}.jpg`;

  return (
    <div
      className={`flex ${overlap ? '-space-x-3' : 'gap-3'} ${className}`}
      role="group"
      aria-label="User avatars"
    >
      {Array.from({ length: total }).map((_, i) => (
        <Image
          key={i}
          src={src(i)}
          alt={`User ${i + 1}`}
          width={size}
          height={size}
          className="rounded-full ring-2 ring-white object-cover bg-gray-200"
          unoptimized   // ⬅ skips Next.js optimisation (no Vercel CPU)
        />
      ))}
    </div>
  );
}
