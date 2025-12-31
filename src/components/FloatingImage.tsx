"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

interface FloatingImageProps {
  imageUrl: string | null;
  isVisible: boolean;
}

export default function FloatingImage({ imageUrl, isVisible }: FloatingImageProps) {
  const [mounted, setMounted] = useState(false);
  
  // MotionValues for smooth cursor following (no re-renders!)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for smooth, delayed following effect
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track mouse movement globally when visible
  useEffect(() => {
    if (!isVisible) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Offset the image to not cover the cursor (slightly to the right and down)
      mouseX.set(e.clientX + 20);
      mouseY.set(e.clientY + 20);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isVisible, mouseX, mouseY]);

  if (!mounted) return null;

  const ui = (
    <AnimatePresence>
      {isVisible && imageUrl && (
        <motion.div
          className="fixed pointer-events-none z-[99998]"
          style={{
            x,
            y,
            // Offset to prevent covering text
            translateX: "-10%",
            translateY: "-10%",
          }}
          initial={{ opacity: 0, scale: 0.6, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.6, rotate: 5 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            opacity: { duration: 0.2 },
          }}
        >
          {/* Image Container with Glass Effect */}
          <div
            className="relative w-48 md:w-64 aspect-[4/5] rounded-2xl overflow-hidden"
            style={{
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                0 0 80px rgba(100, 100, 100, 0.15)
              `,
            }}
          >
            {/* Gradient Border Glow */}
            <div 
              className="absolute -inset-[1px] rounded-2xl opacity-60"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
              }}
            />
            
            {/* Image */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Overlay Gradient */}
            <div 
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)",
              }}
            />

            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              style={{
                background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
              }}
            />
          </div>

          {/* Reflection/Shadow beneath */}
          <div 
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl"
            style={{ background: "rgba(0,0,0,0.3)" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(ui, document.body);
}

// ============================================
// Hook for easy integration into list components
// ============================================
interface UseHoverRevealReturn {
  hoveredImage: string | null;
  isHovering: boolean;
  handleMouseEnter: (imageUrl: string) => void;
  handleMouseLeave: () => void;
}

export function useHoverReveal(): UseHoverRevealReturn {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = (imageUrl: string) => {
    setHoveredImage(imageUrl);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Slight delay before clearing image for smoother exit animation
    setTimeout(() => {
      setHoveredImage(null);
    }, 200);
  };

  return {
    hoveredImage,
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
  };
}

















