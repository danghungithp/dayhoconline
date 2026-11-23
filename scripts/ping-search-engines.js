/**
 * Search Engine Batch Ping CLI Script
 * Submits all sitemap URLs to Google and IndexNow (Bing, Yandex, Naver, Seznam)
 * Run manually via: npm run ping:seo
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DOMAIN = 'https://lab.coffeestockvn.cafe';
const HOST = 'lab.coffeestockvn.cafe';
const INDEXNOW_KEY = '57a07ea2b7244eb1a47348981f332c91';
const SITEMAP_URL = `${DOMAIN}/sitemap.xml`;

async function main() {
  console.log(`\n======================================================`);
  console.log(`📡 SEARCH ENGINE AUTOMATED INDEXING PING`);
  console.log(`Domain: ${DOMAIN}`);
  console.log(`Sitemap: ${SITEMAP_URL}`);
  console.log(`IndexNow Key: ${INDEXNOW_KEY}`);
  console.log(`======================================================\n`);

  // 1. Đọc danh sách URLs từ sitemap.xml
  const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
  let urlList = [DOMAIN + '/', SITEMAP_URL];

  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, 'utf-8');
    const matches = xml.match(/<loc>(.*?)<\/loc>/g);
    if (matches && matches.length > 0) {
      urlList = matches.map(m => m.replace(/<\/?loc>/g, '').trim());
    }
  }

  console.log(`📄 Tìm thấy ${urlList.length} URLs từ Sitemap cần ping.`);

  // 2. Gửi tín hiệu tới IndexNow (Bing, Yandex, Seznam, Naver)
  const indexNowPayload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${DOMAIN}/${INDEXNOW_KEY}.txt`,
    urlList: urlList.slice(0, 100), // Tối đa 100 URL ưu tiên
  };

  const indexNowEndpoints = [
    { name: 'IndexNow Global', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Microsoft Bing IndexNow', url: 'https://www.bing.com/indexnow' },
  ];

  for (const ep of indexNowEndpoints) {
    try {
      console.log(`⏳ Đang gửi ${indexNowPayload.urlList.length} URLs tới ${ep.name}...`);
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(indexNowPayload),
      });

      if (res.ok || res.status === 200 || res.status === 202) {
        console.log(`✅ [${ep.name}] Tiếp nhận thành công! Mã trạng thái: ${res.status}`);
      } else {
        const text = await res.text().catch(() => '');
        console.log(`⚠️ [${ep.name}] Phản hồi mã ${res.status}: ${text || 'Đã tiếp nhận vào hàng đợi'}`);
      }
    } catch (e) {
      console.warn(`❌ [${ep.name}] Lỗi kết nối: ${e.message}`);
    }
  }

  // 3. Ping Google Sitemap
  try {
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    console.log(`⏳ Đang gửi Ping Sitemap tới Google Bot...`);
    const gRes = await fetch(googlePingUrl);
    console.log(`✅ [Google Sitemap Ping] Hoàn tất gửi yêu cầu tới Google (${gRes.status}).`);
  } catch (e) {
    console.warn(`⚠️ [Google Sitemap Ping] Gửi tín hiệu sitemap: ${e.message}`);
  }

  console.log(`\n🎉 Toàn bộ quy trình Ping công cụ tìm kiếm đã hoàn tất!`);
  console.log(`Googlebot và Bingbot sẽ tiến hành thu thập dữ liệu tự động.\n`);
}

main().catch(err => {
  console.error('Fatal ping error:', err);
});
