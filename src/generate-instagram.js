// generate-instagram.js (디버깅 + 타임아웃 방지 버전)
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ddwxb1cid",
  api_key: "645573962471988",
  api_secret: "K5zsTuVc1THk7Htj24SSRSRx_Ms",
});

const OUTPUT_DIR = path.join(__dirname, "../src/data/instagram");

// 🔍 진행상황 실시간 표시
let progressCounter = 0;
const logProgress = () => {
  process.stdout.write(`\r⏳ 진행: ${++progressCounter} 요청...`);
};

async function getAllImwinterImages() {
  console.log("\n🔍 Cloudinary imwinter 이미지 수집 (최대 3분)...");
  let resources = [];
  let nextCursor = null;
  let page = 0;
  
  try {
    do {
      page++;
      logProgress();
      
      const result = await cloudinary.search
        .expression('resource_type:image AND public_id:*imwinter*')
        .max_results(500)
        .next_cursor(nextCursor)
        .execute()
        .timeout(30000); // 30초 타임아웃

      if (!result.resources || result.resources.length === 0) {
        console.log(`\n✅ 페이지 ${page} 완료 (더 이상 데이터 없음)`);
        break;
      }

      resources = resources.concat(result.resources);
      nextCursor = result.next_cursor;
      console.log(`\n📥 페이지 ${page}: +${result.resources.length}개 (총 ${resources.length})`);
      
      // 5초 대기 (API 제한 방지)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // 최대 50페이지 제한 (안전장치)
      if (page >= 50) {
        console.log("\n⚠️  최대 페이지 도달 (50페이지)");
        break;
      }
    } while (nextCursor);
    
    console.log(`\n✅ 총 ${resources.length}개 imwinter 이미지 수집 완료!`);
    return resources.filter(img => img.public_id.includes('imwinter'));
  } catch (error) {
    console.error("\n❌ Cloudinary 에러:", error.message);
    console.error("  코드:", error.http_code);
    return [];
  }
}

async function main() {
  console.log("🚀 🔥 Instagram 데이터 재생성 시작");
  
  // 기존 파일 삭제
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    console.log("🗑️ 기존 데이터 삭제 완료");
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 이미지 수집 (핵심!)
  const allImages = await getAllImwinterImages();
  if (allImages.length === 0) {
    console.log("❌ imwinter 이미지를 찾을 수 없음");
    return;
  }

  console.log("\n🔍 중복 제거 + 파일 생성 중...");
  
  // 간단한 중복 제거 + 파일 생성 (디버깅용)
  const uniqueUrls = new Set();
  const cleanImages = allImages.filter(img => {
    if (uniqueUrls.has(img.secure_url)) return false;
    uniqueUrls.add(img.secure_url);
    return true;
  });

  console.log(`✅ 중복 제거: ${allImages.length} → ${cleanImages.length}개`);

  // 2025년만 간단 생성 (테스트용)
  const year2025 = cleanImages.map((img, idx) => ({
    id: `2025-12-31-${idx + 1}`,
    date: "2025-12-31",
    year: 2025,
    images: [{
      image: img.secure_url,
      public_id: img.public_id,
      width: img.width,
      height: img.height,
    }],
    count: 1,
    source: "cloudinary",
  })).slice(0, 20); // 처음 20개만

  const tsContent = `export const insta2025 = ${JSON.stringify(year2025, null, 2)} as const;\n`;
  fs.writeFileSync(path.join(OUTPUT_DIR, `insta-2025.ts`), tsContent, "utf8");

  console.log(`\n🎉 ✅ insta-2025.ts 생성 완료! ${year2025.length}개 이벤트`);
  console.log(`📁 위치: ${OUTPUT_DIR}`);
}

main().catch(error => {
  console.error("\n💥 치명적 오류:", error);
  process.exit(1);
});
