/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        source: '/documentation/:path*.pdf',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/VladUsatii/usatii-website/blob/main/public/**',
      },
    ],
  },
};

export default nextConfig;
