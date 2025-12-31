import { DateEvent } from '../mockData';

export const events2022: DateEvent[] = [
  {
    id: "2022-0101",
    date: "2022-01-01",
    title: "Growing Stronger",
    subtitle: "Savage Era",
    color: "#58a6ff",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    media: [
      {
        type: "youtube",
        url: "https://www.youtube.com/watch?v=WPdWvnAAurg",
        thumbnail: "https://img.youtube.com/vi/WPdWvnAAurg/maxresdefault.jpg",
        caption: "Savage MV",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=800&fit=crop",
        caption: "2022 New Year Photo",
      },
    ],
    description: "Savage로 더욱 강해진 aespa의 2022년",
  },
  {
    id: "2022-0708",
    date: "2022-07-08",
    title: "Girls World Tour Begins",
    subtitle: "Girls Era",
    color: "#ff69b4",
    coverImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop",
    media: [
      {
        type: "youtube",
        url: "https://www.youtube.com/watch?v=_EyMyH5x4SE",
        thumbnail: "https://img.youtube.com/vi/_EyMyH5x4SE/maxresdefault.jpg",
        caption: "Girls MV",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=800&fit=crop",
        caption: "Stage Performance",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=800&fit=crop",
        caption: "Fan Meeting Moment",
      },
    ],
    description: "첫 단독 콘서트에서 팬들과 함께한 감동적인 시간",
  },
  {
    "id": "20221226",
    "date": "2022-12-26",
    "title": "싱크로드 1주차 스틸컷",
    "subtitle": "",
    "color": "#e94560",
    "coverImage": "https://i.ifh.cc/Az2aFt.jpg",
    "description": "",
    "media": [
      {
        "type": "tweet",
        "url": "",
        "tweet_id": "1607194489348579328",
        "caption": ""
      }
    ]
  },
  {
    id: "2022-1217",
    date: "2022-12-17",
    title: "Winter Wonderland Concert",
    subtitle: "Year End Special",
    color: "#60a5fa",
    coverImage: "https://images.unsplash.com/photo-1482575832494-771f74bf6857?w=800&h=600&fit=crop",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=800&fit=crop",
        caption: "Winter Concert",
      },
      {
        type: "twitter-image",
        url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&h=800&fit=crop",
        caption: "Special Performance",
      },
    ],
    description: "연말 스페셜 공연",
  },
];
