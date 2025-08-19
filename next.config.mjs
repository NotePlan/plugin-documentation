import nextMDX from '@next/mdx'

import { recmaPlugins } from './src/mdx/recma.mjs'
import { rehypePlugins } from './src/mdx/rehype.mjs'
import { remarkPlugins } from './src/mdx/remark.mjs'
import withSearch from './src/mdx/search.mjs'

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
})

/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_EXPORT === 'true'
const nextConfig = {
  output: isExport ? 'export' : undefined,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
}

if (isExport) {
  nextConfig.basePath = '/templates/docs'
  nextConfig.assetPrefix = '/templates/docs'
}

export default withSearch(withMDX(nextConfig))
