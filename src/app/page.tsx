"use client";


import React from "react";  // 👈 새로 추가
import { useState, useCallback, useRef, useEffect } from "react";  // 👈 기존 그대로
import SplitChoice from "@/components/SplitChoice";
import YearCarousel from "@/components/YearCarousel";
import MonthSelector from "@/components/MonthSelector";
import EventDetail from "@/components/EventDetail";
import HeroSection from "@/components/HeroSection";
import FloatingMusicPlayer from "@/components/FloatingMusicPlayer";
import { DateEvent, todayData } from "@/data/mockData";
import TodayView from "@/components/TodayView";


type ViewState =
  | "intro"
  | "choice"
  | "today"
  | "history"
  | "timeline"
  | "event"
  | "today-event";


export default function Home({
  params,
  searchParams // 👈 이 두 줄 추가
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 👈 React.use 추가 (상단)
  const resolvedParams = React.use(params);
  const resolvedSearchParams = React.use(searchParams);
  const [viewState, setViewState] = useState<ViewState>("intro");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<DateEvent | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
 
  // 화면 전환 ref (스크롤 위치 초기화용)
  const mainRef = useRef<HTMLDivElement>(null);


  // 화면 전환 시 스크롤 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewState]);


  // ============ 화면 전환 헬퍼 (애니메이션 없이 즉시 전환) ============
  const transitionTo = useCallback((newState: ViewState, delay = 0) => {
    if (delay > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setViewState(newState);
        setIsTransitioning(false);
      }, delay);
    } else {
      setViewState(newState);
    }
  }, []);


  // ============ 네비게이션 핸들러 ============
  const handleStart = useCallback(() => {
    transitionTo("choice");
  }, [transitionTo]);


  const handleSelectToday = useCallback(() => {
    transitionTo("today");
  }, [transitionTo]);


  const handleSelectHistory = useCallback(() => {
    transitionTo("history");
  }, [transitionTo]);


  const handleYearSelect = useCallback((year: number) => {
    console.log("handleYearSelect called with year:", year);
    setSelectedYear(year);
    transitionTo("timeline");
  }, [transitionTo]);


  const handleEventSelect = useCallback((event: DateEvent) => {
    console.log("🎉 Page: handleEventSelect called!", event);
    setSelectedEvent(event);
    transitionTo("event");
  }, [transitionTo]);


  const handleTodayEventSelect = useCallback((event: DateEvent) => {
    console.log("🎉 Page: handleTodayEventSelect called!", event);
    setSelectedEvent(event);
    transitionTo("today-event");
  }, [transitionTo]);


  // ============ 뒤로가기 핸들러 ============
  const handleBackToIntro = useCallback(() => {
    setSelectedYear(null);
    setSelectedEvent(null);
    transitionTo("intro");
  }, [transitionTo]);


  const handleBackToChoice = useCallback(() => {
    setSelectedYear(null);
    setSelectedEvent(null);
    transitionTo("choice");
  }, [transitionTo]);


  const handleBackToHistory = useCallback(() => {
    setSelectedEvent(null);
    transitionTo("history");
  }, [transitionTo]);


  const handleBackToTimeline = useCallback(() => {
    setSelectedEvent(null);
    transitionTo("timeline");
  }, [transitionTo]);


  const handleBackToToday = useCallback(() => {
    setSelectedEvent(null);
    transitionTo("today");
  }, [transitionTo]);


  // ============ 현재 뷰 렌더링 ============
  const renderView = () => {
    // 전환 중이면 로딩 표시
    if (isTransitioning) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      );
    }


    switch (viewState) {
      case "intro":
        return <HeroSection onStart={handleStart} />;


      case "choice":
        return (
          <SplitChoice
            onSelectToday={handleSelectToday}
            onSelectYear={handleSelectHistory}
            onBack={handleBackToIntro}
          />
        );


      case "history":
        return (
          <YearCarousel
            onBack={handleBackToChoice}
            onSelectYear={handleYearSelect}
          />
        );


      case "timeline":
        if (!selectedYear) {
          // 연도가 없으면 history로 이동
          setTimeout(() => transitionTo("history"), 0);
          return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          );
        }
        return (
          <MonthSelector
            key={`timeline-${selectedYear}`}
            year={selectedYear}
            onSelectEvent={handleEventSelect}
            onBack={handleBackToHistory}
          />
        );


      case "today":
        return (
          <TodayView
            onBack={handleBackToChoice}
            onSelectEvent={handleTodayEventSelect}
          />
        );


      case "event":
        if (!selectedEvent) {
          // 이벤트가 없으면 timeline으로 이동
          setTimeout(() => transitionTo("timeline"), 0);
          return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          );
        }
        return (
          <EventDetail
            key={`event-${selectedEvent.id}`}
            event={selectedEvent}
            onBack={handleBackToTimeline}
          />
        );


      case "today-event":
        if (!selectedEvent) {
          setTimeout(() => transitionTo("today"), 0);
          return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          );
        }
        return (
          <EventDetail
            key={`today-event-${selectedEvent.id}`}
            event={selectedEvent}
            onBack={handleBackToToday}
          />
        );


      default:
        return null;
    }
  };


  // ============ 메인 렌더링 ============
  return (
    <div ref={mainRef} className="relative">
      {renderView()}


      {/* 뮤직 플레이어: intro 제외 모든 화면에서 표시 */}
      {viewState !== "intro" && viewState !== "choice" && !isTransitioning && (
  <div className="fixed bottom-[max(env(safe-area-inset-bottom,1.5rem),1.5rem)] left-4 right-4 z-[1000] lg:static lg:z-auto translate-z-0 will-change-transform">
    <FloatingMusicPlayer />
  </div>
)}
</div>
);
}