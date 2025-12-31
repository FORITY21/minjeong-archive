const fs = require('fs');
const path = require('path');

// 1. 설정: 이미지가 있는 폴더와 JSON을 저장할 위치
const IMAGE_DIR = path.join(process.cwd(), 'public/images/archive');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/archive_data.json');

// 폴더가 없으면 에러 방지
if (!fs.existsSync(IMAGE_DIR)) {
  console.error(`❌ 오류: ${IMAGE_DIR} 폴더를 찾을 수 없습니다.`);
  process.exit(1);
}

// 2. 파일 읽어오기
const files = fs.readdirSync(IMAGE_DIR);

// 이미지 파일만 골라내기 (jpg, png, webp 등)
const imageFiles = files.filter(file => 
  /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
);

console.log(`📸 총 ${imageFiles.length}장의 사진을 발견했습니다.`);

// 3. 연도별로 그룹화하기
const groupedData = {};

imageFiles.forEach(file => {
  // 파일명 예시: "2024-05-27_12345.jpg"
  // 앞 4글자(2024)를 연도로 추출
  const year = file.substring(0, 4); 
  
  // 아직 그 연도 그룹이 없으면 배열 생성
  if (!groupedData[year]) {
    groupedData[year] = [];
  }

  // 데이터 추가
  groupedData[year].push({
    src: `/images/archive/${file}`, // Next.js에서 쓸 경로
    filename: file,
    date: file.substring(0, 10) // "2024-05-27" 날짜 추출
  });
});

// 4. 정렬하기 (최신 연도가 위로, 최신 사진이 위로)
// 4-1. 연도 키(Key) 정렬 (2025, 2024, 2023...)
const sortedYears = Object.keys(groupedData).sort((a, b) => b - a);

// 4-2. 최종 객체 생성 및 내부 사진 정렬
const finalData = {};
sortedYears.forEach(year => {
  // 각 연도 내부의 사진들도 날짜 내림차순(최신순) 정렬
  groupedData[year].sort((a, b) => b.filename.localeCompare(a.filename));
  finalData[year] = groupedData[year];
});

// 5. JSON 파일로 저장
// src/data 폴더가 없으면 생성
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));

console.log(`✅ 성공! 연도별 데이터가 생성되었습니다: ${OUTPUT_FILE}`);
console.log(`📂 포함된 연도: ${sortedYears.join(', ')}`);
