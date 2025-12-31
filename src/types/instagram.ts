// src/types/instagram.ts
export interface InstagramImage {
    image: string;
    public_id: string;
    width: number;
    height: number;
  }
  
  export interface InstagramEvent {
    id: number;
    date: string;
    year: number;
    images: InstagramImage[];
    count: number;
    source: "cloudinary";
  }
  
  // 기존 DateEvent와 호환되는 어댑터 타입
  export interface AdaptedDateEvent {
    id: number;
    title: string;
    subtitle: string;
    description?: string;
    date: string;
    year: number;
    coverImage: string;
    media: Array<{
      type: 'image' | 'youtube';
      url: string;
    }>;
    color: string;
  }
  