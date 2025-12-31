// src/data/mockData.ts

import { events2020 } from './years/2020';
import { events2021 } from './years/2021';
import { events2022 } from './years/2022';
import { events2023 } from './years/2023';
import { events2024 } from './years/2024';
import { events2025 } from './years/2025';
// 2. 자동 데이터 (인스타) Import
import { insta2023 } from '@/data/years/insta-2023';
import { insta2024 } from '@/data/years/insta-2024';
import { insta2025 } from '@/data/years/insta-2025';
// ============ 기본 타입 정의 ============
export interface YearData {
  id: string;
  year: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  image: string;
  photoCount: number;
}

export interface Photo {
  id: string;
  year: number;
  month: number;
  day: number;
  src: string;
  alt: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  nameKo: string;
  icon: string;
  count: number;
}

export type MediaItem = {
  type: "youtube" | "twitter-image" | "image"|"tweet" | "instagram" | "video"; // ← instagram 추가
  url: string;
  thumbnail?: string;
  caption?: string;
  tweet_id?: string;
  video_id?: string;
  video_url?: string;
  video_thumbnail?: string;
  video_caption?: string;
  video_duration?: number;
  video_views?: number;
  video_likes?: number;
  video_comments?: number;
  video_shares?: number;
  video_embed_url?: string;
};

export type DateEvent = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  color: string;
  coverImage: string;     // ✅ 필수 (instagramAdapter에서 사용)
  description?: string;
  thumbnail?: string;
  year?: number;          // ✅ 추가 (instagramAdapter에서 사용)
  media: MediaItem[];     // ✅ 필수 배열
};


// ============ 연도별 데이터 (yearData) - 그대로 유지 ============
export const yearData: YearData[] = [
  { id: "2020", year: 2020, title: "debut", subtitle: "", description: "데뷔", color: "#6a0dad", image: "https://i.ifh.cc/JzBrrP.jpg", photoCount:0},
  { id: "2021", year: 2021, title: "NEXT LEVEL", subtitle: "", description: "", color: "#1a1a1a", image: "https://i.ifh.cc/pF0ZgB.jpg", photoCount:0},
  { id: "2022", year: 2022, title: "Girls", subtitle: "", description:"", color: "#FF69B4", image: "https://i.ifh.cc/nyZNta.jpg", photoCount:0},
  { id: "2023", year: 2023, title: "Spicy", subtitle: "", description: "", color: "#FF4444", image: "https://i.ifh.cc/HmmWgV.jpg", photoCount:0},
  { id: "2024", year: 2024, title: "Supernova Era", subtitle: "", description: "", color: "#22c55e", image: "https://i.ifh.cc/2gS2dd.jpg", photoCount:0},
  { id: "2025", year: 2025, title: "winter blue", subtitle: "", description: "새로운 시작", color: "#2B3138", image: "https://i.ifh.cc/HrSl6p.jpg", photoCount: 0}
];

// 호환성용 export
export const years = yearData.map((y) => ({
  year: y.year,
  description: y.description,
  photoCount: y.photoCount,
  coverImage: y.image,
}));


// ✅ 인스타 데이터 변환 함수
// ✅ instagramAdapter와 완벽 동기화된 transformToEvents
const transformToEvents = (instaData: readonly any[]): DateEvent[] => {
  const groups: { [date: string]: any[] } = {};
  
  instaData.forEach(item => {
    const eventDate = item.date || extractDateFromId(item.id || '');
    if (!eventDate) return;
    
    if (!groups[eventDate]) groups[eventDate] = [];
    groups[eventDate].push(item);
  });

  return Object.entries(groups).map(([date, photos]) => {
    const mainPhoto = photos[0];
    const customCaption = photos.find((p: any) => p.caption)?.caption;

        // ✅ 1. 모든 이미지 URL 수집 후 중복 제거
        const allImages = photos.flatMap((photo: any) => 
          photo.images?.map((img: any) => img.image).filter(Boolean) || []
        );
        
        // ✅ Set으로 중복 제거 → 고유 URL만
        const uniqueImages = Array.from(new Set(allImages)).filter(url => url);
        
        const imageCount = uniqueImages.length;
        // ✅ 첫 번째 고유 이미지 (coverImage)
        const firstImage = uniqueImages[0] || '';

    return {
      id: `${date}-instagram`,
      date: date,
      title: customCaption || "Instagram Update",
      subtitle: `${imageCount}장`,
      color: "#ef4444",               // ✅ instagramAdapter와 동일
      coverImage: firstImage,         // ✅ 안전성 보장
      year: parseInt(date.split('-')[0]),
      description: customCaption || `${date} 인스타그램 업데이트`,
      media: photos.flatMap((photo: any) => 
        photo.images?.map((img: any) => ({
          type: "image" as const,      // ✅ instagramAdapter와 동일
          url: img.image || '',
        })) || []
      ).filter(m => m.url),  // ✅ 빈 URL 제거
    };
  }).filter(event => event.coverImage);  // ✅ coverImage 필수 보장
};

// ✅ instagramAdapter에서 사용하는 함수 (공통)
const extractDateFromId = (id: string): string | null => {
  const match = id.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
};

// ✅ 🔥 같은 날짜의 이벤트들을 하나로 합치는 함수 (핵심!)
const mergeEventsByDate = (events: DateEvent[]): DateEvent[] => {
  const groups: { [date: string]: DateEvent } = {};
  
  events.forEach((event, index) => {
    const date = event.date;
    if (!date) return;
    
    if (!groups[date]) {
      // 첫 번째 이벤트를 기본으로 사용하고, uniqueId 부여
      groups[date] = {
        ...event,
        id: `${date}-${index}`, // 유니크 ID 생성
        media: [...(event.media || [])]
      };
    } else {
      // 같은 날짜의 이벤트가 이미 있으면 미디어를 합침
      const existingMedia = groups[date].media || [];
      const newMedia = event.media || [];
      groups[date].media = [...existingMedia, ...newMedia];
      
      // subtitle 업데이트 (합쳐진 미디어 개수 반영)
      const totalMediaCount = groups[date].media.length;
      groups[date].subtitle = `${totalMediaCount}장`;
      
      // coverImage가 없으면 새 이벤트의 것으로 설정
      if (!groups[date].coverImage && event.coverImage) {
        groups[date].coverImage = event.coverImage;
      }
      
      // description 합치기 (둘 다 있으면)
      if (event.description && event.description !== groups[date].description) {
        groups[date].description = groups[date].description 
          ? `${groups[date].description} / ${event.description}`
          : event.description;
      }
    }
  });
  
  return Object.values(groups);
};

// ============ 🔥 데이터 합치기 (수동 + 자동) ============
const rawEvents: DateEvent[] = [
  // 1. 기존 수동 데이터들
  ...events2020, ...events2021, ...events2022, 
  ...events2023, ...events2024, ...events2025,

  // 2. 인스타 데이터 변환해서 추가
  ...transformToEvents(insta2023),
  ...transformToEvents(insta2024),
  ...transformToEvents(insta2025),
];

// ✅ 같은 날짜 이벤트 합치기 + 최신 날짜 순으로 정렬
const allEvents = mergeEventsByDate(rawEvents);

// 최신 날짜 순으로 정렬해서 내보내기
export const detailedEvents: DateEvent[] = allEvents.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
// todayData는 detailedEvents에서 1월 1일 데이터만 뽑아서 쓰거나, 기존처럼 놔두셔도 됩니다
export const todayData: DateEvent[] = detailedEvents.filter(e => e.date.endsWith('01-01'));


// ============ 카테고리 데이터 ============
export const categories: Category[] = [
  {
    id: "daily",
    name: "Daily Life",
    nameKo: "일상",
    icon: "📷",
    count: 234,
  },
  {
    id: "stage",
    name: "Stage",
    nameKo: "무대",
    icon: "🎤",
    count: 156,
  },
  {
    id: "travel",
    name: "Travel",
    nameKo: "여행",
    icon: "✈️",
    count: 89,
  },
  {
    id: "celebration",
    name: "Celebrations",
    nameKo: "기념일",
    icon: "🎉",
    count: 56,
  },
  {
    id: "winter",
    name: "Winter Theme",
    nameKo: "겨울",
    icon: "❄️",
    count: 78,
  },
];

// ============ 샘플 포토 데이터 ============
export const photos: Photo[] = [
  {
    id: "1",
    year: 2024,
    month: 1,
    day: 1,
    src: "/images/sample-1.jpg",
    alt: "새해 첫 날",
    category: "daily",
  },
  {
    id: "2",
    year: 2024,
    month: 2,
    day: 14,
    src: "/images/sample-2.jpg",
    alt: "발렌타인 데이",
    category: "celebration",
  },
  {
    id: "3",
    year: 2023,
    month: 12,
    day: 25,
    src: "/images/sample-3.jpg",
    alt: "크리스마스",
    category: "winter",
  },
];

// ============ 유틸리티 함수들 ============

// "Today in History"용: 같은 월/일에 있었던 모든 연도 이벤트 조회
export const getEventsByDate = (month: number, day: number): DateEvent[] => {
  const monthStr = String(month).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  
  // 정규식으로 "YYYY-MM-DD" 패턴 완벽 매칭 (수정됨)
  const pattern = new RegExp(`^\\d{4}-${monthStr}-${dayStr}$`);
  
  return detailedEvents.filter((event) => event.date && pattern.test(event.date));
};


// 특정 연도의 이벤트 조회 (안전 장치 추가)
export const getEventsByYear = (year: number): DateEvent[] => {
  return detailedEvents.filter((event) => {
    if (!event.date) return false;
    // 날짜 형식이 .으로 시작하거나 -로 시작하거나 모두 체크
    return event.date.startsWith(String(year)) || event.date.startsWith(`${year}`);
  });
};

// 특정 연도와 월의 이벤트 조회
export const getEventsByYearAndMonth = (
  year: number,
  month: number
): DateEvent[] => {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const prefixDot = `${year}.${String(month).padStart(2, "0")}`; // 점(.) 형식도 지원
  
  return detailedEvents.filter((event) => 
    event.date && (event.date.startsWith(prefix) || event.date.startsWith(prefixDot))
  );
};

// 연도별 이벤트 수 계산
export const getEventCountByYear = (year: number): number => {
  return getEventsByYear(year).length;
};

// 연도별 월별 이벤트 수 계산 (안전한 파싱)
export const getEventCountByMonth = (
  year: number
): Record<number, number> => {
  const events = getEventsByYear(year);
  const counts: Record<number, number> = {};

  events.forEach((event) => {
    if (!event.date) return;
    const safeDate = event.date.replace(/\./g, "-");
    const parts = safeDate.split("-");
    const month = parts.length > 1 ? parseInt(parts[1], 10) : 0;
    
    if (!isNaN(month) && month > 0) {
      counts[month] = (counts[month] || 0) + 1;
    }
  });

  return counts;
};

// 연도 데이터 가져오기
export const getYearData = (year: number): YearData | undefined => {
  return yearData.find((y) => y.year === year);
};
