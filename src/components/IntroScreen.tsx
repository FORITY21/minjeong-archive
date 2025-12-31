"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

interface IntroScreenProps {
  onStart: () => void;
}

// 1. Staggered Text 컴포넌트 (한 글자씩 등장 효과)
const StaggerText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,// 글자 간 간격
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 40,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.h1
      className="text-white font-inter font-bold text-center select-none flex flex-wrap justify-center gap-[0.1em]"
      style={{
        fontSize: "clamp(2.5rem, 8vw, 4rem)",
        letterSpacing: "0.05em",
        lineHeight: 1.4,
      }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const controls = useAnimation();

  // 눈 내리는 효과 (위치 고정)
  const snowParticles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: (i * 5) % 100,
      delay: (i * 0.25) % 5,
      duration: 8 + (i % 4),
    }));
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleStart = async () => {
    setIsExiting(true);
    // 퇴장 애니메이션: 흐려지면서 확대됨 (몰입감 UP)
    await controls.start({
      filter: "blur(20px)",
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.8, ease: "easeInOut" },
    });
    onStart();
  };

  return (
    <motion.div
      className="relative h-screen w-full overflow-hidden"
      animate={controls}
      style={{ filter: "blur(0px)" }}
    >
      {/* 1. 배경 (그라데이션) */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #1a1a1a 0%, #000000 100%)",
        }}
      />

      {/* 2. 배경 이미지 (투명도 조절) */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "url('https://i.ifh.cc/VVFhfF.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* 3. 오버레이 (중앙 강조) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%)",
        }}
      />

      {/* 4. 메인 콘텐츠 (중앙 정렬) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        
        {/* ✨ Staggered Text 적용 (0.5초 뒤 시작) */}
        <StaggerText text="KIM MINJEONG" delay={0.5} />

        {/* 서브타이틀 */}
        <motion.p
          className="text-white/70 font-inter text-center mt-6 select-none uppercase tracking-widest"
          style={{
            fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
            lineHeight: 1.4,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 1.5, // 제목이 거의 다 뜰 때쯤 등장
            ease: "easeOut",
          }}
        >
          24 Seasons Archive
        </motion.p>

        {/* 시작 버튼 */}
        <motion.button
          onClick={handleStart}
          disabled={isExiting}
          className="mt-16 font-inter font-medium text-white tracking-[0.2em]
                     border border-white/30 bg-white/5 backdrop-blur-sm cursor-pointer
                     transition-all duration-500 ease-out rounded-full
                     hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]
                     disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            width: "140px",
            height: "48px",
            fontSize: "0.85rem",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.8, // 가장 마지막에 부드럽게 등장
            ease: "easeOut",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ENTER
        </motion.button>
      </div>

      {/* 5. 눈 내리는 효과 (Client Side Only) */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {snowParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${particle.left}%`,
                top: "-5%",
              }}
              animate={{
                y: ["0vh", "110vh"],
                opacity: [0, 0.4, 0], // 반짝임
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
      )}
    </motion.div>
  );
}
