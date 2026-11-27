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
    dirs: ['src/app', 'src/providers', 'src/components/layout', 'src/components/landing', 'src/services', 'src/types', 'tests'],
  },
};

export default nextConfig;
