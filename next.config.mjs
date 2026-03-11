import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
