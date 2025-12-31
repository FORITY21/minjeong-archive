"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { FaCalendarAlt, FaImages, FaArrowLeft } from "react-icons/fa";

interface SplitChoiceProps {
  onSelectToday: () => void;
  onSelectYear: () => void;
  onBack?: () => void;
}

export default function SplitChoice({ onSelectToday, onSelectYear, onBack }: SplitChoiceProps) {
  const [selectedCard, setSelectedCard] = useState<"today" | "year" | null>(null);

  // 눈 파티클
  const snowParticles = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      id: i,
      left: (i * 2.5) % 100,
      size: 2 + (i % 3),
      delay: (i * 0.2) % 6,
      duration: 8 + (i % 6),
      drift: (i % 2 === 0 ? 1 : -1) * (15 + (i % 20)),
    }));
  }, []);

  const handleSelectToday = () => {
    setSelectedCard("today");
    onSelectToday();
  };

  const handleSelectYear = () => {
    setSelectedCard("year");
    onSelectYear();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />

      {/* 부드러운 그라데이션 오버레이 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-sky-100 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-rose-100 to-transparent" />
      </div>

      {/* 눈 파티클 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {snowParticles.map((particle) => (
          <motion.div
            key={`snow-${particle.id}`}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              width: particle.size,
              height: particle.size,
              background: "linear-gradient(135deg, rgba(148, 163, 184, 0.6), rgba(203, 213, 225, 0.4))",
            }}
            animate={{
              y: ["-5%", "105%"],
              x: [0, particle.drift, 0, -particle.drift * 0.5, 0],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Back 버튼 */}
      {onBack && (
        <motion.button
          onClick={onBack}
          className="absolute top-4 left-4 md:top-8 md:left-8 z-20 flex items-center gap-2 
                     text-slate-500 hover:text-slate-800 transition-colors text-sm md:text-base"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ x: -3 }}
        >
          <FaArrowLeft className="text-sm" />
          <span className="font-inter">Back</span>
        </motion.button>
      )}

      {/* 카드 컨테이너 */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center 
                      gap-4 md:gap-8 px-4 md:px-8 w-full max-w-5xl">
        
        {/* Left Card - 오늘의 민정 */}
        <motion.div
          className="relative w-full md:w-1/2 h-[35vh] md:h-[55vh] rounded-2xl md:rounded-3xl 
                     cursor-pointer overflow-hidden backdrop-blur-sm"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(241,245,249,0.95))",
            boxShadow: "0 10px 40px rgba(14, 165, 233, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
            border: "1px solid rgba(14, 165, 233, 0.2)",
          }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: 1,
            scale: selectedCard === "today" ? 1.05 : selectedCard === "year" ? 0.95 : 1,
          }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={handleSelectToday}
          whileHover={{ 
            scale: selectedCard ? undefined : 1.02,
            boxShadow: "0 20px 60px rgba(14, 165, 233, 0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* 상단 액센트 라인 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-cyan-400" />

          {/* 콘텐츠 */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 md:p-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 
                              flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-sky-200">
                <FaCalendarAlt className="text-2xl md:text-4xl text-white" />
              </div>
            </motion.div>

            <motion.h2
              className="font-pretendard font-bold text-slate-800 text-center mb-2"
              style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              오늘의 민정
            </motion.h2>

            <motion.p
              className="text-slate-500 font-pretendard text-center text-xs md:text-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              같은 날짜, 다른 시간들
            </motion.p>
          </div>
        </motion.div>

        {/* Right Card - 연도별 탐험 */}
        <motion.div
          className="relative w-full md:w-1/2 h-[35vh] md:h-[55vh] rounded-2xl md:rounded-3xl 
                     cursor-pointer overflow-hidden backdrop-blur-sm"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(241,245,249,0.95))",
            boxShadow: "0 10px 40px rgba(236, 72, 153, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
            border: "1px solid rgba(236, 72, 153, 0.2)",
          }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: 1,
            scale: selectedCard === "year" ? 1.05 : selectedCard === "today" ? 0.95 : 1,
          }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={handleSelectYear}
          whileHover={{ 
            scale: selectedCard ? undefined : 1.02,
            boxShadow: "0 20px 60px rgba(236, 72, 153, 0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* 상단 액센트 라인 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-rose-400" />

          {/* 콘텐츠 */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 md:p-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 
                              flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-pink-200">
                <FaImages className="text-2xl md:text-4xl text-white" />
              </div>
            </motion.div>

            <motion.h2
              className="font-pretendard font-bold text-slate-800 text-center mb-2"
              style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              연도별 탐험
            </motion.h2>

            <motion.p
              className="text-slate-500 font-pretendard text-center text-xs md:text-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              2020 ~ 2025
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* 하단 힌트 */}
      <motion.p
        className="absolute bottom-4 md:bottom-8 text-slate-400 font-pretendard text-xs md:text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.8 }}
      >
        원하시는 여정을 선택하세요
      </motion.p>
    </div>
  );
}
