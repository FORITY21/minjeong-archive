"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlay, FaCalendarAlt, FaImage } from "react-icons/fa";
import { DateEvent, getEventsByYear, getYearData } from "@/data/mockData";

interface MonthSelectorProps {
  year: number;
  onSelectEvent: (event: DateEvent) => void;
  onBack: () => void;
}

const monthNames: Record<number, string> = {
  1: "JANUARY", 2: "FEBRUARY", 3: "MARCH", 4: "APRIL",
  5: "MAY", 6: "JUNE", 7: "JULY", 8: "AUGUST",
  9: "SEPTEMBER", 10: "OCTOBER", 11: "NOVEMBER", 12: "DECEMBER",
};
const monthColors = [
  "#FFFFFF", // 1월: Birthday White (순백의 윈터)
  "#B8A6D9", // 2월: SYNK Purple (투어의 열기)
  "#FFD700", // 3월: Blonde Bob (금발 단발 변신)
  "#87CEEB", // 4월: Polo Blue (산뜻한 앰버서더 룩)
  "#FF69B4", // 5월: Festival Pink (대학 축제/봄)
  "#E0F7FA", // 6월: Icy Blue (청량한 여름 시작)
  "#C0C0C0", // 7월: Metallic Silver (Whiplash 테크웨어 무드)
  "#4169E1", // 8월: Marine Blue (한여름의 청량함)
  "#5D4037", // 9월: Ralph Lauren Brown (뉴욕 패션위크 가을 무드)
  "#DC143C", // 10월: Whiplash Red (강렬한 컴백/할로윈)
  "#0F172A", // 11월: Deep Navy (차분한 초겨울/시상식)
  "#FFFAFA", // 12월: Fanmeeting Snow (첫 팬미팅, 눈송이)
];
// 유튜브 ID 추출 헬퍼
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// 썸네일 URL 가져오기
function getThumbnailUrl(event: DateEvent): string {
  // 1. 유튜브 미디어가 있으면 유튜브 썸네일 우선
  const youtubeMedia = event.media?.find((m) => m.type === "youtube");
  if (youtubeMedia) {
    if (youtubeMedia.thumbnail) return youtubeMedia.thumbnail;
    const videoId = extractYouTubeId(youtubeMedia.url);
    if (videoId) return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  
  // 2. coverImage 사용
  if (event.coverImage) return event.coverImage;
  
  // 3. thumbnail 필드
  if (event.thumbnail) return event.thumbnail;
  
  // 4. 첫 번째 이미지 미디어
  const imageMedia = event.media?.find((m) => m.type === "image" || m.type === "twitter-image");
  if (imageMedia) return imageMedia.url;
  
  // 5. 기본 플레이스홀더
  return "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop";
}

// Timeline Event Card with Thumbnail
function TimelineEventCard({
  event,
  color,
  isEven,
  index,
  onClick,
}: {
  event: DateEvent;
  color: string;
  isEven: boolean;
  index: number;
  onClick: () => void;
}) {
  const dateObj = new Date(event.date);
  const day = isNaN(dateObj.getDate()) ? "--" : dateObj.getDate();
  const hasVideo = event.media?.some((m) => m.type === "youtube");
  const thumbnailUrl = getThumbnailUrl(event);

  return (
    <motion.div
      className={`relative flex flex-col md:flex-row items-center w-full ${
        isEven ? "md:flex-row-reverse" : ""
      } gap-4 md:gap-0 z-10`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/* 중앙 타임라인 마커 */}
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0a0a0f] border-2 border-white/20 z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* 빈 공간 (데스크톱) */}
      <div className="w-full md:w-1/2 hidden md:block" />

      {/* 이벤트 카드 */}
      <div className={`w-full md:w-1/2 pl-14 md:pl-0 pr-4 ${isEven ? "md:pr-12" : "md:pl-12"}`}>
        <div
          className="group relative cursor-pointer transform transition-transform duration-300 hover:scale-[1.02] hover:-translate-y-1"
          onClick={onClick}
        >
          {/* Card with Thumbnail */}
          <div
            className="relative overflow-hidden rounded-2xl transition-all duration-500"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            {/* 🖼️ 썸네일 영역 */}
            <div className="relative w-full aspect-video overflow-hidden">
              {/* 썸네일 이미지 */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${thumbnailUrl})` }}
              />
              
              {/* 그라데이션 오버레이 */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%)`,
                }}
              />

              {/* 비디오 아이콘 (유튜브가 있을 경우) */}
              {hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-xl">
                    <FaPlay className="text-white text-lg ml-1" />
                  </div>
                </div>
              )}

              {/* 상단 뱃지들 */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md"
                  style={{ background: `${color}90`, color: "white" }}
                >
                  <FaCalendarAlt className="text-[10px]" />
                  <span>{day}일</span>
                </div>
                {hasVideo && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-600/90 text-white text-xs backdrop-blur-md">
                    <FaPlay className="text-[8px]" />
                    <span>Video</span>
                  </div>
                )}
              </div>
            </div>

            {/* 텍스트 콘텐츠 */}
            <div className="p-4 md:p-5">
              {/* 타이틀 */}
              <h3 className="text-base md:text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-300 transition-colors duration-300">
                {event.title}
              </h3>

              {/* 서브타이틀 배지 */}
              {event.subtitle && (
                <span
                  className="inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider mb-2"
                  style={{ background: `${color}15`, color }}
                >
                  {event.subtitle}
                </span>
              )}

              {/* 설명 */}
              {event.description && (
                <p className="text-white/40 text-xs md:text-sm line-clamp-2 mb-3 leading-relaxed">
                  {event.description}
                </p>
              )}

              {/* 푸터 */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-white/30 text-xs flex items-center gap-1">
                  <FaImage className="text-[10px]" />
                  {event.media?.length || 0} media
                </span>
                <span
                  className="text-xs font-medium flex items-center gap-1"
                  style={{ color }}
                >
                  View Details
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div
            className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
            style={{
              background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`,
              filter: "blur(20px)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function MonthSelector({ year, onSelectEvent, onBack }: MonthSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const yearInfo = getYearData(year);
  const color = yearInfo?.color || "#6a0dad";

  const events = useMemo(() => getEventsByYear(year) || [], [year]);

  const eventsByMonth = useMemo(() => {
    const grouped: Record<number, DateEvent[]> = {};
    events.forEach((event) => {
      if (!event.date) return;
      const parts = event.date.split("-");
      const month = parts.length > 1 ? parseInt(parts[1], 10) : 0;
      if (month >= 1 && month <= 12) {
        if (!grouped[month]) grouped[month] = [];
        grouped[month].push(event);
      }
    });
    return grouped;
  }, [events]);

  const monthsWithEvents = useMemo(
    () => Object.keys(eventsByMonth).map(Number).sort((a, b) => a - b),
    [eventsByMonth]
  );

  // 컴포넌트 마운트 시 첫 월 선택 (한 번만 실행)
  useEffect(() => {
    if (!isInitialized && monthsWithEvents.length > 0) {
      setActiveMonth(monthsWithEvents[0]);
      setIsInitialized(true);
    }
  }, [monthsWithEvents, isInitialized]);

  // 이벤트 없음 화면
  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-white">
        <div className="text-6xl mb-6">📅</div>
        <h2 className="text-2xl font-bold mb-2">{year}년 이벤트 없음</h2>
        <p className="text-white/50 mb-6">이 연도에는 등록된 이벤트가 없습니다.</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          ← 돌아가기
        </button>
      </div>
    );
  }

  // 현재 선택된 월의 이벤트
  const currentEvents = activeMonth ? eventsByMonth[activeMonth] || [] : [];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0a0a0f] relative overflow-x-hidden"
    >
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 100% 50% at 50% 0%, ${color}10 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
        <div className="w-full max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            <span className="font-medium text-sm hidden sm:inline">Back</span>
          </button>
          <h1 className="text-base md:text-lg font-bold tracking-wider uppercase" style={{ color }}>
            {year} {yearInfo?.title}
          </h1>
          <div className="text-right text-xs text-white/40">
            <span className="text-white font-bold text-sm mr-1">{events.length}</span> Moments
          </div>
        </div>
      </header>

      {/* 월 네비게이션 */}
      {/* 월 네비게이션 */}
<nav className="sticky top-16 z-40 py-3 md:py-4 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent">
  <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar flex justify-start md:justify-center">
    <div className="inline-flex items-center bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
      {monthsWithEvents.map((month) => {
        const isActive = activeMonth === month;
        const colorForMonth = monthColors[month - 1]; // month는 1~12, 배열은 0~11

        return (
          <button
            key={month}
            onClick={() => setActiveMonth(month)}
            className="relative px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors duration-300 whitespace-nowrap outline-none"
            style={{
              color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="active-month-bg"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: `${colorForMonth}30` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                initial={false}
              />
            )}

            <span className="relative z-10 block">
              {monthNames[month]}
            </span>
          </button>
        );
      })}
    </div>
  </div>
</nav>


      {/* 메인 콘텐츠 (지그재그 타임라인) */}
      <main className="relative max-w-5xl mx-auto px-4 pb-32 min-h-[60vh]">
        {/* 중앙 타임라인 선 (모바일: 좌측 정렬) */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:-translate-x-1/2" />

        {/* 배경 월 텍스트 */}
        {activeMonth && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-[12vw] md:text-[8rem] font-bold text-white/[0.02] pointer-events-none select-none tracking-tighter whitespace-nowrap z-0">
            {monthNames[activeMonth]}
          </div>
        )}

        {/* 이벤트 카드들 */}
        {currentEvents.length > 0 ? (
          <div className="space-y-8 md:space-y-12 py-8 md:py-10">
            {currentEvents.map((event, index) => (
              <TimelineEventCard
                key={`${event.date}-${event.id}-${index}`}
                event={event}
                color={color}
                isEven={index % 2 === 0}
                index={index}
                onClick={() => {
                  console.log("Card clicked:", event.title, event);
                  onSelectEvent(event);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-white/50">
            이 월에는 표시할 이벤트가 없습니다.
          </div>
        )}
      </main>
    </div>
  );
}
