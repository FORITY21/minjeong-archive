import { insta2023 } from "@/data/years/insta-2023";
import { insta2024 } from "@/data/years/insta-2024";
import { insta2025 } from "@/data/years/insta-2025";
import type { AdaptedDateEvent } from '@/types/instagram';

// src/utils/instagramAdapter.ts (날짜 부분 문자열 매칭)
export function getEventsByInstagramDate(month: number, day: number): AdaptedDateEvent[] {
  const now = new Date();
  const targetDate = `${now.getFullYear()}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const allEvents: AdaptedDateEvent[] = [];

  const yearData2023 = (insta2023 as unknown) as any[];
  const yearData2024 =  (insta2024 as unknown) as any[];
  const yearData2025 = (insta2025 as unknown) as any[];

  // ✅ ID에서 날짜 추출하는 함수
  const extractDateFromId = (id: string): string | null => {
    // "2025-01-25-289" → "2025-01-25" 추출
    const match = id.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
  };

  // 2023
  yearData2023
    .filter((event: any) => {
      const eventDate = event.date || extractDateFromId(event.id);
      return eventDate?.startsWith(targetDate);
    })
    .forEach((event: any) => {
      const realDate = event.date || extractDateFromId(event.id) || targetDate;
      allEvents.push({
        id: event.id,
        title: '2023 Instagram',
        subtitle: `${event.count}장`,
        date: realDate,  // ✅ ID에서 추출한 날짜 또는 원본 date
        year: 2023,
        coverImage: event.images?.[0]?.image || '',
        media: event.images?.map((img: any) => ({
          type: 'image' as const,
          url: img.image,
        })) || [],
        color: '#ef4444',
        description: `Instagram에서 ${event.count || 0}장의 사진`,
      });
    });

  // 2024 (동일)
  yearData2024
    .filter((event: any) => {
      const eventDate = event.date || extractDateFromId(event.id);
      return eventDate?.startsWith(targetDate);
    })
    .forEach((event: any) => {
      const realDate = event.date || extractDateFromId(event.id) || targetDate;
      allEvents.push({
        id: event.id,
        title: '2024 Instagram',
        subtitle: `${event.count}장`,
        date: realDate,
        year: 2024,
        coverImage: event.images?.[0]?.image || '',
        media: event.images?.map((img: any) => ({
          type: 'image' as const,
          url: img.image,
        })) || [],
        color: '#ef4444',
        description: `Instagram에서 ${event.count || 0}장의 사진`,
      });
    });

  // 2025 (동일)
  yearData2025
    .filter((event: any) => {
      const eventDate = event.date || extractDateFromId(event.id);
      return eventDate?.startsWith(targetDate);
    })
    .forEach((event: any) => {
      const realDate = event.date || extractDateFromId(event.id) || targetDate;
      allEvents.push({
        id: event.id,
        title: '2025 Instagram',
        subtitle: `${event.count}장`,
        date: realDate,
        year: 2025,
        coverImage: event.images?.[0]?.image || '',
        media: event.images?.map((img: any) => ({
          type: 'image' as const,
          url: img.image,
        })) || [],
        color: '#ef4444',
        description: `Instagram에서 ${event.count || 0}장의 사진`,
      });
    });

  console.log(`📅 ${targetDate} 매칭: ${allEvents.length}개 이벤트`);
  return allEvents;
}