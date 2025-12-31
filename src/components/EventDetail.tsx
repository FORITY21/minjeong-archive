"use client";
import { Tweet } from 'react-tweet'
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaPlay,
  FaImage,
  FaTwitter,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { DateEvent, MediaItem } from "@/data/mockData";

interface EventDetailProps {
  event: DateEvent;
  onBack: () => void;
}

// YouTube URL에서 비디오 ID 추출
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

// 미디어 아이템 컴포넌트
function MediaItemView({
  media,
  onClick,
}: {
  media: MediaItem;
  onClick: () => void;
}) {
  const videoId = media.type === "youtube" ? extractYouTubeId(media.url) : null;

  // 1️⃣ 비디오 파일 처리 (MP4 등)
  if (media.type === "video") {
    return (
      <div 
        className="w-full rounded-xl overflow-hidden bg-black/20 shadow-lg cursor-pointer group" 
        onClick={onClick}
      >
        <div className="relative">
          <video 
            className="w-full h-auto max-h-[500px] object-contain pointer-events-none"
            poster={media.thumbnail}
          >
            <source src={media.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl transform transition-transform duration-300 group-hover:scale-110">
              <FaPlay className="text-white text-xl ml-1" />
            </div>
          </div>
        </div>

        {media.caption && (
          <p className="text-white/50 text-sm mt-2 px-1 font-inter">{media.caption}</p>
        )}
      </div>
    );
  }

  // 2️⃣ 유튜브 처리
  if (media.type === "youtube" && videoId) {
    const thumbnailUrl = media.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return (
      <div
        className="w-full cursor-pointer group transform transition-transform duration-300 hover:scale-[1.02]"
        onClick={onClick}
      >
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-black/30">
          {/* ✅ backgroundImage → img 태그 */}
          <img
            src={thumbnailUrl}
            alt="YouTube thumbnail"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl transform transition-transform duration-300 group-hover:scale-110">
              <FaPlay className="text-white text-xl ml-1" />
            </div>
          </div>
        </div>
        {media.caption && <p className="text-sm text-white/60 mt-2 font-inter">{media.caption}</p>}
      </div>
    );
  }

  // 3️⃣ 인스타그램 처리
  if (media.type === "instagram") {
    return (
      <div 
        className="w-full cursor-pointer group transform transition-transform duration-300 hover:scale-[1.02]"
        onClick={onClick}
      >
        <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-black/30">
          {/* ✅ backgroundImage → img 태그 */}
          <img 
            src={media.thumbnail || media.url}
            alt="Instagram"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          <img 
            src="/icon/Instagram_icon.png" 
            alt="Instagram" 
            className="absolute top-3 right-3 w-8 h-8 object-contain drop-shadow-md cursor-pointer hover:scale-110 transition-transform"
          />
        </div>
        {media.caption && <p className="text-sm text-white/60 mt-2 font-inter">{media.caption}</p>}
      </div>
    );
  }

  // 4️⃣ 트윗 처리
  if (media.type === "tweet" && media.tweet_id) {
    return (
      <div 
        className="w-full flex justify-center py-4 bg-white/5 rounded-xl border border-white/10 relative group cursor-pointer"
        onClick={onClick}
      >
        <div className="absolute inset-0 z-10 bg-transparent" />
        <div className="w-full max-w-[550px] px-4 pointer-events-none" data-theme="dark"> 
          <Tweet id={media.tweet_id} />
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
          <div className="bg-black/50 p-3 rounded-full text-white">
            🔍 크게 보기
          </div>
        </div>
      </div>
    );
  }

  // 5️⃣ 일반 이미지 처리
  if (!media.url) return null;

  return (
    <div
      className="w-full cursor-pointer group transform transition-transform duration-300 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg bg-black/30">
        {/* ✅ backgroundImage → img 태그 */}
        <img
          src={media.url}
          alt={media.caption || "Image"}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {media.type === "twitter-image" && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <FaTwitter className="text-white text-sm" />
          </div>
        )}
      </div>
      {media.caption && <p className="text-sm text-white/60 mt-2 font-inter">{media.caption}</p>}
    </div>
  );
}

// 전체화면 미디어 뷰어
function FullscreenViewer({
  media,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
}: {
  media: MediaItem;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const videoId = media.type === "youtube" ? extractYouTubeId(media.url) : null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.95)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <FaTimes />
      </button>

      {/* 카운터 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-inter">
        {currentIndex + 1} / {totalCount}
      </div>

      {/* 이전 버튼 */}
      {currentIndex > 0 && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <FaChevronLeft />
        </button>
      )}

      {/* 다음 버튼 */}
      {currentIndex < totalCount - 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <FaChevronRight />
        </button>
      )}

      {/* 미디어 콘텐츠 */}
      <div className="w-full max-w-5xl mx-4">
        {media.type === "video" ? (
          <video
            src={media.url}
            controls
            autoPlay
            className="max-w-full max-h-[85vh] w-auto h-auto rounded-xl shadow-2xl outline-none mx-auto block z-50 pointer-events-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <source src={media.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : 
        media.type === "youtube" && videoId ? (
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
              loading="lazy"
            />
          </div>
        ) : media.type === "tweet" && media.tweet_id ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-[550px] max-h-[90vh] overflow-y-auto rounded-xl custom-scrollbar pointer-events-auto">
              <div 
                data-theme="dark" 
                className="flex justify-center w-full" 
              >
                <Tweet id={media.tweet_id} />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative max-h-[85vh] flex items-center justify-center">
            <img
              src={media.url}
              alt={media.caption || "Media"}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        )}

        {/* 캡션 */}
        {media.caption && (
          <p className="text-center text-white/80 mt-4 font-inter">
            {media.caption}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function EventDetail({ event, onBack }: EventDetailProps) {
  const [fullscreenMedia, setFullscreenMedia] = useState<number | null>(null);

  // 안전한 미디어 배열
  const safeMedia = useMemo(() => {
    if (!event) return [];
    if (!event.media) return [];
    if (!Array.isArray(event.media)) return [];
    return event.media;
  }, [event]);

  // 이벤트 데이터 유효성 검사
  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-white/50 mb-4">이벤트 데이터가 없습니다.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            ← 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleOpenFullscreen = (index: number) => {
    setFullscreenMedia(index);
  };

  const handleCloseFullscreen = () => {
    setFullscreenMedia(null);
  };

  const handlePrev = () => {
    if (fullscreenMedia !== null && fullscreenMedia > 0) {
      setFullscreenMedia(fullscreenMedia - 1);
    }
  };

  const handleNext = () => {
    if (fullscreenMedia !== null && fullscreenMedia < safeMedia.length - 1) {
      setFullscreenMedia(fullscreenMedia + 1);
    }
  };

  // 날짜 포맷
  const formattedDate = useMemo(() => {
    if (!event.date) return "날짜 없음";
    const dateObj = new Date(event.date);
    if (isNaN(dateObj.getTime())) return event.date;
    return `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;
  }, [event.date]);

  // 미디어 통계
  const videoCount = safeMedia.filter((m) => m.type === "youtube").length;
  const imageCount = safeMedia.filter(
    (m) => m.type === "image" || m.type === "twitter-image"
  ).length;

  // 커버 이미지 결정
  const coverImage = useMemo(() => {
    if (event.coverImage) return event.coverImage;
    if (event.thumbnail) return event.thumbnail;
    
    const ytMedia = safeMedia.find((m) => m.type === "youtube");
    if (ytMedia) {
      if (ytMedia.thumbnail) return ytMedia.thumbnail;
      const vid = extractYouTubeId(ytMedia.url);
      if (vid) return `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`;
    }
    
    const imgMedia = safeMedia.find((m) => m.type === "image" || m.type === "twitter-image");
    if (imgMedia) return imgMedia.url;
    
    return "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop";
  }, [event.coverImage, event.thumbnail, safeMedia]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
      {/* 히어로 섹션 */}
      <div className="relative h-[40vh] md:h-[50vh]">
        {/* ✅ backgroundImage → img 태그 */}
        <img
          src={coverImage}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${event.color || "#6a0dad"}40 0%, rgba(15, 23, 42, 0.9) 70%, rgb(15, 23, 42) 100%)`,
          }}
        />

        {/* 뒤로가기 */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <FaArrowLeft className="text-sm" />
          <span className="font-inter text-sm">Back</span>
        </button>

        {/* 이벤트 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-inter mb-3"
              style={{ background: `${event.color || "#6a0dad"}40`, color: event.color || "#6a0dad" }}
            >
              {event.subtitle || "Event"}
            </div>

            <h1 className="text-3xl md:text-5xl font-inter font-bold text-white mb-2">
              {event.title || "Untitled Event"}
            </h1>

            <p className="text-white/60 font-inter text-sm md:text-base">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 설명 */}
        {event.description && (
          <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/80 font-inter leading-relaxed">
              {event.description}
            </p>
          </div>
        )}

        {/* 미디어 그리드 */}
        {safeMedia.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safeMedia.map((media, index) => (
              <motion.div
                key={`media-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <MediaItemView
                  media={media}
                  onClick={() => handleOpenFullscreen(index)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/50">
            <FaImage className="text-4xl mx-auto mb-4 opacity-30" />
            <p>등록된 미디어가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 전체화면 뷰어 */}
      <AnimatePresence>
        {fullscreenMedia !== null && safeMedia[fullscreenMedia] && (
          <FullscreenViewer
            media={safeMedia[fullscreenMedia]}
            currentIndex={fullscreenMedia}
            totalCount={safeMedia.length}
            onClose={handleCloseFullscreen}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
