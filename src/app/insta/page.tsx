"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";

export default function InstagramViewerPage() {
  const [url, setUrl] = useState("");
  const [postId, setPostId] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = url.match(/\/p\/([^/?]+)/);
    if (match) {
      setPostId(match[1]);
    }
  };

  // Instagram embed.js 스크립트가 로드된 후 실행
  const processInstagramEmbed = () => {
    if (typeof window !== "undefined" && window.instgrm) {
      window.instgrm.Embeds.process();
    }
  };

  // postId가 변경될 때마다 embed 재처리
  useEffect(() => {
    if (postId && scriptLoaded) {
      // 약간의 지연을 줘서 DOM이 완전히 렌더링되도록
      const timer = setTimeout(() => {
        processInstagramEmbed();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [postId, scriptLoaded]);

  return (
    <>
      {/* Instagram 공식 스크립트 로드 */}
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          setScriptLoaded(true);
          processInstagramEmbed();
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-zinc-900 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-white mb-2 text-center flex items-center justify-center gap-2">
            <span>🦋</span> 인스타 업로드
          </h1>
          <p className="text-white/60 text-center mb-8">2025년 7월 13일</p>

          <form onSubmit={handleSubmit} className="mb-8">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="인스타그램 링크 입력 (예: https://www.instagram.com/p/xxxxx/)"
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </form>

          {postId && (
            <div 
              ref={containerRef}
              className="flex justify-center"
            >
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={`https://www.instagram.com/p/${postId}/`}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: "0",
                  borderRadius: "3px",
                  boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                  margin: "1px",
                  maxWidth: "540px",
                  minWidth: "326px",
                  padding: "0",
                  width: "99%",
                }}
              >
                <div style={{ padding: "16px" }}>
                  <a
                    href={`https://www.instagram.com/p/${postId}/`}
                    style={{
                      background: "#FFFFFF",
                      lineHeight: "0",
                      padding: "0 0",
                      textAlign: "center",
                      textDecoration: "none",
                      width: "100%",
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram에서 이 게시물 보기
                  </a>
                </div>
              </blockquote>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// TypeScript 타입 선언
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
