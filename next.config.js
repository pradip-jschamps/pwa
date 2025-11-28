// next.config.js (Alternative Fix)

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // 💡 Add this empty webpack config
    webpack: (config, options) => {
        // If you had any other custom webpack config, it would go here.
        // Even an empty one forces Next.js to use Webpack for the build.
        return config;
    },
};

module.exports = withPWA(nextConfig);