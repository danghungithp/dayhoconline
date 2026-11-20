/**
 * Programmatic SEO (pSEO) Build Automation Script
 * 1. Generates complete sitemap.xml with all lab, subject, and grade URLs
 * 2. Updates robots.txt
 * 3. Prerenders static HTML pages (SSG) in dist/ for 100% Googlebot crawlability
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://dayhoconlineliart.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];

// Load labs data
const labsJsonPath = path.join(rootDir, 'src', 'data', 'labsSeoData.json');
const rawLabsData = fs.readFileSync(labsJsonPath, 'utf-8');
const labs = JSON.parse(rawLabsData);

const subjects = [
  { id: 'khtn', name: 'Khoa học Tự nhiên', grades: [6, 7, 8, 9] },
  { id: 'hoa-hoc', name: 'Hóa học', grades: [7, 8, 9, 10, 11, 12] },
  { id: 'vat-ly', name: 'Vật lý', grades: [6, 7, 8, 9, 10, 11, 12] },
  { id: 'toan', name: 'Toán học', grades: [6, 7, 8, 9, 10, 11, 12] },
  { id: 'hinh-hoc', name: 'Hình học', grades: [6, 7, 8, 9, 10, 11, 12] },
  { id: 'sinh-hoc', name: 'Sinh học', grades: [7, 8, 9, 10, 11, 12] },
  { id: 'tin-hoc', name: 'Tin học', grades: [6, 7, 8, 9, 10, 11, 12] },
  { id: 'dia-ly', name: 'Địa lý', grades: [6, 7, 8, 9, 10, 11, 12] },
  { id: 'tieng-anh', name: 'Tiếng Anh', grades: [6, 7, 8, 9, 10, 11, 12] },
];

console.log('🚀 Starting Programmatic SEO Generation...');

// =========================================================================
// 1. TỰ ĐỘNG HÓA SITEMAP.XML
// =========================================================================
function generateSitemap() {
  const urls = [];

  // Trang chủ
  urls.push({
    loc: `${BASE_URL}/`,
    lastmod: TODAY,
    changefreq: 'daily',
    priority: '1.0',
  });

  // Trang Môn học (/mon/[subject])
  subjects.forEach(sub => {
    urls.push({
      loc: `${BASE_URL}/mon/${sub.id}`,
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: '0.8',
    });

    // Trang Môn học + Lớp (/mon/[subject]/lop-[grade])
    sub.grades.forEach(grade => {
      urls.push({
        loc: `${BASE_URL}/mon/${sub.id}/lop-${grade}`,
        lastmod: TODAY,
        changefreq: 'weekly',
        priority: '0.8',
      });
    });
  });

  // Trang chi tiết bài Lab (/lab/[slug])
  labs.forEach(lab => {
    urls.push({
      loc: `${BASE_URL}/lab/${lab.slug}`,
      lastmod: lab.updatedAt || TODAY,
      changefreq: 'weekly',
      priority: lab.isImplemented ? '0.9' : '0.7',
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const publicSitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xml, 'utf-8');
  console.log(`✅ Generated public/sitemap.xml with ${urls.length} total URLs.`);

  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf-8');
    console.log(`✅ Copied sitemap.xml to dist/sitemap.xml.`);
  }
}

// =========================================================================
// 2. TỰ ĐỘNG HÓA ROBOTS.TXT
// =========================================================================
function generateRobotsTxt() {
  const content = `# Robots.txt - STEM & English Interactive Lab
User-agent: *
Allow: /
Allow: /lab/
Allow: /mon/
Disallow: /?view=admin
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(rootDir, 'public', 'robots.txt'), content, 'utf-8');
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'robots.txt'), content, 'utf-8');
  }
  console.log('✅ Updated robots.txt pointing directly to sitemap.xml.');
}

// =========================================================================
// 3. STATIC SITE GENERATION (SSG PRERENDER) CHO GOOGLEBOT
// =========================================================================
function prerenderPages() {
  const distDir = path.join(rootDir, 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.log('⚠️ dist/index.html not found. Run `vite build` first before prerendering.');
    return;
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf-8');

  // A. Prerender từng bài lab (/lab/[slug]/index.html)
  labs.forEach(lab => {
    const labUrl = `${BASE_URL}/lab/${lab.slug}`;
    const pageTitle = `${lab.title} | STEM Interactive Lab`;
    const pageDesc = lab.description;

    // Structured Data JSON-LD
    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: lab.subjectName, item: `${BASE_URL}/mon/${lab.subject}` },
          { '@type': 'ListItem', position: 3, name: `Lớp ${lab.grade}`, item: `${BASE_URL}/mon/${lab.subject}/lop-${lab.grade}` },
          { '@type': 'ListItem', position: 4, name: lab.title, item: labUrl },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: lab.title,
        description: lab.description,
        url: labUrl,
        inLanguage: 'vi-VN',
        educationalLevel: `Lớp ${lab.grade} (Cấp ${lab.level} - GDPT 2018)`,
        learningResourceType: 'Interactive Simulation, Virtual Science Lab',
        teaches: lab.seoContent.objective,
        provider: {
          '@type': 'Organization',
          name: 'STEM & English Interactive Lab Vietnam',
          url: BASE_URL,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        name: `Câu hỏi trắc nghiệm ôn tập: ${lab.title}`,
        hasPart: lab.quizzes.map(q => ({
          '@type': 'Question',
          name: q.question,
          suggestedAnswer: q.options.map(opt => ({ '@type': 'Answer', text: opt })),
          acceptedAnswer: { '@type': 'Answer', text: q.answer, comment: q.explanation },
        })),
      },
    ];

    // Semantic HTML Content for Googlebot
    const bodyHtml = `
      <div class="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 max-w-7xl mx-auto space-y-6">
        <nav aria-label="Breadcrumb" class="text-xs text-slate-400 py-2">
          <a href="/" class="hover:underline">Trang chủ</a> &gt;
          <a href="/mon/${lab.subject}" class="hover:underline">${lab.subjectName}</a> &gt;
          <a href="/mon/${lab.subject}/lop-${lab.grade}" class="hover:underline">Lớp ${lab.grade}</a> &gt;
          <span class="text-white font-bold">${lab.title}</span>
        </nav>

        <header class="space-y-3">
          <div class="flex gap-2 text-xs">
            <span class="bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded font-bold">${lab.subjectName}</span>
            <span class="bg-indigo-900 text-indigo-200 px-2 py-0.5 rounded font-bold">Lớp ${lab.grade}</span>
            <span class="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">${lab.curriculumCode}</span>
          </div>
          <h1 class="text-3xl font-extrabold text-white">${lab.title}</h1>
          <p class="text-slate-300 leading-relaxed">${lab.description}</p>
        </header>

        <section aria-label="Phòng Thí Nghiệm Ảo" class="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center">
          <div class="p-4 bg-slate-950 rounded-xl text-cyan-400 font-mono text-sm">
            ⚡ Phòng Thí Nghiệm Ảo Tương Tác 60 FPS • Sẵn sàng tải mã nguồn WebGL/Canvas2D...
          </div>
        </section>

        <article class="space-y-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 text-slate-200">
          <div>
            <h2 class="text-xl font-bold text-white mb-2">🎯 1. Mục tiêu bài học & Chuẩn đầu ra GDPT 2018</h2>
            <p class="leading-relaxed">${lab.seoContent.objective}</p>
          </div>

          <div>
            <h2 class="text-xl font-bold text-white mb-2">⚙️ 2. Các thông số & Biến số tương tác trong Lab</h2>
            <ul class="list-disc pl-5 space-y-1">
              ${lab.seoContent.variables.map(v => `<li>${v}</li>`).join('')}
            </ul>
          </div>

          <div>
            <h2 class="text-xl font-bold text-white mb-2">🔬 3. Bản chất khoa học & Giải thích hiện tượng</h2>
            <p class="leading-relaxed">${lab.seoContent.phenomenon}</p>
          </div>

          <div>
            <h2 class="text-xl font-bold text-white mb-2">📐 4. Công thức trọng tâm & Quy tắc ghi nhớ</h2>
            <pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-cyan-300 font-mono overflow-x-auto">${lab.seoContent.formulaOrGrammar}</pre>
          </div>

          <div class="p-4 bg-amber-950/40 border border-amber-800/80 rounded-xl text-amber-200">
            <h2 class="text-lg font-bold text-amber-300 mb-1">⚠️ 5. Lưu ý & Những lỗi sai học sinh thường gặp</h2>
            <p>${lab.seoContent.commonMistakes}</p>
          </div>
        </article>

        <section aria-label="Câu hỏi trắc nghiệm ôn tập" class="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <h3 class="text-lg font-bold text-white">📝 Trắc nghiệm ôn tập (${lab.quizzes.length} câu)</h3>
          ${lab.quizzes
            .map(
              (q, i) => `
            <div class="p-3 bg-slate-950 rounded-xl space-y-2 text-xs">
              <div class="font-bold text-white">Câu ${i + 1}: ${q.question}</div>
              <ul class="space-y-1 pl-4 text-slate-300 list-disc">
                ${q.options.map(opt => `<li>${opt}</li>`).join('')}
              </ul>
              <div class="text-emerald-400 font-semibold">Đáp án: ${q.answer}</div>
              <div class="text-slate-400">Giải thích: ${q.explanation}</div>
            </div>`
            )
            .join('')}
        </section>
      </div>
    `;

    // Replace head tags
    let html = baseHtml;
    html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
    html = html.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${pageDesc}" />`
    );
    html = html.replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${labUrl}" />`
    );

    // Inject JSON-LD before </head>
    const jsonLdTag = `<script type="application/ld+json" id="json-ld-pseo">\n${JSON.stringify(
      jsonLd,
      null,
      2
    )}\n</script>\n`;
    html = html.replace('</head>', `${jsonLdTag}</head>`);

    // Inject pre-rendered semantic HTML inside <div id="root">
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

    // Write file to dist/lab/[slug]/index.html
    const outDir = path.join(distDir, 'lab', lab.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
  });
  console.log(`✅ Prerendered ${labs.length} lab detail pages in dist/lab/[slug]/index.html`);

  // B. Prerender từng trang Môn học (/mon/[subject]/index.html)
  subjects.forEach(sub => {
    const subUrl = `${BASE_URL}/mon/${sub.id}`;
    const pageTitle = `Thư viện Thí Nghiệm Ảo ${sub.name} Lớp 6 - 12 (GDPT 2018) | STEM Lab`;
    const pageDesc = `Tổng hợp các phòng thí nghiệm ảo môn ${sub.name} THCS & THPT chuẩn GDPT 2018. Học trực quan 60 FPS theo sách Kết nối tri thức, Cánh diều, Chân trời sáng tạo.`;

    const subLabs = labs.filter(l => l.subject === sub.id);

    const bodyHtml = `
      <div class="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 max-w-7xl mx-auto space-y-6">
        <nav aria-label="Breadcrumb" class="text-xs text-slate-400 py-2">
          <a href="/" class="hover:underline">Trang chủ</a> &gt;
          <span class="text-white font-bold">${sub.name}</span>
        </nav>
        <header class="space-y-3">
          <h1 class="text-3xl font-extrabold text-white">Thư Viện Thí Nghiệm Ảo Môn ${sub.name} (Lớp 6 - 12)</h1>
          <p class="text-slate-300 leading-relaxed">${pageDesc}</p>
        </header>
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${subLabs
            .map(
              l => `
            <a href="/lab/${l.slug}" class="block p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 transition">
              <span class="text-xs text-cyan-400 font-bold">Lớp ${l.grade} • ${l.curriculumCode}</span>
              <h2 class="text-base font-bold text-white mt-1">${l.title}</h2>
              <p class="text-xs text-slate-400 mt-1">${l.description}</p>
            </a>`
            )
            .join('')}
        </section>
      </div>
    `;

    let html = baseHtml;
    html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${pageDesc}" />`);
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${subUrl}" />`);
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

    const outDir = path.join(distDir, 'mon', sub.id);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');

    // C. Prerender từng trang Môn + Lớp (/mon/[subject]/lop-[grade]/index.html)
    sub.grades.forEach(grade => {
      const gradeUrl = `${BASE_URL}/mon/${sub.id}/lop-${grade}`;
      const gradeTitle = `Phòng Thí Nghiệm Ảo ${sub.name} Lớp ${grade} (GDPT 2018) | STEM Lab`;
      const gradeDesc = `Danh sách bài thực hành thí nghiệm ảo môn ${sub.name} Lớp ${grade} chuẩn GDPT 2018. Mô phỏng 60 FPS, bài tập trắc nghiệm và câu hỏi ôn tập.`;
      const gradeLabs = labs.filter(l => l.subject === sub.id && l.grade === grade);

      const gradeBodyHtml = `
        <div class="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 max-w-7xl mx-auto space-y-6">
          <nav aria-label="Breadcrumb" class="text-xs text-slate-400 py-2">
            <a href="/" class="hover:underline">Trang chủ</a> &gt;
            <a href="/mon/${sub.id}" class="hover:underline">${sub.name}</a> &gt;
            <span class="text-white font-bold">Lớp ${grade}</span>
          </nav>
          <header class="space-y-3">
            <h1 class="text-3xl font-extrabold text-white">Phòng Thí Nghiệm Ảo Môn ${sub.name} Lớp ${grade}</h1>
            <p class="text-slate-300 leading-relaxed">${gradeDesc}</p>
          </header>
          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${gradeLabs
              .map(
                l => `
              <a href="/lab/${l.slug}" class="block p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 transition">
                <span class="text-xs text-cyan-400 font-bold">Lớp ${l.grade} • ${l.curriculumCode}</span>
                <h2 class="text-base font-bold text-white mt-1">${l.title}</h2>
                <p class="text-xs text-slate-400 mt-1">${l.description}</p>
              </a>`
              )
              .join('')}
          </section>
        </div>
      `;

      let gHtml = baseHtml;
      gHtml = gHtml.replace(/<title>.*?<\/title>/i, `<title>${gradeTitle}</title>`);
      gHtml = gHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${gradeDesc}" />`);
      gHtml = gHtml.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${gradeUrl}" />`);
      gHtml = gHtml.replace('<div id="root"></div>', `<div id="root">${gradeBodyHtml}</div>`);

      const gradeOutDir = path.join(distDir, 'mon', sub.id, `lop-${grade}`);
      fs.mkdirSync(gradeOutDir, { recursive: true });
      fs.writeFileSync(path.join(gradeOutDir, 'index.html'), gHtml, 'utf-8');
    });
  });

  console.log(`✅ Prerendered all subject & grade hub pages in dist/mon/`);
}

// Execute all
generateSitemap();
generateRobotsTxt();
prerenderPages();

console.log('🎉 Programmatic SEO build completed successfully!');
