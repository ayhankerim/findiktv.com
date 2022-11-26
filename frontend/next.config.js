/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.STRAPI_API_URL}/uploads/:path*`,
      },
      {
        source: "/api/views/:path*",
        destination: "/api/views/:path*",
      },
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      {
        source: "/api/:path*",
        destination: `${process.env.STRAPI_API_URL}/api/:path*`,
      },
    ]
  },
  i18n: {
    locales: ["en", "tr"],
    defaultLocale: "tr",
  },
  swcMinify: true,
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "30d",
      },
    },
  },
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin', 'latin-ext'] } },
    ],
  },
}

module.exports = nextConfig
