import pkg from './next-i18next.config.js';
const { i18n } = pkg;

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // Backend API Configuration
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
    
    // AI Services
    NEXT_PUBLIC_DOCUMENT_PROCESSING_URL: process.env.NEXT_PUBLIC_DOCUMENT_PROCESSING_URL || 'http://localhost:8001',
    NEXT_PUBLIC_LAND_SEGMENTATION_URL: process.env.NEXT_PUBLIC_LAND_SEGMENTATION_URL || 'http://localhost:8000',
    
    // App Configuration
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'DIGI FRA ATLAS',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    
    // Development flags
    NEXT_PUBLIC_DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE || 'true',
  },
}

export default nextConfig
