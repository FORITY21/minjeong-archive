// utils/grouping.ts

// 데이터 타입 정의 (any 대신 구체적으로 적어주면 더 좋아요)
interface RawInstaPost {
    id: number;
    date: string;
    image: string;
    // 필요한 다른 필드들...
  }
  
 // utils/grouping.ts

export function groupPostsByDate(rawData: any[]) {
    // 그룹을 저장할 객체
    const groups: { [key: string]: any } = {};
  
    rawData.forEach((item) => {
      // 🔑 핵심: '날짜'를 열쇠(Key)로 사용합니다.
      // 날짜가 "2025-09-15"로 같으면, 무조건 같은 방에 넣습니다.
      const key = item.date; 
  
      if (!groups[key]) {
        // 1. 이 날짜에 첫 손님이면 -> 방을 새로 만듭니다.
        groups[key] = {
          ...item,
          // 이미지가 하나라도 있으면 배열로 시작, 없으면 빈 배열
          images: item.image ? [item.image] : [],
          // 혹시 모르니 원본 아이템의 다른 이미지 필드들도 체크 (urls 등)
          ...(item.urls ? { images: [...item.urls] } : {})
        };
        
        // 헷갈리지 않게 단일 image 필드는 삭제
        delete groups[key].image; 
        delete groups[key].url; 
  
      } else {
        // 2. 이 날짜 방이 이미 있으면 -> 이미지만 쏙 집어넣습니다. (합방!)
        if (item.image) {
          groups[key].images.push(item.image);
        }
        if (item.urls) {
          groups[key].images.push(...item.urls);
        }
      }
    });
  
    // 날짜순(최신순)으로 정렬해서 내보내기
    return Object.values(groups).sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
  