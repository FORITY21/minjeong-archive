"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { DateEvent, getEventsByDate } from "@/data/mockData";
import { FaArrowLeft, FaCalendarAlt, FaPlay } from "react-icons/fa";


interface TodayViewProps {
  onBack: () => void;
  onSelectEvent: (event: DateEvent) => void;
}
// 🔥 YouTube ID 추출 함수 (여기에 직접 추가)
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
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

export default function TodayView({ onBack, onSelectEvent }: TodayViewProps) {
  // 같은 날짜(YYYY-MM-DD)의 이벤트들을 하나로 합치는 함수
  const today = useMemo(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    console.log(`📅 Loading ${month}-${day} events`);
    
    const events = getEventsByDate(month, day);
    
    // 같은 날짜(YYYY-MM-DD)로 그룹화
    const groups: { [date: string]: DateEvent } = {};
    
    events.forEach(event => {
      const date = event.date;
      
      if (!groups[date]) {
        // 첫 번째 이벤트를 기본으로 사용
        groups[date] = {
          ...event,
          media: [...(event.media || [])]
        };
      } else {
        // 같은 날짜의 이벤트가 이미 있으면 미디어만 추가하고 제목 업데이트
        const existingMedia = groups[date].media || [];
        const newMedia = event.media || [];
        groups[date].media = [...existingMedia, ...newMedia];
        
        // subtitle 업데이트 (합쳐진 미디어 개수 반영)
        const totalMediaCount = groups[date].media.length;
        groups[date].subtitle = `${totalMediaCount} media`;
      }
    });
    
    // 날짜순(최신순)으로 정렬해서 반환
    return Object.values(groups).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-pink-500/5" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-40">
        {/* ✅ 1️⃣ 뒤로가기 버튼 - 모든 화면 공통 */}
        <motion.button
          onClick={onBack}
          className="group flex items-center gap-3 text-white/70 hover:text-white transition-all duration-300 mb-8 p-2 -ml-2 z-50 backdrop-blur-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-11 h-11 rounded-xl bg-white/8 border border-white/20 flex items-center justify-center 
                          group-hover:bg-white/15 group-hover:border-white/40 group-hover:shadow-2xl 
                          transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-sky-500/25">
            <FaArrowLeft className="text-base" />
          </div>
          <span className="font-medium text-sm hidden sm:inline tracking-wide">돌아가기</span>
        </motion.button>

        {/* 2️⃣ 제목 */}
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-inter font-bold text-white mb-4 bg-gradient-to-r 
                     from-white to-gray-200/80 bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Today in <span className="text-sky-400 bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">History</span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-white/60 font-light mb-16 max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", year: "numeric" })} — 오늘 일어난 역사적 사건들
        </motion.p>
      </div>

      {/* 3️⃣ 콘텐츠 영역 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {today.length === 0 ? (
          /* 빈 데이터 화면 */
          <div className="flex flex-col items-center justify-center text-center text-white/50 min-h-[60vh] py-20">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <FaCalendarAlt className="text-7xl md:text-8xl mb-8 opacity-20 drop-shadow-2xl" />
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white/80 to-gray-300/60 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              오늘은 특별한 날
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {currentMonth}월 {currentDay}일에는<br/>
              <span className="text-white/80 font-semibold">기록된 특별한 이벤트가 없습니다.</span>
            </motion.p>
            
            <motion.p 
              className="mt-8 text-lg text-white/40 max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              내일은 어떤 일이 일어날까요?
            </motion.p>
          </div>
        ) : (
          /* 이벤트가 있을 때 */
          <div className="space-y-8">
            {today.map((event: DateEvent, index: number) => (
  <motion.div  // ✅ 1. motion.div 오픈
    key={`${event.date}-${event.id}-${index}`}
    className="relative group cursor-pointer"
    style={{
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(30px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    }}
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ 
      scale: 1.02, 
      boxShadow: `0 25px 80px ${event.color}25`,
      borderColor: `${event.color}20`
    }}
    onClick={() => onSelectEvent(event)}
  >
    {/* ✅ 2. 카드 컨테이너 div 오픈 */}
    <div className="flex flex-col lg:flex-row h-80 lg:h-72 rounded-3xl overflow-hidden relative">
      {/* 연도 배지 */}
      <div className="absolute top-6 left-6 z-20 px-5 py-3 rounded-2xl font-black text-2xl text-white shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${event.color}, ${event.color}dd)`, boxShadow: `0 10px 40px ${event.color}55` }}>
        {event.date.split("-")[0]}
      </div>

      {/* 이미지 영역 */}
      <div className="w-full lg:w-80 h-64 lg:h-full relative overflow-hidden flex-shrink-0">
  {(() => {
    const youtubeMedia = event.media?.find((m: any) => m.type === 'youtube');
    const videoId = youtubeMedia ? extractYouTubeId(youtubeMedia.url) : null;
    const thumbnailUrl = videoId 
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : event.coverImage || 'https://via.placeholder.com/800x450/1a1a1a/ffffff?text=No+Image';

    return (
      <>
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${thumbnailUrl})`, backgroundColor: '#1a1a1a' }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-black/80" />
        {/* ✅ 재생버튼 완전 제거 - 썸네일만 표시 */}
      </>
    );
  })()}
</div>

      {/* 콘텐츠 영역 */}
      <div className="p-8 flex-1 flex flex-col justify-between z-10">
        <div>
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 tracking-wide"
            style={{ background: `${event.color}15`, color: event.color, boxShadow: `0 4px 20px ${event.color}20` }}>
            {event.subtitle}
          </span>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-white/70 text-base leading-relaxed line-clamp-3 mb-6">
              {event.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-sm font-medium">
            {event.media?.length || 0}개 미디어
          </span>
          <motion.span 
            className="text-lg font-semibold flex items-center gap-2 group-hover:gap-4"
            style={{ color: event.color }}
            whileHover={{ x: 8 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            자세히 보기 →
          </motion.span>
        </div>
      </div>

      {/* 카드 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/30 to-black/90 rounded-3xl" />
    </div>  {/* ✅ 3. 카드 컨테이너 div 닫기 */}
  </motion.div>  // ✅ 4. motion.div 닫기
  ))}  {/* ← 1️⃣ map 닫기 */}
    </div> /* ← 2️⃣ space-y-8 div 닫기 */
  )}
</main> 
</div> /* ← 3️⃣ 전체 div 닫기 */
);
}