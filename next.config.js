/** @type {import('next').NextConfig} */
const nextConfig = {
  // Both are used only inside the route handlers and pull in optional
  // requires that bundling would break.
  serverExternalPackages: ['mysql2', '@aws-sdk/client-s3'],
}

export default nextConfig
