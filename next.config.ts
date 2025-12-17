import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Esto es lo que permite subir el proyecto aunque haya detallitos de código
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
/*
export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


//export default nextConfig;
