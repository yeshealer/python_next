/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ETHERSCAN_API_KEY: 'KSFFW2XVAMJWKNDN23CN4RR2T5KV77YDMB'
  },
  optimizeFonts: true,
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } }
    ]
  }
}

module.exports = nextConfig
