"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { FaPlay } from "react-icons/fa";

interface HeroSectionProps {
  onStart: () => void;
}

// Staggered Text Reveal Component
const StaggeredText = ({ 
  text, 
  className, 
  delay = 0,
  staggerDelay = 0.03,
  gradient = "linear-gradient(135deg, #E8E8E8 0%, #A8A8A8 25%, #F5F5F5 50%, #B8B8B8 75%, #D0D0D0 100%)",
}: { 
  text: string; 
  className?: string;
  delay?: number;
  staggerDelay?: number;
  gradient?: string;
}) => {
  const letters = text.split("");
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      rotateX: -90,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className || ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ perspective: "1000px" }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
          style={{ 
            transformStyle: "preserve-3d",
            display: letter === " " ? "inline" : "inline-block",
            background: gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Word-by-word Staggered Reveal
const StaggeredWords = ({ 
  text, 
  className,
  delay = 0,
}: { 
  text: string; 
  className?: string;
  delay?: number;
}) => {
  const words = text.split(" ");
  
  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.6,
            delay: delay + index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export default function HeroSection({ onStart }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Mouse tracking for Aurora spotlight
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Scroll-based animations
  const { scrollY } = useScroll();
  
  // Split text animation on scroll
  const winterX = useTransform(scrollY, [0, 300], [0, -200]);
  const archiveX = useTransform(scrollY, [0, 300], [0, 200]);
  const contentOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const bgScale = useTransform(scrollY, [0, 300], [1.1, 1]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Track mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    }
  };

  // Particle type definition
  type Particle = {
    id: number;
    size: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
  };
  
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* ========================================
          1. ATMOSPHERIC BACKGROUND
          Deep Charcoal to Slate Grey gradient with film grain
      ======================================== */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#1a1a2e] to-[#334155]" />

      {/* Film Grain Texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Aurora Spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(
            800px circle at ${smoothX.get() * 100}% ${smoothY.get() * 100}%,
            rgba(148, 163, 184, 0.15) 0%,
            rgba(100, 116, 139, 0.08) 30%,
            transparent 60%
          )`,
        }}
      />

      {/* Secondary Aurora glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse 100% 60% at 30% 20%, rgba(129, 140, 248, 0.06) 0%, transparent 50%), radial-gradient(ellipse 80% 40% at 70% 80%, rgba(244, 114, 182, 0.04) 0%, transparent 40%)",
            "radial-gradient(ellipse 100% 60% at 70% 30%, rgba(129, 140, 248, 0.06) 0%, transparent 50%), radial-gradient(ellipse 80% 40% at 30% 70%, rgba(244, 114, 182, 0.04) 0%, transparent 40%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      {/* ========================================
          2. BACKGROUND IMAGE LAYER
      ======================================== */}
      <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?w=1920&h=1080&fit=crop')`,
            filter: "grayscale(40%) contrast(1.1)",
          }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        {/* Vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, rgba(17, 17, 17, 0.7) 70%, rgba(17, 17, 17, 0.95) 100%)`,
          }}
        />
      </motion.div>

      {/* ========================================
          3. FLOATING METALLIC PARTICLES
      ======================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: `radial-gradient(circle, rgba(192, 192, 192, 0.6) 0%, rgba(148, 163, 184, 0.3) 100%)`,
              boxShadow: `0 0 ${particle.size * 2}px rgba(192, 192, 192, 0.3)`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ========================================
          4. MAIN TYPOGRAPHY WITH STAGGERED REVEAL
      ======================================== */}
         <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 lg:px-8"
        style={{ opacity: contentOpacity }}
      >
        {/* Top badge: 모바일에서 작게 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -30 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-4 md:mb-6 lg:mb-8"
        >
          <span
            className="px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2 text-xs md:text-sm lg:text-xs font-inter tracking-[0.2em] md:tracking-[0.3em] text-slate-400 uppercase"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <StaggeredWords text="aespa · Winter · 김민정" delay={0.5} />
          </span>
        </motion.div>

        {/* Main Title Container with Staggered Text Reveal */}
        <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto">
          {/* "WINTER" with letter-by-letter staggered reveal */}
          <motion.div style={{ x: winterX }} className="w-full">
            {isLoaded && (
              <h1
                className="font-inter italic font-light tracking-tight select-none text-center leading-none"
                style={{
                  // 모바일: 작게, PC: 크게 (기존 clamp 유지)
                  fontSize: "clamp(3.5rem, 12vw, 14rem)",
                  lineHeight: 0.9,
                  background: "linear-gradient(135deg, #E8E8E8 0%, #A8A8A8 25%, #F5F5F5 50%, #B8B8B8 75%, #D0D0D0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "0 0 80px rgba(255, 255, 255, 0.1)",
                }}
              >
                <StaggeredText text="WINTER" delay={0.8} staggerDelay={0.08} />
              </h1>
            )}
          </motion.div>

          {/* "ARCHIVE" with letter-by-letter staggered reveal */}
          <motion.div style={{ x: archiveX }} className="w-full">
            {isLoaded && (
              <h1
                className="font-inter font-black tracking-tighter select-none text-center -mt-2 md:-mt-4 lg:-mt-8"
                style={{
                  // 모바일: 작게, PC: 크게
                  fontSize: "clamp(3rem, 10vw, 10rem)",
                  lineHeight: 0.9,
                  background: "linear-gradient(180deg, #FFFFFF 0%, #94A3B8 40%, #64748B 70%, #475569 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 4px 30px rgba(0, 0, 0, 0.3))",
                }}
              >
                <StaggeredText text="ARCHIVE" delay={1.3} staggerDelay={0.06} />
              </h1>
            )}
          </motion.div>
        </div>

        {/* Subtitle with word-by-word reveal */}
        {/* Subtitle: 모바일에서 더 작고 짧게 */}
        <motion.p
          className="text-slate-500 font-inter text-xs md:text-sm lg:text-base mt-6 md:mt-8 text-center max-w-sm md:max-w-md lg:max-w-none tracking-wide px-4 lg:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          <StaggeredWords text="4 Seasons · A Cinematic Journey Through Time" delay={2} />
        </motion.p>

        {/* Decorative line: 모바일에서 작게 */}
        <motion.div
          className="flex items-center gap-2 md:gap-4 mt-6 md:mt-8 lg:mt-12"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0, scaleX: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <div className="h-px w-8 md:w-12 lg:w-16 md:w-24 bg-gradient-to-r from-transparent to-slate-600" />
          <motion.div
            className="w-1.5 h-1.5 md:w-2 md:h-2 lg:w-2 lg:h-2 rounded-full bg-slate-400"
            animate={{
              boxShadow: ["0 0 10px rgba(148, 163, 184, 0.5)", "0 0 20px rgba(148, 163, 184, 0.8)", "0 0 10px rgba(148, 163, 184, 0.5)"],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="h-px w-8 md:w-12 lg:w-16 md:w-24 bg-gradient-to-l from-transparent to-slate-600" />
        </motion.div>


        {/* ========================================
            5. FROSTED GLASS ENTER BUTTON
        ======================================== */}
           <motion.button
          onClick={onStart}
          className="mt-8 md:mt-12 lg:mt-16 group relative min-h-[48px] md:min-h-[52px] lg:min-h-[64px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 1, delay: 2.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ background: "rgba(148, 163, 184, 0.2)" }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Button body - Frosted Glass */}
          <div
            className="relative px-6 md:px-8 lg:px-10 py-3.5 md:py-4 lg:py-5 rounded-full flex items-center gap-2 md:gap-3 lg:gap-4 group-hover:border-white/30 transition-all duration-500 touch-manipulation active:scale-95"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            }}
          >
            <FaPlay className="text-xs md:text-sm lg:text-xs text-slate-400 group-hover:text-white transition-colors flex-shrink-0" />
            <span className="font-inter font-medium tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm lg:text-sm text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">
              ENTER
            </span>
            <motion.span
              className="text-slate-500 group-hover:text-white transition-colors flex-shrink-0 ml-1"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </div>
        </motion.button>
      </motion.div>

      {/* ========================================
          6. SCROLL INDICATOR
      ======================================== */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 3.5, duration: 1 }}
      >
        <span className="text-slate-600 text-xs font-inter tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-5 h-8 rounded-full border border-slate-700 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-slate-500"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-16 h-16 border-l border-t border-slate-800/50" />
      <div className="absolute top-6 right-6 w-16 h-16 border-r border-t border-slate-800/50" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-l border-b border-slate-800/50" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-r border-b border-slate-800/50" />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#111111] to-transparent pointer-events-none" />
    </div>
  );
}
