const headers = require("./headers");
const next_config = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "bn", "ar", "fr"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },
  env: {
    APP_ENV: process.env.NODE_ENV,
    APP_SSL: process.env.NEXT_PUBLIC_APP_SSL,
  },
};

module.exports = next_config;
