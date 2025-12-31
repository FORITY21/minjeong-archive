"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import { yearData, getEventCountByYear } from "@/data/mockData";
import { useState, useMemo, useCallback, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

interface YearCarouselProps {
  onBack?: () => void;
  onSelectYear?: (year: number) => void;
}

export default function YearCarousel({ onBack, onSelectYear }: YearCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [targetYear, setTargetYear] = useState<number | null>(null); // ✅ 추가
  
  const sortedYears = useMemo(() => [...yearData].sort((a, b) => a.year - b.year), []);

  const activeYear = sortedYears[activeIndex];
  const activeColor = activeYear?.color || "#6a0dad";

  // ✅ initialSlide 계산
  const initialSlideIndex = useMemo(() => {
    if (targetYear) {
      return sortedYears.findIndex(year => year.year === targetYear);
    }
    return 0;
  }, [targetYear, sortedYears]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  }, []);

  // ✅ 연도 선택 핸들러 수정
  const selectYear = useCallback((year: number) => {
    const index = sortedYears.findIndex(y => y.year === year);
    setTargetYear(year);
    setActiveIndex(index);
    onSelectYear?.(year);
  }, [sortedYears, onSelectYear]);

  // ✅ 컴포넌트 마운트시 초기화
  useEffect(() => {
    if (targetYear) {
      const index = sortedYears.findIndex(y => y.year === targetYear);
      setActiveIndex(index);
    }
  }, [targetYear, sortedYears]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f] max-w-6xl mx-auto lg:max-w-none w-full">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `radial-gradient(ellipse 80% 50% at 50% 100%, ${activeColor}15 0%, transparent 50%),
                         radial-gradient(ellipse 50% 30% at 20% 20%, ${activeColor}10 0%, transparent 40%)`,
          }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 lg:px-12 pt-6 lg:pt-10 pb-20 lg:pb-24">
        {/* 헤더 */}
        <header>
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-white/50 hover:text-white transition-colors mb-6 lg:mb-10"
          >
            <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <FaArrowLeft className="text-sm" />
            </span>
            <span className="font-inter text-sm lg:text-base">Back</span>
          </button>
        </header>

        {/* 타이틀 */}
        <div className="text-center mb-12 lg:mb-20 px-4">
          <h1 className="text-4xl lg:text-6xl font-inter font-bold text-white tracking-tight mb-3 lg:mb-6">
            Time <span style={{ color: activeColor }}>Machine</span>
          </h1>
          <p className="text-white/40 font-inter text-sm lg:text-base max-w-md mx-auto lg:max-w-lg">
            연도를 선택하면 그 해의 추억을 탐험할 수 있어요
          </p>
        </div>

        {/* 캐러셀 */}
        <div className="flex-1 flex items-center justify-center py-8 lg:py-12">
          <div className="w-full max-w-6xl">
          <Swiper
  modules={[EffectCoverflow, Navigation]}
  effect="coverflow"
  grabCursor={true}
  centeredSlides={true}
  slidesPerView="auto"
  spaceBetween={-80}
  initialSlide={initialSlideIndex}
  // 🎯 클릭 이벤트 허용 (PC 2021/2022 문제 해결)
  preventClicks={false}
  preventClicksPropagation={false}
  touchStartPreventDefault={false}
  // 🎯 PC 기본값 그대로 (수치 변경 없음)
  coverflowEffect={{
    rotate: 15,
    stretch: 0,
    depth: 200,
    modifier: 1.5,
    slideShadows: false,
  }}
  // 🎯 모바일만 변경 (두번째 사진 스타일)
  breakpoints={{
    // 🎯 모바일 중앙 정렬 + 두번째 사진 스타일
    320: {
      spaceBetween: -15,
      slidesPerView:  "auto",  // ✅ 1.1로 중앙 1개 + 약간 양옆
      centeredSlides: true,  // ✅ 중앙 고정
      coverflowEffect: {
        rotate: 20,
        stretch: 10,
        depth: 120,
        modifier: 1.5,
        slideShadows: false,
      }
    }
  }}
  navigation
  onSlideChange={handleSlideChange}
  className="year-swiper h-[450px] lg:h-[500px]"
>
  {sortedYears.map((year, index) => {
    const isActive = index === activeIndex;
    const eventCount = getEventCountByYear(year.year);

    return (
      <SwiperSlide
        key={year.year}
        className="!w-[90vw] !h-[55vh] max-w-[420px] lg:!w-[420px] lg:!h-[500px]"
      >
        <div
          className={`
            relative rounded-3xl overflow-hidden transition-all duration-300 w-full h-full swiper-year-card
            ${isActive ? "swiper-active opacity-100 scale-105" : "opacity-50 scale-90"}
            /* 🎯 모바일만 추가 효과 */
            max-md:shadow-2xl max-md:${isActive ? 'ring-4 ring-current/20 shadow-[0_25px_50px_rgba(0,0,0,0.8)]' : ''}
          `}
          style={{ height: "clamp(350px, 50vh, 450px)" }}
        >
                      {/* 배경 이미지 */}
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${year.image})` }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(180deg, ${year.color}40 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.9) 100%)`,
                        }}
                      />
                      <div 
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ background: year.color, boxShadow: `0 0 20px ${year.color}` }}
                      />

                      {/* 콘텐츠 */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                        <div className="mb-auto">
                          <span
                            className="inline-block px-3 py-1 lg:px-4 lg:py-1.5 rounded-full text-xs lg:text-sm font-inter"
                            style={{ background: `${year.color}30`, color: year.color }}
                          >
                            {eventCount} Events
                          </span>
                        </div>

                        <h2
                          className="text-5xl lg:text-7xl font-inter font-black text-white mb-2 lg:mb-4 tracking-tighter"
                          style={{ textShadow: `0 0 40px ${year.color}60` }}
                        >
                          {year.year}
                        </h2>
                        <p className="text-base lg:text-lg font-inter font-semibold mb-1 lg:mb-2" style={{ color: year.color }}>
                          {year.title}
                        </p>
                        <p className="text-white/50 text-sm font-inter mb-4 lg:mb-6">{year.subtitle}</p>

                        {/* Explore 버튼 */}
                        {isActive && (
                          <button
                            type="button"
                            className="flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-full font-inter text-sm lg:text-base font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation min-h-[48px] relative z-50 cursor-pointer"
                            style={{
                              background: `${year.color}`,
                              boxShadow: `0 4px 20px ${year.color}60`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              selectYear(year.year);
                            }}
                            onPointerUp={(e) => {
                              e.stopPropagation();
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <FaPlay className="text-sm lg:text-base" />
                            <span>Explore {year.year}</span>
                          </button>
                        )}
                      </div>

                      {/* 글로우 효과 */}
                      {isActive && (
                        <div
                          className="absolute inset-0 pointer-events-none rounded-3xl"
                          style={{
                            boxShadow: `0 0 60px ${year.color}30, inset 0 0 60px ${year.color}10`,
                          }}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>

        {/* 연도 인디케이터 */}
        <div className="pb-24 lg:pb-32 px-4 flex justify-center">
          <div className="flex items-center gap-4 lg:gap-6">
            {sortedYears.map((year, index) => (
              <button
                key={year.year}
                type="button"
                className="flex flex-col items-center gap-1 transition-all duration-200 p-2 relative z-50 cursor-pointer"
                style={{ 
                  transform: index === activeIndex ? "scale(1.2)" : "scale(1)", 
                  opacity: index === activeIndex ? 1 : 0.4 
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  selectYear(year.year);
                }}
              >
                <div
                  className="w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all"
                  style={{
                    background: index === activeIndex ? year.color : "rgba(255,255,255,0.3)",
                    boxShadow: index === activeIndex ? `0 0 15px ${year.color}` : "none",
                  }}
                />
                <span className="text-xs lg:text-sm font-inter mt-1" style={{ color: index === activeIndex ? year.color : "rgba(255,255,255,0.4)" }}>
                  {year.year}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 스타일 */}
      <style jsx global>{`
        /* 기존 스타일 그대로 유지 */
        .year-swiper {
          overflow: visible !important;
        }
        .year-swiper .swiper-slide {
          transition: all 0.4s ease;
        }
        /* 🎯 PC에서 비활성 슬라이드 클릭 방지 (2021/2022 문제 해결) */
        @media (min-width: 769px) {
          .year-swiper .swiper-slide:not(.swiper-slide-active) .swiper-year-card {
            pointer-events: none;
          }
          .year-swiper .swiper-slide.swiper-slide-active .swiper-year-card {
            pointer-events: auto;
          }
          .year-swiper .swiper-slide.swiper-slide-active {
            z-index: 10 !important;
          }
        }
        .year-swiper .swiper-button-next,
        .year-swiper .swiper-button-prev {
          width: 44px !important;
          height: 44px !important;
          background: rgba(255,255,255,0.05) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          border-radius: 50% !important;
          color: rgba(255,255,255,0.7) !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
          margin-top: -22px !important;
        }
        .year-swiper .swiper-button-next:hover,
        .year-swiper .swiper-button-prev:hover {
          background: rgba(255,255,255,0.15) !important;
          color: white !important;
          transform: scale(1.1) !important;
        }
        .year-swiper .swiper-button-next::after,
        .year-swiper .swiper-button-prev::after {
          font-size: 14px !important;
          font-weight: 300 !important;
        }
        @media (max-width: 768px) {
          .year-swiper .swiper-button-next,
          .year-swiper .swiper-button-prev {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
