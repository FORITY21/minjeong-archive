"use client";

import { motion } from "framer-motion";
import { FaPlay, FaCalendarAlt, FaCamera } from "react-icons/fa";
import { DateEvent } from "@/data/mockData";

interface EventCardProps {
  event: DateEvent;
  color: string;
  onClick: () => void;
}

export default function EventCard({ event, color, onClick }: EventCardProps) {
  const hasVideo = event.media?.some((m) => m.type === "youtube");
  const imageCount = event.media?.length || 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, translateY: -5 }}
      onClick={() => {
        console.log("👆 EventCard Clicked!", event.title);
        onClick();
      }}
      className="group relative cursor-pointer w-full"
    >
      {/* 카드 컨테이너 */}
      <div className="overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300">
        
        {/* 썸네일 영역 */}
        <div className="relative aspect-video w-full overflow-hidden">
          {/* 그라데이션 배경 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent z-10" />
          
          {/* 썸네일 이미지 */}
          <img
            src={event.coverImage || event.thumbnail || '/placeholder-video.jpg'}
            alt={event.title || "Event thumbnail"}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 md:brightness-75 group-hover:brightness-90"
            loading="lazy"
            draggable={false}
          />

          {/* 비디오 오버레이 - 모바일/PC 통합 */}
          {hasVideo && (
            <div className="absolute inset-0 z-30 flex items-center justify-center opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-red-500/95 to-pink-500/95 p-3 md:p-4 rounded-full backdrop-blur-xl border-4 border-white/40 shadow-2xl flex items-center justify-center">
                <FaPlay className="text-white text-xl md:text-2xl ml-1.5 drop-shadow-2xl" />
              </div>
            </div>
          )}
        </div>

        {/* 날짜 배지 */}
        <div className="absolute top-3 left-3 z-20 px-2 py-1 rounded bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white flex items-center gap-1.5">
          <FaCalendarAlt />
          {event.date}
        </div>

        {/* 텍스트 영역 */}
        <div className="relative p-5">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          
          <div className="relative z-10">
            {/* 이미지 개수 배지 */}
            {imageCount > 0 && (
              <span
                className="inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-2 tracking-wider uppercase border border-white/10"
                style={{ backgroundColor: `${color}15`, color: color }}
              >
                {imageCount}장
              </span>
            )}

            <h3 
              className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors line-clamp-1"
              style={{
                textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)"
              }}
            >
              {event.title}
            </h3>
            
            <p 
              className="text-white/60 text-xs line-clamp-2 leading-relaxed mb-4"
              style={{
                textShadow: "0 1px 6px rgba(0,0,0,0.8)"
              }}
            >
              {event.description}
            </p>

            {/* 하단 정보 바 */}
            <div className="flex items-center justify-between text-xs text-white/30 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1">
                <FaCamera /> {imageCount}
              </div>
              <span className="group-hover:translate-x-1 transition-transform text-white/50">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
