import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 1. Ogg 폰트 설정 (영문 제목용)
const ogg = localFont({
  src: [
    {
      path: "../fonts/Ogg-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Ogg-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-ogg",
  display: "swap",
});

// 2. 마루 부리 설정 (한글 제목/본문 겸용)
const maruBuri = localFont({
  src: [
    {
      path: "../fonts/MaruBuri-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/MaruBuri-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/MaruBuri-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-maruburi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "민정이 앨범 | Minjeong Archive",
  description: "소중한 추억을 담은 민정이 앨범",
openGraph: {  // 🔥 이 부분만 추가!
  images: ['/og-image.png'],
  title: '민정이 앨범 💎',
},
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${ogg.variable} ${maruBuri.variable}`}>
      {/* bg-noise 클래스를 여기에 추가했습니다! */}
      <body className="font-serif antialiased bg-[#0a0a0f] text-white min-h-screen bg-noise overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

