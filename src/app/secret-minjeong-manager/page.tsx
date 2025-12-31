'use client';

import { useState } from 'react';

// 데이터 타입 정의
interface MediaItem {
  type: 'youtube' | 'image' | 'twitter-image' | 'instagram' | 'tweet';
  url: string;
  thumbnail?: string;
  caption: string;
  tweet_id?: string; // ✅ tweet_id 추가됨
}

interface EventData {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  color: string;
  coverImage: string;
  description: string;
  media: MediaItem[];
}

export default function AdminPage() {
  const [formData, setFormData] = useState<EventData>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    title: '',
    subtitle: '',
    color: '#e94560',
    coverImage: '',
    description: '',
    media: [],
  });

  const [jsonOutput, setJsonOutput] = useState('');

  // 날짜 변경 시 ID 자동 생성 (YYYYMMDD)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      id: name === 'date' ? value.replace(/-/g, '') : prev.id,
    }));
  };

  const addMedia = () => {
    setFormData((prev) => ({
      ...prev,
      media: [
        ...prev.media,
        { type: 'youtube', url: '', caption: '' }, 
      ],
    }));
  };

  // ✅ 미디어 업데이트 핸들러 (트위터 로직 추가됨)
  const updateMedia = (index: number, field: keyof MediaItem, value: string) => {
    const newMedia = [...formData.media];
    newMedia[index] = { ...newMedia[index], [field]: value };
    
    // 1. 유튜브 썸네일 자동 생성
    if (field === 'url' && newMedia[index].type === 'youtube') {
      const videoId = value.split('v=')[1]?.split('&')[0];
      if (videoId) {
        newMedia[index].thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    // 2. 🔥 트위터 ID 자동 추출 및 썸네일 설정
    if (field === 'url' && newMedia[index].type === 'tweet') {
      // URL에서 숫자 ID 추출 (status/ 뒤의 숫자)
      const tweetIdMatch = value.match(/status\/(\d+)/);
      if (tweetIdMatch && tweetIdMatch[1]) {
        newMedia[index].tweet_id = tweetIdMatch[1];
        
        // 날짜 기반 기본 썸네일 생성 (필요 시 수정)
        newMedia[index].thumbnail = `${formData.date}_None.jpg`;
      }
    }
    
    setFormData((prev) => ({ ...prev, media: newMedia }));
  };

  const generateJSON = () => {
    const finalData = {
      ...formData,
      id: formData.id || formData.date.replace(/-/g, '')
    };
    
    const jsonString = JSON.stringify(finalData, null, 2) + ',';
    setJsonOutput(jsonString);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    alert('JSON 코드가 복사되었습니다!');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Data Admin Tool</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 입력 폼 영역 */}
          <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold mb-4">새 이벤트 추가</h2>
            
            {/* 기본 정보 입력 필드들 */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">날짜</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-black/50 border border-white/20 rounded p-2 text-white" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">제목</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full bg-black/50 border border-white/20 rounded p-2 text-white" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">부제목</label>
              <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="Subtitle" className="w-full bg-black/50 border border-white/20 rounded p-2 text-white" />
            </div>

            {/* 색상 선택 */}
            <div className="flex gap-4">
               <div className="flex-1">
                 <label className="block text-sm text-gray-400 mb-1">테마 색상</label>
                 <div className="flex gap-2">
                   <input type="color" name="color" value={formData.color} onChange={handleChange} className="h-10 w-10 rounded cursor-pointer" />
                   <input type="text" name="color" value={formData.color} onChange={handleChange} className="flex-1 bg-black/50 border border-white/20 rounded p-2 text-white text-sm" />
                 </div>
               </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">메인 이미지 URL</label>
              <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://..." className="w-full bg-black/50 border border-white/20 rounded p-2 text-white" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">설명</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-black/50 border border-white/20 rounded p-2 text-white" />
            </div>

            {/* 미디어 섹션 */}
            <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm text-gray-400">미디어 목록</label>
                    <button onClick={addMedia} className="text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-500">
                        + 미디어 추가
                    </button>
                </div>
                
                {formData.media.map((item, idx) => (
                    <div key={idx} className="bg-white/5 p-3 rounded mb-2 space-y-2 border border-white/5 relative">
                        <div className="flex gap-2">
                            <select 
                                value={item.type} 
                                onChange={(e) => updateMedia(idx, 'type', e.target.value as any)} 
                                className="w-1/3 bg-black/50 border border-white/20 rounded p-1 text-sm text-white"
                            >
                                <option value="youtube">YouTube</option>
                                <option value="image">Image</option>
                                <option value="instagram">Instagram</option>
                                <option value="tweet">Tweet (X)</option> {/* ✅ Tweet 옵션 */}
                            </select>
                            
                            {/* Tweet ID 표시용 (자동생성됨) */}
                            {item.type === 'tweet' && (
                                <input 
                                    type="text" 
                                    value={item.tweet_id || ''} 
                                    placeholder="Tweet ID (자동생성)" 
                                    readOnly 
                                    className="w-2/3 bg-gray-800 border border-white/10 rounded p-1 text-sm text-gray-400 cursor-not-allowed"
                                />
                            )}
                        </div>

                        <input
                            type="text"
                            placeholder={item.type === 'tweet' ? "트위터 링크 (https://x.com/.../status/1234...)" : "URL 입력"}
                            value={item.url}
                            onChange={(e) => updateMedia(idx, 'url', e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded p-1 text-sm text-white"
                        />
                        <input
                            type="text"
                            placeholder="설명 (Caption)"
                            value={item.caption}
                            onChange={(e) => updateMedia(idx, 'caption', e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded p-1 text-sm text-white"
                        />
                    </div>
                ))}
            </div>

            <button onClick={generateJSON} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors">
                JSON 생성하기
            </button>
          </div>

          {/* 결과 출력 영역 */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 h-fit sticky top-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">생성된 JSON</h2>
            <pre className="bg-black p-4 rounded-lg overflow-x-auto text-xs text-green-400 font-mono min-h-[200px] border border-white/5 whitespace-pre-wrap">
                {jsonOutput || '// 데이터 입력 후 버튼을 누르세요.'}
            </pre>
            {jsonOutput && (
                <button onClick={copyToClipboard} className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-2 rounded transition-colors">
                    복사하기
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
