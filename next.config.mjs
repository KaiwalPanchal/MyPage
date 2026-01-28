const nextConfig = {
  output: 'export',
  basePath: '/MyPage',
  assetPrefix: '/MyPage',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
