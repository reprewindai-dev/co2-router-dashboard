/** @type {import('next').NextConfig} */
const ECOBE_ENGINE_URL = process.env.ECOBE_API_URL || 'https://ecobe-engineclaude-production.up.railway.app'

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    ECOBE_API_URL: ECOBE_ENGINE_URL,
  },
}

module.exports = nextConfig
