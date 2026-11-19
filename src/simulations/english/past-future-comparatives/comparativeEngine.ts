import { EntityItem, AdjectiveInfo, ComparisonAttribute, GeneratedSentence } from './types';

export const ANIMALS: EntityItem[] = [
  { id: 'cheetah', nameEn: 'Cheetah', nameVi: 'Báo đốm', emoji: '🐆', speedKmH: 110, weightKg: 55, heightM: 0.9 },
  { id: 'lion', nameEn: 'Lion', nameVi: 'Sư tử', emoji: '🦁', speedKmH: 80, weightKg: 190, heightM: 1.2 },
  { id: 'elephant', nameEn: 'Elephant', nameVi: 'Voi', emoji: '🐘', speedKmH: 40, weightKg: 5500, heightM: 3.3 },
  { id: 'giraffe', nameEn: 'Giraffe', nameVi: 'Hươu cao cổ', emoji: '🦒', speedKmH: 55, weightKg: 1200, heightM: 5.5 },
  { id: 'rabbit', nameEn: 'Rabbit', nameVi: 'Thỏ', emoji: '🐇', speedKmH: 48, weightKg: 2.5, heightM: 0.35 },
];

export const VEHICLES: EntityItem[] = [
  { id: 'bicycle', nameEn: 'Bicycle', nameVi: 'Xe đạp', emoji: '🚲', speedKmH: 25, weightKg: 14, heightM: 1.0 },
  { id: 'car', nameEn: 'Sports Car', nameVi: 'Ô tô thể thao', emoji: '🚗', speedKmH: 240, weightKg: 1500, heightM: 1.4 },
  { id: 'train', nameEn: 'Bullet Train', nameVi: 'Tàu cao tốc', emoji: '🚄', speedKmH: 350, weightKg: 450000, heightM: 3.8 },
  { id: 'airplane', nameEn: 'Airplane', nameVi: 'Máy bay phản lực', emoji: '✈️', speedKmH: 900, weightKg: 80000, heightM: 12.0 },
];

export const ADJECTIVES_MAP: Record<ComparisonAttribute, { high: AdjectiveInfo; low: AdjectiveInfo }> = {
  speed: {
    high: { base: 'fast', comparative: 'faster than', superlative: 'the fastest', type: 'short', meaningVi: 'nhanh hơn / nhanh nhất' },
    low: { base: 'slow', comparative: 'slower than', superlative: 'the slowest', type: 'short', meaningVi: 'chậm hơn / chậm nhất' },
  },
  weight: {
    high: { base: 'heavy', comparative: 'heavier than', superlative: 'the heaviest', type: 'short', meaningVi: 'nặng hơn / nặng nhất' },
    low: { base: 'light', comparative: 'lighter than', superlative: 'the lightest', type: 'short', meaningVi: 'nhẹ hơn / nhẹ nhất' },
  },
  height: {
    high: { base: 'tall', comparative: 'taller than', superlative: 'the tallest', type: 'short', meaningVi: 'cao hơn / cao nhất' },
    low: { base: 'short', comparative: 'shorter than', superlative: 'the shortest', type: 'short', meaningVi: 'thấp hơn / thấp nhất' },
  },
};

/**
 * Sinh câu so sánh hơn và so sánh nhất tự động theo thời gian thực
 */
export function generateComparisonSentence(
  items: EntityItem[],
  itemAId: string,
  itemBId: string,
  attribute: ComparisonAttribute
): GeneratedSentence {
  const itemA = items.find(i => i.id === itemAId) || items[0];
  const itemB = items.find(i => i.id === itemBId) || items[1];

  let valA = 0;
  let valB = 0;

  if (attribute === 'speed') {
    valA = itemA.speedKmH;
    valB = itemB.speedKmH;
  } else if (attribute === 'weight') {
    valA = itemA.weightKg;
    valB = itemB.weightKg;
  } else {
    valA = itemA.heightM;
    valB = itemB.heightM;
  }

  const isAGreater = valA >= valB;
  const adj = isAGreater ? ADJECTIVES_MAP[attribute].high : ADJECTIVES_MAP[attribute].low;

  const subject = isAGreater ? itemA : itemB;
  const object = isAGreater ? itemB : itemA;

  // Câu so sánh hơn
  const comparativeEn = `The ${subject.nameEn.toLowerCase()} is ${adj.comparative} the ${object.nameEn.toLowerCase()}.`;
  const comparativeVi = `${subject.nameVi} ${adj.meaningVi.split('/')[0].trim()} ${object.nameVi.toLowerCase()}.`;

  // Tìm đối tượng có giá trị lớn nhất trong toàn bộ danh sách để sinh câu so sánh nhất
  let maxItem = items[0];
  let maxVal = -1;
  items.forEach(it => {
    const v = attribute === 'speed' ? it.speedKmH : attribute === 'weight' ? it.weightKg : it.heightM;
    if (v > maxVal) {
      maxVal = v;
      maxItem = it;
    }
  });

  const highAdj = ADJECTIVES_MAP[attribute].high;
  const superlativeEn = `The ${maxItem.nameEn.toLowerCase()} is ${highAdj.superlative} of all!`;
  const superlativeVi = `${maxItem.nameVi} là loài/phương tiện ${highAdj.meaningVi.split('/')[1]?.trim() || highAdj.meaningVi} trong tất cả!`;

  return {
    comparativeEn,
    comparativeVi,
    superlativeEn,
    superlativeVi,
    targetAdjective: adj,
  };
}

/**
 * Dữ liệu động từ quá khứ & tương lai
 */
export interface VerbTenseExample {
  base: string;
  past: string;
  pastSentence: string;
  pastSentenceVi: string;
  futureWill: string;
  futureWillSentence: string;
  futureWillSentenceVi: string;
  futureGoingTo: string;
  futureGoingToSentence: string;
  futureGoingToSentenceVi: string;
}

export const VERBS_DATA: VerbTenseExample[] = [
  {
    base: 'visit',
    past: 'visited',
    pastSentence: 'I visited Ha Long Bay last summer.',
    pastSentenceVi: 'Tôi đã đi thăm Vịnh Hạ Long vào mùa hè năm ngoái.',
    futureWill: 'will visit',
    futureWillSentence: 'I think I will visit Da Nang next year.',
    futureWillSentenceVi: 'Tôi nghĩ tôi sẽ đi thăm Đà Nẵng vào năm tới (Dự đoán).',
    futureGoingTo: 'am going to visit',
    futureGoingToSentence: 'I am going to visit my grandparents this weekend.',
    futureGoingToSentenceVi: 'Tôi dự định sẽ đi thăm ông bà vào cuối tuần này (Kế hoạch định trước).',
  },
  {
    base: 'travel',
    past: 'traveled',
    pastSentence: 'We traveled to Hanoi by train two days ago.',
    pastSentenceVi: 'Chúng tôi đã đi du lịch Hà Nội bằng tàu hỏa hai ngày trước.',
    futureWill: 'will travel',
    futureWillSentence: 'People will travel to Mars in the future.',
    futureWillSentenceVi: 'Con người sẽ du hành tới Sao Hỏa trong tương lai.',
    futureGoingTo: 'are going to travel',
    futureGoingToSentence: 'They are going to travel to Da Lat tomorrow morning.',
    futureGoingToSentenceVi: 'Họ dự định sẽ đi du lịch Đà Lạt vào sáng mai (Đã mua vé sẵn).',
  },
  {
    base: 'learn',
    past: 'learned',
    pastSentence: 'She learned English with the AI tutor yesterday.',
    pastSentenceVi: 'Cô ấy đã học tiếng Anh cùng gia sư AI ngày hôm qua.',
    futureWill: 'will learn',
    futureWillSentence: 'I will learn how to code when I grow up.',
    futureWillSentenceVi: 'Tôi sẽ học lập trình khi tôi lớn lên.',
    futureGoingTo: 'is going to learn',
    futureGoingToSentence: 'He is going to learn Spanish next month.',
    futureGoingToSentenceVi: 'Cậu ấy có kế hoạch bắt đầu học tiếng Tây Ban Nha vào tháng tới.',
  },
];

/**
 * Web Speech API Synthesis (Đọc to câu tiếng Anh giọng chuẩn bản xứ)
 */
export function speakSentence(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Tốc độ vừa phải cho học sinh lớp 7
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}
