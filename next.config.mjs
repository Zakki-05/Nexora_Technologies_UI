/** @type {import('next').NextConfig} */
const isMobileBuild = process.env.NEXT_PUBLIC_MOBILE_BUILD === 'true';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['tsx', 'ts'],
  output: isMobileBuild ? 'export' : undefined,
  images: {
    unoptimized: isMobileBuild,
  },
  eslint: {
    dirs: ['src/app', 'src/providers', 'src/components/layout', 'src/components/landing', 'src/components/shared', 'src/services', 'src/types', 'tests'],
  },
  ...(isMobileBuild
    ? {}
    : {
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' },
                { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
              ],
            },
            {
              source: '/(admin|employee)/:path*',
              headers: [
                { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
                { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
