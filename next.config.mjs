/** @type {import('next').NextConfig} */
const nextConfig = {
  // The dev server is reached from the LAN address, which Next blocks by default.
  allowedDevOrigins: ["192.168.1.6"],
}

export default nextConfig
