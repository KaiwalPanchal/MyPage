const nextConfig = {
  output: 'export',
  transpilePackages: ['remark-gfm', 'micromark-extension-gfm', 'micromark-extension-gfm-table', 'micromark-extension-gfm-autolink-literal', 'micromark-extension-gfm-footnote', 'micromark-extension-gfm-strikethrough', 'micromark-extension-gfm-tagfilter', 'micromark-extension-gfm-task-list-item', 'mdast-util-gfm', 'mdast-util-gfm-table', 'mdast-util-gfm-autolink-literal', 'mdast-util-gfm-footnote', 'mdast-util-gfm-strikethrough', 'mdast-util-gfm-task-list-item', 'ccount', 'mdast-util-find-and-replace', 'escape-string-regexp'],
  basePath: '/MyPage',
  assetPrefix: '/MyPage',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
