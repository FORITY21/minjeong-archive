"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaListUl,
  FaTimes,
  FaMusic,
} from "react-icons/fa";

// 트랙 타입 정의
interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverImage: string;
  audioSrc: string;
}

// 더미 트랙 데이터
const trackList: Track[] = [
  {
    id: "1",
    title: "Drama",
    artist: "aespa",
    album: "Drama - The 4th Mini Album",
    duration: "3:24",
    coverImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    audioSrc: "/music/drama.mp4",
  },
  {
    id: "2",
    title: "Spicy",
    artist: "aespa",
    album: "MY WORLD - The 3rd Mini Album",
    duration: "3:18",
    coverImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop",
    audioSrc: "/music/spicy.mp4",
  },
  {
    id: "3",
    title: "Thirsty",
    artist: "aespa",
    album: "Drama - The 4th Mini Album",
    duration: "3:13",
    coverImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=100&h=100&fit=crop",
    audioSrc: "/music/thirsty.mp4",
  },
  {
    id: "4",
    title: "Welcome To MY World",
    artist: "aespa",
    album: "MY WORLD - The 3rd Mini Album",
    duration: "3:17",
    coverImage:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=100&h=100&fit=crop",
    audioSrc: "/music/welcome.mp4",
  },
  {
    id: "5",
    title: "Supernova",
    artist: "aespa",
    album: "Armageddon - The 1st Album",
    duration: "3:10",
    coverImage:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=100&fit=crop",
    audioSrc: "/music/supernova.mp4",
  },
  {
    id: "6",
    title: "blue",
    artist: "winter",
    album: "SYNK : aeXIS LINE",
    duration: "3:32",
    coverImage:
      "https://i.namu.wiki/i/HPIyUzXhZTOZtR1iCtLDUedoGbbw3OVsSxXhpyloNjejqerMKNNdYLmwgare2WjO8a8iwHDKgypdjqLP0BZlcoa9yTNZvIkDPfQF4LhfdewlNKP6fHv-rtxzYLvbeNeUbN7coz05gGfS2dh0WJ45PQ?w=100&h=100&fit=crop.webp",
    audioSrc: "/music/blue.mp4",
  }

];

function formatTime(time: number) {
  if (!Number.isFinite(time) || time < 0) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function FloatingMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [mounted, setMounted] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  const [showPlaylist, setShowPlaylist] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = trackList[currentTrackIndex];
    // 기존 코드를 지우고 아래처럼 바꾸세요
     // 이 부분을 복사해서 기존 함수를 덮어쓰세요
     const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
      setDuration(e.currentTarget.duration || 0);
    };
  // 시간 업데이트 핸들러
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setCurrentTime(e.currentTarget.currentTime || 0);
  };

  // 트랙 종료 핸들러
  const handleEnded = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
    setIsPlaying(true);
  };
  
  // Portal 렌더링 안전장치 (SSR/CSR 차이 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 오디오 이벤트 바인딩
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      // 다음 트랙으로 이동 + 계속 재생 상태 유지
      setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
      setIsPlaying(true);
    };

   

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // 트랙 바뀔 때 currentTime/duration 초기화(시각적으로 안정)
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrackIndex]);

  // 볼륨 적용
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // 재생 상태 반영 (트랙 변경 후 자동 재생 포함)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.pause();
      return;
    }

    audio
      .play()
      .then(() => {
        // ok
      })
      .catch(() => {
        // 자동재생 정책 등으로 실패할 수 있음 → 상태 롤백
        setIsPlaying(false);
      });
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const playNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
    setIsPlaying(true);
  }, []);

  const playPrev = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + trackList.length) % trackList.length);
    setIsPlaying(true);
  }, []);

  const selectTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setShowPlaylist(false);
  }, []);

  const progress = useMemo(() => {
    if (duration <= 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);
// useEffect 추가 (자동 재생 강제)
useEffect(() => {
  const startMusic = async () => {
    const audio = audioRef.current;
    if (audio && !isPlaying) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        console.log('Autoplay blocked:', e);
      }
    }
  };

  // 1초 후 자동 시작
  const timeout = setTimeout(startMusic, 1000);
  return () => clearTimeout(timeout);
}, []);

  // 아직 클라이언트가 아니면(SSR) 렌더링하지 않음
  if (!mounted) return null;

  const ui = (
    <div style={{ 
      position: "absolute", 
      left: "-9999px",  // 화면 밖으로 이동
      width: 0, 
      height: 0,
      opacity: 0  // 완전 투명
    }}
  >
      <audio
        ref={audioRef}
        key={currentTrack.id}
        src={currentTrack.audioSrc}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
      />
    

      <motion.div
        className="fixed bottom-6 right-6"
        style={{ pointerEvents: "auto" }} // 플레이어 UI만 클릭 가능
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.35 }}
      >
        {/* 플레이리스트 패널 */}
        <AnimatePresence mode="wait" initial={false}>
          {showPlaylist && (
            <motion.div
              key="playlist-panel"
              className="absolute bottom-full right-0 mb-3 w-72 md:w-80 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
              }}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="font-inter font-semibold text-slate-800 text-sm">
                  Playlist
                </span>
                <button
                  onClick={() => setShowPlaylist(false)}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {trackList.map((track, index) => {
                  const active = index === currentTrackIndex;
                  return (
                    <button
                      key={track.id}
                      onClick={() => selectTrack(index)}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                        active ? "bg-slate-50" : ""
                      }`}
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${track.coverImage})` }}
                        />
                        {active && isPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <FaMusic className="text-white text-xs animate-pulse" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-left min-w-0">
                        <p
                          className={`font-maru text-sm truncate ${
                            active
                              ? "text-indigo-600 font-semibold"
                              : "text-slate-800"
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{track.artist}</p>
                      </div>

                      <span className="text-xs text-slate-500 font-sans">{track.duration}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 컴팩트 플레이어 */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* 프로그레스 바 */}
          <div className="h-1 bg-slate-100 relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <div className="p-3 flex items-center gap-3">
            {/* 앨범 아트 */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentTrack.coverImage})` }}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="flex gap-0.5 items-end h-3">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-0.5 bg-white rounded-full"
                        animate={{ height: ["30%", "100%", "30%"] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 트랙 정보 */}
            <div className="flex-1 min-w-0">
              <p className="font-maru font-bold text-slate-900 text-sm truncate">
                {currentTrack.title}
              </p>
              <p className="text-xs text-slate-900 font-medium tracking-wide truncate mt-0.5">{currentTrack.artist}</p>
            </div>

            {/* 컨트롤 */}
            <div className="flex items-center gap-1">
              <button
                onClick={playPrev}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              >
                <FaStepBackward className="text-xs" />
              </button>

              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors"
              >
                {isPlaying ? (
                  <FaPause className="text-sm" />
                ) : (
                  <FaPlay className="text-sm ml-0.5" />
                )}
              </button>

              <button
                onClick={playNext}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              >
                <FaStepForward className="text-xs" />
              </button>

              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
              >
                {isMuted ? (
                  <FaVolumeMute className="text-sm" />
                ) : (
                  <FaVolumeUp className="text-sm" />
                )}
              </button>

              <button
                onClick={() => setShowPlaylist((prev) => !prev)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  showPlaylist
                    ? "bg-indigo-100 text-indigo-600"
                    : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                <FaListUl className="text-sm" />
              </button>
            </div>
          </div>

          <div className="px-3 pb-2 flex justify-between text-xs text-slate-500 font-sans font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(ui, document.body);
}

















