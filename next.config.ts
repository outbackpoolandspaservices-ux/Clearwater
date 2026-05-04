import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/admin/database/setup": ["./drizzle/**/*"],
  },
};

export default nextConfig;
