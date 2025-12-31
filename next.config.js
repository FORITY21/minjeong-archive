/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,  // 빌드 시 ESLint 오류 무시
    },
    typescript: {
      ignoreBuildErrors: true,   // TypeScript 오류 무시
    },
  };
  
  module.exports = nextConfig;
  