import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 여기가 핵심! layout.tsx에서 만든 변수(--font-ogg)를 연결합니다.
        serif: ["var(--font-ogg)", "var(--font-maruburi)", "serif"],
        
        // (선택) sans를 쓰면 마루부리가 나오게 하거나, 기본 고딕 유지
        sans: ["Pretendard", "sans-serif"], 
      },
    },
  },
  plugins: [],
};
export default config;







































