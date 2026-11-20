import { LabSeoItem } from '../types/pseo.types';

const BASE_URL = 'https://dayhoconlineliart.vercel.app';

/**
 * Cập nhật động thẻ Title, Meta Description, Canonical, OpenGraph và JSON-LD
 */
export function updateDocumentMeta(options: {
  title: string;
  description: string;
  canonicalPath: string;
  ogTitle?: string;
  ogDescription?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}) {
  if (typeof document === 'undefined') return;

  // 1. Title
  document.title = options.title;

  // 2. Meta description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', options.description);

  // 3. Canonical URL
  const canonicalUrl = `${BASE_URL}${options.canonicalPath.startsWith('/') ? options.canonicalPath : '/' + options.canonicalPath}`;
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 4. OpenGraph Tags
  setMetaTag('property', 'og:title', options.ogTitle || options.title);
  setMetaTag('property', 'og:description', options.ogDescription || options.description);
  setMetaTag('property', 'og:url', canonicalUrl);

  // 5. JSON-LD Structured Data
  if (options.jsonLd) {
    let scriptTag = document.getElementById('json-ld-pseo') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-pseo';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(options.jsonLd, null, 2);
  }
}

function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attrName, attrValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Tạo JSON-LD Schema: BreadcrumbList
 */
export function generateBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: `${BASE_URL}${it.path}`,
    })),
  };
}

/**
 * Tạo JSON-LD Schema kết hợp: LearningResource & Quiz
 */
export function generateLabStructuredData(lab: LabSeoItem) {
  const labUrl = `${BASE_URL}/lab/${lab.slug}`;

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Trang chủ', path: '/' },
    { name: lab.subjectName, path: `/mon/${lab.subject}` },
    { name: `Lớp ${lab.grade}`, path: `/mon/${lab.subject}/lop-${lab.grade}` },
    { name: lab.title, path: `/lab/${lab.slug}` },
  ]);

  const learningResource = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': `${labUrl}#learning-resource`,
    name: lab.title,
    description: lab.description,
    url: labUrl,
    inLanguage: 'vi-VN',
    educationalLevel: `Lớp ${lab.grade} (Cấp ${lab.level} - GDPT 2018)`,
    learningResourceType: 'Interactive Simulation, Virtual Science Lab',
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      targetName: `${lab.subjectName} - Chương trình GDPT 2018 Việt Nam`,
      targetUrl: 'https://moet.gov.vn/',
    },
    teaches: lab.seoContent.objective,
    competencyRequired: `Kiến thức cơ bản ${lab.subjectName} Lớp ${lab.grade}`,
    provider: {
      '@type': 'Organization',
      name: 'STEM & English Interactive Lab Vietnam',
      url: BASE_URL,
    },
  };

  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    '@id': `${labUrl}#quiz`,
    name: `Câu hỏi trắc nghiệm ôn tập: ${lab.title}`,
    about: {
      '@type': 'Thing',
      name: lab.title,
    },
    educationalLevel: `Lớp ${lab.grade}`,
    hasPart: lab.quizzes.map(q => ({
      '@type': 'Question',
      name: q.question,
      suggestedAnswer: q.options.map(opt => ({
        '@type': 'Answer',
        text: opt,
      })),
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
        comment: q.explanation,
      },
    })),
  };

  return [breadcrumbs, learningResource, quizSchema];
}
