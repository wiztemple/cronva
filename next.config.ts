import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma', 'node-cron'],
  outputFileTracingIncludes: {
    '/*': ['./node_modules/.prisma/client/**/*'],
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
  },
  async headers() {
    return [
      {
        // Allow embed iframe from any origin
        source: '/embed/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          { key: 'Content-Security-Policy', value: "frame-ancestors *" },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        // CORS for embed API
        source: '/api/embed/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        ],
      },
    ]
  },
}

export default nextConfig
