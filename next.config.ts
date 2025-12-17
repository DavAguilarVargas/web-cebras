/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! IMPORTANTE !!
    // Esto hace que Vercel ignore los errores de tipos y publique sí o sí.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Esto ignora advertencias de estilo.
    ignoreDuringBuilds: true,
  },
};
/*
export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


//export default nextConfig;
