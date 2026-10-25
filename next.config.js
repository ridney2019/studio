/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The link printed on the convention banner: /labs goes to the NEXO Labs site, straight to its application form.
  // Temporary (not permanent) so it can be pointed somewhere else later.
  async redirects() {
    return [
      { source: '/labs', destination: 'https://labs.nexotattooireland.com/#apply', permanent: false },
      { source: '/labs/:path*', destination: 'https://labs.nexotattooireland.com/#apply', permanent: false },
    ];
  },
};

module.exports = nextConfig;