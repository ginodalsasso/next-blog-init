/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    reactStrictMode: true,
};

module.exports = nextConfig;
