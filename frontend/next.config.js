module.exports = {
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
        expiresIn: "7d",
      },
    },
  },
}
