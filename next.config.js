/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // Remove swcMinify as it's not recognized in Next.js 15
  // swcMinify: true,
  // Add transpilePackages for Stripe
  transpilePackages: ["stripe"],
  images: {
    domains: [
      "eubzvoodfjlurwjsrdfy.supabase.co",
      "images.unsplash.com",
      "i.imgur.com",
      "api.dicebear.com",
    ],
  },
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  nextConfig["experimental"] = {
    // NextJS 14.1.3 to 14.2.11:
    swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],
  };
}

module.exports = nextConfig;
