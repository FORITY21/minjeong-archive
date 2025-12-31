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

// ✅ 6곡 데이터 (확인됨)
const trackList: Track[] = [
  {
    id: "1",
    title: "drama",
    artist: "aespa",
    album: "Drama - The 4th Mini Album",
    duration: "3:24",
    coverImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    audioSrc: "/music/drama.mp4",
  },
  {
    id: "2",
    title: "spicy",
    artist: "aespa",
    album: "MY WORLD - The 3rd Mini Album",
    duration: "3:18",
    coverImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop",
    audioSrc: "/music/spicy.mp4",
  },
  {
    id: "3",
    title: "thirsty",
    artist: "aespa",
    album: "Drama - The 4th Mini Album",
    duration: "3:13",
    coverImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=100&h=100&fit=crop",
    audioSrc: "/music/thirsty.mp4",
  },
  {
    id: "4",
    title: "welcome",
    artist: "aespa",
    album: "MY WORLD - The 3rd Mini Album",
    duration: "3:17",
    coverImage:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=100&h=100&fit=crop",
    audioSrc: "/music/welcome.mp4",
  },
  {
    id: "5",
    title: "supernova",
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
  },
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
  const [userInteracted, setUserInteracted] = useState(false); // 🔥 사용자 상호작용 상태

  const currentTrack = trackList[currentTrackIndex];

  // 🎵 디버그 로그 (배포 후 F12 콘솔에서 확인)
  console.log('🎵 Total tracks:', trackList.length); // 6
  console.log('🎵 Current:', currentTrack.title, 'Index:', currentTrackIndex);

  // 시간 핸들러들
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setDuration((e.target as HTMLAudioElement).duration || 0);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setCurrentTime((e.target as HTMLAudioElement).currentTime || 0);
  };

  const handleEnded = () => {
    // 🔥 6곡 모두 순환 확실히!
    setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
    setIsPlaying(true);
  };

  // 🔥 1. 사용자 클릭으로 autoplay 허용 (배포 사이트 필수)
  useEffect(() => {
    const enableAutoplay = () => {
      console.log('🎵 User clicked! Autoplay enabled');
      setUserInteracted(true);
      setIsPlaying(true); // 첫 곡 자동 재생
    };

    // 페이지 어디든 클릭하면 재생 시작
    document.addEventListener('click', enableAutoplay, { once: true });
    return () => document.removeEventListener('click', enableAutoplay);
  }, []);

  // Portal 렌더링 안전장치
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
      setCurrentTrackIndex((prev) => (prev + 1) % trackList.length);
      setIsPlaying(true);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // 트랙 바뀔 때 초기화
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

  // 재생 상태 반영 (사용자 상호작용 후에만)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !userInteracted) return;

    if (!isPlaying) {
      audio.pause();
      return;
    }

    audio.play().catch((e) => {
      console.log('Autoplay failed:', e);
      setIsPlaying(false);
    });
  }, [isPlaying, currentTrackIndex, userInteracted]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const playNext = useCallback(() => {
    // 🔥 trackList.length 확실히 사용 (6곡 모두!)
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

  if (!mounted) return null;

  const ui = (
    <div style={{ 
      position: "absolute", 
      left: "-9999px", 
      width: 0, 
      height: 0,
      opacity: 0 
    }}>
      {/* 🔥 숨김 오디오 (기능만 유지) */}
      <audio
        ref={audioRef}
        key={currentTrack.id}
        src={currentTrack.audioSrc}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );

  return createPortal(ui, document.body);
}