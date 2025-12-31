import { DateEvent } from '../mockData';

export const events2021: DateEvent[] = [
  {
    id: "2021-0101",
    date: "2021-01-01",
    title: "First New Year as aespa",
    subtitle: "Black Mamba Era",
    color: "#e94560",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
    media: [
      {
        type: "youtube",
        url: "https://www.youtube.com/watch?v=ZeerrnuLi5E",
        thumbnail: "https://img.youtube.com/vi/ZeerrnuLi5E/maxresdefault.jpg",
        caption: "Black Mamba MV",
      },
      {
        type: "twitter-image",
        url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=800&fit=crop",
        caption: "New Year Greeting",
      },
    ],
    description: "aespa로서 맞이한 첫 새해",
  },
  {
    id: "2021-0517",
    date: "2021-05-17",
    title: "Next Level Release",
    subtitle: "Next Level Era",
    color: "#58a6ff",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    media: [
      {
        type: "youtube",
        url: "https://www.youtube.com/watch?v=4TWR90KJl84",
        thumbnail: "https://img.youtube.com/vi/4TWR90KJl84/maxresdefault.jpg",
        caption: "Next Level MV",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=800&fit=crop",
        caption: "Comeback Stage",
      },
      {
        type: "twitter-image",
        url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=800&fit=crop",
        caption: "Behind the Scenes",
      },
    ],
    description: "전 세계를 열광시킨 Next Level 발매",
  },
  {
    id: "2021-1005",
    date: "2021-10-05",
    title: "Savage Album Release",
    subtitle: "Savage Era",
    color: "#a855f7",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
    media: [
      {
        type: "youtube",
        url: "https://www.youtube.com/watch?v=WPdWvnAAurg",
        thumbnail: "https://img.youtube.com/vi/WPdWvnAAurg/maxresdefault.jpg",
        caption: "Savage MV",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=800&fit=crop",
        caption: "Album Concept Photo",
      },
    ],
    description: "첫 미니앨범 Savage로 기록을 세우다",
  },
];
