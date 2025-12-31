"use client";

import { motion } from "framer-motion";
import { FaArrowLeft, FaPlay, FaImage, FaTwitter } from "react-icons/fa";
import { DateEvent } from "@/data/mockData";

interface DateSelectorProps {
  year: number;
  month: number;
  events: DateEvent[];
  onSelectEvent: (event: DateEvent) => void;
  onBack: () => void;
}

// 월 이름
const monthNames: Record<number, string> = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export default function DateSelector({
  year,
  month,
  events,
  onSelectEvent,
  onBack,
}: DateSelectorProps) {
  // 이벤트가 없는 경우
  const hasEvents = events.length > 0;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 헤더 */}
      <div className="max-w-4xl mx-auto mb-8">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          whileHover={{ x: -3 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaArrowLeft className="text-sm" />
          <span className="font-inter text-sm">Back to Months</span>
        </motion.button>

        <motion.div
          className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl md:text-4xl font-inter font-bold text-white">
            {year}년 {month}월
          </h1>
          <span className="text-white/40 font-inter text-sm md:text-base">
            {monthNames[month]}
          </span>
        </motion.div>
        <motion.p
          className="text-white/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {hasEvents
            ? `${events.length}개의 이벤트`
            : "이 달에는 등록된 이벤트가 없습니다"}
        </motion.p>
      </div>

      {/* 이벤트 목록 */}
      <div className="max-w-4xl mx-auto">
        {hasEvents ? (
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: `0 0 30px ${event.color}40`,
                }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectEvent(event)}
              >
                {/* 컬러 액센트 */}
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ background: event.color }}
                />

                <div className="flex flex-col md:flex-row">
                  {/* 커버 이미지 */}
                  <div className="md:w-48 h-32 md:h-auto relative overflow-hidden flex-shrink-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                    {/* 날짜 배지 */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-lg text-sm font-inter font-bold text-white"
                        style={{ background: `${event.color}cc` }}
                      >
                        {event.date.split("-")[2]}일
                      </span>
                    </div>
                  </div>

                  {/* 콘텐츠 */}
                  <div className="p-4 md:p-6 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-pretendard font-bold text-white mb-1 group-hover:text-white transition-colors">
                          {event.title}
                        </h3>
                        <p
                          className="text-sm font-inter font-medium mb-2"
                          style={{ color: event.color }}
                        >
                          {event.subtitle}
                        </p>
                        {event.description && (
                          <p className="text-white/60 text-sm line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>

                      {/* 미디어 인디케이터 */}
                      <div className="flex flex-wrap gap-2">
                        {event.media.some((m) => m.type === "youtube") && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs">
                            <FaPlay className="text-[10px]" />
                            <span className="hidden md:inline">Video</span>
                          </span>
                        )}
                        {event.media.some((m) => m.type === "image") && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
                            <FaImage className="text-[10px]" />
                            <span className="hidden md:inline">Photo</span>
                          </span>
                        )}
                        {event.media.some((m) => m.type === "twitter-image") && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs">
                            <FaTwitter className="text-[10px]" />
                            <span className="hidden md:inline">Twitter</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 미디어 썸네일 */}
                    <div className="flex gap-2 mt-4">
                      {event.media.slice(0, 3).map((media, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden relative flex-shrink-0 border border-white/10"
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${
                                media.thumbnail || media.url
                              })`,
                            }}
                          />
                          {media.type === "youtube" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <FaPlay className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                      ))}
                      {event.media.length > 3 && (
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-white/10 flex items-center justify-center text-white/60 text-sm font-inter">
                          +{event.media.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 화살표 */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex">
                  <motion.span
                    className="text-white/30 text-2xl group-hover:text-white/60 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    →
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* 빈 상태 */
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-pretendard font-bold text-white/60 mb-2">
              아직 이벤트가 없어요
            </h3>
            <p className="text-white/40 text-sm">
              다른 달을 선택해 보세요
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
























