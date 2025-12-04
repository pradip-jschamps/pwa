const withPWA = require("next-pwa")({
  dest: "public",
  disable: true,
  swSrc: "public/firebase-messaging-sw.js"
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Force Webpack (required for next-pwa)
  webpack: (config, options) => {
    return config;
  },
};

module.exports = withPWA(nextConfig);

