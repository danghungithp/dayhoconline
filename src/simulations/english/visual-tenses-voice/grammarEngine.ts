export type TenseId =
  | 'present-simple'
  | 'present-continuous'
  | 'past-simple'
  | 'past-continuous'
  | 'present-perfect'
  | 'past-perfect'
  | 'future-simple'
  | 'future-continuous';

export type SchoolLevel = 'THCS' | 'THPT';

export interface TenseData {
  id: TenseId;
  nameEn: string;
  nameVi: string;
  level: SchoolLevel;
  formula: {
    affirmative: string;
    negative: string;
    interrogative: string;
  };
  timelineVisual: {
    type: 'repeated' | 'ongoing-now' | 'past-point' | 'ongoing-past' | 'past-to-now' | 'before-past' | 'future-point' | 'ongoing-future';
    zone: 'PAST' | 'NOW' | 'FUTURE' | 'PAST-TO-NOW' | 'BEFORE-PAST';
    descriptionVi: string;
  };
  signals: string[];
  examples: {
    positive: string;
    negative: string;
    question: string;
    translationVi: string;
  };
  vietnamesePitfalls: string; // Lỗi học sinh Việt Nam hay mắc phải
}

export interface IrregularVerb {
  base: string;       // V1
  past: string;       // V2
  pastParticiple: string; // V3
  meaningVi: string;
}

export const IRREGULAR_VERBS: Record<string, IrregularVerb> = {
  write: { base: 'write', past: 'wrote', pastParticiple: 'written', meaningVi: 'viết' },
  build: { base: 'build', past: 'built', pastParticiple: 'built', meaningVi: 'xây dựng' },
  make: { base: 'make', past: 'made', pastParticiple: 'made', meaningVi: 'làm / chế tạo' },
  take: { base: 'take', past: 'took', pastParticiple: 'taken', meaningVi: 'lấy / chụp' },
  eat: { base: 'eat', past: 'ate', pastParticiple: 'eaten', meaningVi: 'ăn' },
  send: { base: 'send', past: 'sent', pastParticiple: 'sent', meaningVi: 'gửi' },
  clean: { base: 'clean', past: 'cleaned', pastParticiple: 'cleaned', meaningVi: 'dọn dẹp' },
  break: { base: 'break', past: 'broke', pastParticiple: 'broken', meaningVi: 'làm vỡ / hỏng' },
  paint: { base: 'paint', past: 'painted', pastParticiple: 'painted', meaningVi: 'sơn / vẽ' },
  cook: { base: 'cook', past: 'cooked', pastParticiple: 'cooked', meaningVi: 'nấu' },
  plant: { base: 'plant', past: 'planted', pastParticiple: 'planted', meaningVi: 'trồng' },
  invent: { base: 'invent', past: 'invented', pastParticiple: 'invented', meaningVi: 'phát minh' },
};

export const TENSES_DATA: Record<TenseId, TenseData> = {
  'present-simple': {
    id: 'present-simple',
    nameEn: 'Present Simple Tense',
    nameVi: 'Thì Hiện tại đơn',
    level: 'THCS',
    formula: {
      affirmative: 'S + V(s/es) + O',
      negative: 'S + do/does not + V-inf + O',
      interrogative: 'Do/Does + S + V-inf + O?',
    },
    timelineVisual: {
      type: 'repeated',
      zone: 'PAST-TO-NOW',
      descriptionVi: 'Các chấm lặp đi lặp lại đều đặn xuyên suốt quá khứ, hiện tại và tương lai (thói quen, chân lý khoa học).',
    },
    signals: ['always', 'usually', 'often', 'sometimes', 'never', 'every day / week', 'on Mondays'],
    examples: {
      positive: 'She writes letters every Sunday.',
      negative: 'She does not write letters every Sunday.',
      question: 'Does she write letters every Sunday?',
      translationVi: 'Cô ấy viết thư vào mỗi Chủ nhật (thói quen định kỳ).',
    },
    vietnamesePitfalls: 'Học sinh hay quên thêm "-s" hoặc "-es" khi chủ ngữ là ngôi thứ 3 số ít (He, She, It, danh từ số ít).',
  },
  'present-continuous': {
    id: 'present-continuous',
    nameEn: 'Present Continuous Tense',
    nameVi: 'Thì Hiện tại tiếp diễn',
    level: 'THCS',
    formula: {
      affirmative: 'S + am/is/are + V-ing + O',
      negative: 'S + am/is/are not + V-ing + O',
      interrogative: 'Am/Is/Are + S + V-ing + O?',
    },
    timelineVisual: {
      type: 'ongoing-now',
      zone: 'NOW',
      descriptionVi: 'Một đoạn sóng uốn lượn diễn ra ngay tại thời điểm mốc NOW (đang xảy ra xung quanh lúc nói).',
    },
    signals: ['now', 'at the moment', 'right now', 'Look!', 'Listen!', 'at present'],
    examples: {
      positive: 'They are building a new bridge right now.',
      negative: 'They are not building a new bridge right now.',
      question: 'Are they building a new bridge right now?',
      translationVi: 'Họ đang xây dựng một cây cầu mới ngay lúc này.',
    },
    vietnamesePitfalls: 'Quên động từ "to be" (viết nhầm thành "They building...") hoặc dùng thì này với các động từ chỉ tri giác/sở hữu (know, like, have).',
  },
  'past-simple': {
    id: 'past-simple',
    nameEn: 'Past Simple Tense',
    nameVi: 'Thì Quá khứ đơn',
    level: 'THCS',
    formula: {
      affirmative: 'S + V2/V-ed + O',
      negative: 'S + did not + V-inf + O',
      interrogative: 'Did + S + V-inf + O?',
    },
    timelineVisual: {
      type: 'past-point',
      zone: 'PAST',
      descriptionVi: 'Một điểm đánh dấu chữ X rõ ràng tại một mốc xác định trong Quá khứ, đã chấm dứt hoàn toàn.',
    },
    signals: ['yesterday', 'last night / week / year', 'in 2010', 'ago (2 days ago)'],
    examples: {
      positive: 'He wrote an interesting book last year.',
      negative: 'He did not write an interesting book last year.',
      question: 'Did he write an interesting book last year?',
      translationVi: 'Anh ấy đã viết một cuốn sách thú vị vào năm ngoái (đã hoàn thành trong quá khứ).',
    },
    vietnamesePitfalls: 'Sau trợ động từ "did not" hoặc "did ... ?" vẫn giữ nguyên V2 thay vì đưa về động từ nguyên mẫu (V-inf).',
  },
  'past-continuous': {
    id: 'past-continuous',
    nameEn: 'Past Continuous Tense',
    nameVi: 'Thì Quá khứ tiếp diễn',
    level: 'THCS',
    formula: {
      affirmative: 'S + was/were + V-ing + O',
      negative: 'S + was/were not + V-ing + O',
      interrogative: 'Was/Were + S + V-ing + O?',
    },
    timelineVisual: {
      type: 'ongoing-past',
      zone: 'PAST',
      descriptionVi: 'Một đoạn kéo dài liên tục xung quanh một thời điểm xác định trong quá khứ (ví dụ: lúc 8h tối qua).',
    },
    signals: ['at 8 PM yesterday', 'at this time last week', 'when / while + S + was V-ing'],
    examples: {
      positive: 'We were eating dinner at 7 PM yesterday.',
      negative: 'We were not eating dinner at 7 PM yesterday.',
      question: 'Were you eating dinner at 7 PM yesterday?',
      translationVi: 'Chúng tôi đang ăn tối vào lúc 7 giờ tối hôm qua (thời điểm xác định trong quá khứ).',
    },
    vietnamesePitfalls: 'Nhầm lẫn giữa "was" (dùng cho I, He, She, It) và "were" (dùng cho You, We, They).',
  },
  'present-perfect': {
    id: 'present-perfect',
    nameEn: 'Present Perfect Tense',
    nameVi: 'Thì Hiện tại hoàn thành',
    level: 'THCS',
    formula: {
      affirmative: 'S + have/has + V3/V-ed + O',
      negative: 'S + have/has not + V3/V-ed + O',
      interrogative: 'Have/Has + S + V3/V-ed + O?',
    },
    timelineVisual: {
      type: 'past-to-now',
      zone: 'PAST-TO-NOW',
      descriptionVi: 'Một mũi tên cầu nối bắt đầu từ quá khứ kéo dài chạm đến vạch NOW, hoặc có kết quả để lại ở hiện tại.',
    },
    signals: ['already', 'yet', 'just', 'ever', 'never', 'since + mốc', 'for + khoảng', 'so far'],
    examples: {
      positive: 'They have built three schools since 2020.',
      negative: 'They have not built three schools since 2020.',
      question: 'Have they built three schools since 2020?',
      translationVi: 'Họ đã xây dựng 3 ngôi trường kể từ năm 2020 (hành động kéo dài đến nay).',
    },
    vietnamesePitfalls: 'Dùng nhầm "since" (mốc thời gian: since 2020) với "for" (khoảng thời gian: for 3 years), hoặc nhầm sang Past Simple khi có mốc thời gian cụ thể.',
  },
  'past-perfect': {
    id: 'past-perfect',
    nameEn: 'Past Perfect Tense',
    nameVi: 'Thì Quá khứ hoàn thành',
    level: 'THPT',
    formula: {
      affirmative: 'S + had + V3/V-ed + O',
      negative: 'S + had not + V3/V-ed + O',
      interrogative: 'Had + S + V3/V-ed + O?',
    },
    timelineVisual: {
      type: 'before-past',
      zone: 'BEFORE-PAST',
      descriptionVi: 'Hành động xảy ra và kết thúc TRƯỚC một hành động hoặc mốc thời gian khác trong quá khứ (Quá khứ của quá khứ).',
    },
    signals: ['by the time', 'before + past simple', 'after + past perfect', 'by 2015'],
    examples: {
      positive: 'She had sent the email before the manager asked.',
      negative: 'She had not sent the email before the manager asked.',
      question: 'Had she sent the email before the manager asked?',
      translationVi: 'Cô ấy đã gửi email trước khi người quản lý yêu cầu.',
    },
    vietnamesePitfalls: 'Chia nhầm cả 2 vế câu về Past Simple thay vì vế xảy ra trước dùng Past Perfect (had + V3).',
  },
  'future-simple': {
    id: 'future-simple',
    nameEn: 'Future Simple Tense',
    nameVi: 'Thì Tương lai đơn',
    level: 'THCS',
    formula: {
      affirmative: 'S + will + V-inf + O',
      negative: 'S + will not (won\'t) + V-inf + O',
      interrogative: 'Will + S + V-inf + O?',
    },
    timelineVisual: {
      type: 'future-point',
      zone: 'FUTURE',
      descriptionVi: 'Một điểm đánh dấu trong tương lai (quyết định bộc phát tại thời điểm nói hoặc dự đoán không có căn cứ).',
    },
    signals: ['tomorrow', 'next week / month', 'in the future', 'I think / hope'],
    examples: {
      positive: 'The robot will clean the room tomorrow.',
      negative: 'The robot will not clean the room tomorrow.',
      question: 'Will the robot clean the room tomorrow?',
      translationVi: 'Người máy sẽ dọn dẹp căn phòng vào ngày mai.',
    },
    vietnamesePitfalls: 'Sau "will" dùng động từ thêm "to" hoặc chia thì (viết sai thành "will writes" hay "will to clean").',
  },
  'future-continuous': {
    id: 'future-continuous',
    nameEn: 'Future Continuous Tense',
    nameVi: 'Thì Tương lai tiếp diễn',
    level: 'THPT',
    formula: {
      affirmative: 'S + will be + V-ing + O',
      negative: 'S + will not be + V-ing + O',
      interrogative: 'Will + S + be + V-ing + O?',
    },
    timelineVisual: {
      type: 'ongoing-future',
      zone: 'FUTURE',
      descriptionVi: 'Hành động sẽ đang diễn ra tại một thời điểm hoặc khoảng thời gian xác định trong tương lai.',
    },
    signals: ['at 10 AM tomorrow', 'at this time next week', 'this time tomorrow'],
    examples: {
      positive: 'They will be painting the house at 9 AM tomorrow.',
      negative: 'They will not be painting the house at 9 AM tomorrow.',
      question: 'Will they be painting the house at 9 AM tomorrow?',
      translationVi: 'Họ sẽ đang sơn ngôi nhà vào lúc 9 giờ sáng ngày mai.',
    },
    vietnamesePitfalls: 'Quên từ "be" sau "will" (viết nhầm thành "will painting").',
  },
};

// =========================================================================
// CHẾ ĐỘ 2: ACTIVE ↔ PASSIVE TRANSFORMER ENGINE
// =========================================================================

export interface PassiveTransformRule {
  tenseName: string;
  activeVerbForm: string;
  passiveBeForm: (isPlural: boolean) => string;
  exampleActive: {
    subject: string;
    verb: string;
    object: string;
    adverb: string;
    verbBase: string;
  };
}

export interface SentenceComponents {
  subject: string;
  verb: string;
  object: string;
  adverb?: string;
}

export interface TransformedPassiveResult {
  passiveSubject: string;
  beForm: string;
  pastParticiple: string;
  byAgent: string;
  adverb: string;
  fullPassiveSentence: string;
  explanationSteps: string[];
}

export const PASSIVE_TEMPLATES: Record<string, PassiveTransformRule> = {
  'present-simple': {
    tenseName: 'Present Simple',
    activeVerbForm: 'V(s/es)',
    passiveBeForm: isPlural => (isPlural ? 'are' : 'is'),
    exampleActive: {
      subject: 'She',
      verb: 'writes',
      object: 'the letters',
      adverb: 'every day',
      verbBase: 'write',
    },
  },
  'past-simple': {
    tenseName: 'Past Simple',
    activeVerbForm: 'V2 / V-ed',
    passiveBeForm: isPlural => (isPlural ? 'were' : 'was'),
    exampleActive: {
      subject: 'The workers',
      verb: 'built',
      object: 'a new school',
      adverb: 'last year',
      verbBase: 'build',
    },
  },
  'present-continuous': {
    tenseName: 'Present Continuous',
    activeVerbForm: 'am/is/are + V-ing',
    passiveBeForm: isPlural => (isPlural ? 'are being' : 'is being'),
    exampleActive: {
      subject: 'The chef',
      verb: 'is making',
      object: 'a delicious cake',
      adverb: 'right now',
      verbBase: 'make',
    },
  },
  'past-continuous': {
    tenseName: 'Past Continuous',
    activeVerbForm: 'was/were + V-ing',
    passiveBeForm: isPlural => (isPlural ? 'were being' : 'was being'),
    exampleActive: {
      subject: 'The police',
      verb: 'were taking',
      object: 'the photos',
      adverb: 'at 8 PM yesterday',
      verbBase: 'take',
    },
  },
  'present-perfect': {
    tenseName: 'Present Perfect',
    activeVerbForm: 'have/has + V3',
    passiveBeForm: isPlural => (isPlural ? 'have been' : 'has been'),
    exampleActive: {
      subject: 'The company',
      verb: 'has sent',
      object: 'the important documents',
      adverb: 'already',
      verbBase: 'send',
    },
  },
  'future-simple': {
    tenseName: 'Future Simple',
    activeVerbForm: 'will + V-inf',
    passiveBeForm: () => 'will be',
    exampleActive: {
      subject: 'The students',
      verb: 'will clean',
      object: 'the classroom',
      adverb: 'tomorrow',
      verbBase: 'clean',
    },
  },
  'modal-can': {
    tenseName: 'Modal Verb (Can)',
    activeVerbForm: 'can + V-inf',
    passiveBeForm: () => 'can be',
    exampleActive: {
      subject: 'Everyone',
      verb: 'can solve',
      object: 'this math problem',
      adverb: 'easily',
      verbBase: 'clean', // standard base
    },
  },
  'modal-must': {
    tenseName: 'Modal Verb (Must)',
    activeVerbForm: 'must + V-inf',
    passiveBeForm: () => 'must be',
    exampleActive: {
      subject: 'The students',
      verb: 'must finish',
      object: 'the homework',
      adverb: 'before Friday',
      verbBase: 'clean',
    },
  },
};

/**
 * Kiểm tra xem tân ngữ (Object) có phải danh từ số nhiều hay không
 */
export function isPluralNoun(noun: string): boolean {
  const clean = noun.trim().toLowerCase();
  if (['people', 'children', 'men', 'women', 'police', 'mice', 'feet'].includes(clean)) return true;
  if (clean.endsWith('s') && !['news', 'mathematics', 'physics'].includes(clean)) return true;
  return false;
}

/**
 * Biến đổi đại từ nhân xưng từ Chủ ngữ sang Tân ngữ (e.g. He -> him, She -> her)
 */
export function convertPronounToAgent(subject: string): string {
  const mapping: Record<string, string> = {
    I: 'by me',
    He: 'by him',
    She: 'by her',
    They: 'by them',
    We: 'by us',
    You: 'by you',
    It: 'by it',
    he: 'by him',
    she: 'by her',
    they: 'by them',
    we: 'by us',
    everyone: '', // Bỏ 'by someone/everyone' trong câu bị động chuẩn
    someone: '',
    people: '',
  };

  const trimmed = subject.trim();
  if (mapping[trimmed] !== undefined) {
    return mapping[trimmed];
  }
  return `by ${trimmed}`;
}

/**
 * Hàm biến đổi câu Chủ động sang Bị động với giải thích từng bước
 */
export function transformActiveToPassive(
  ruleKey: string,
  verbBase: string,
  customSubject?: string,
  customObject?: string,
  customAdverb?: string
): TransformedPassiveResult {
  const rule = PASSIVE_TEMPLATES[ruleKey] || PASSIVE_TEMPLATES['present-simple'];
  const subj = (customSubject || rule.exampleActive.subject).trim();
  const obj = (customObject || rule.exampleActive.object).trim();
  const adv = (customAdverb || rule.exampleActive.adverb).trim();
  const base = verbBase || rule.exampleActive.verbBase;

  // 1. Tân ngữ câu chủ động thành Chủ ngữ câu bị động (viết hoa chữ đầu)
  const passiveSubject = obj.charAt(0).toUpperCase() + obj.slice(1);
  const isPlural = isPluralNoun(obj);

  // 2. Chia dạng động từ "to be" theo thì và số ít/số nhiều của tân ngữ mới
  const beForm = rule.passiveBeForm(isPlural);

  // 3. Động từ chính chuyển sang Quá khứ phân từ V3/V-ed
  const irregular = IRREGULAR_VERBS[base.toLowerCase()];
  const pastParticiple = irregular ? irregular.pastParticiple : (base.endsWith('e') ? `${base}d` : `${base}ed`);

  // 4. Chủ ngữ câu chủ động chuyển thành "by + tác nhân"
  const byAgent = convertPronounToAgent(subj);

  // 5. Ghép câu bị động hoàn chỉnh
  const parts = [passiveSubject, beForm, pastParticiple];
  if (byAgent) parts.push(byAgent);
  if (adv) parts.push(adv);
  const fullPassiveSentence = `${parts.join(' ')}.`;

  // Các bước giải thích sư phạm trực quan
  const explanationSteps = [
    `Bước 1: Chuyển tân ngữ "${obj}" lên đầu làm Chủ ngữ câu bị động "${passiveSubject}" (${isPlural ? 'Danh từ số nhiều' : 'Danh từ số ít'}).`,
    `Bước 2: Chia động từ "to be" ở thì ${rule.tenseName}: Dùng "${beForm}".`,
    `Bước 3: Đưa động từ chính "${base}" về dạng V3/V-ed: "${pastParticiple}" ${irregular ? `(Động từ bất quy tắc: ${irregular.base} - ${irregular.past} - ${irregular.pastParticiple})` : '(Động từ có quy tắc thêm -ed)'}.`,
    byAgent ? `Bước 4: Đưa chủ ngữ "${subj}" về sau thành tác nhân "${byAgent}".` : `Bước 4: Tác nhân không xác định ("${subj}") nên được lược bỏ theo chuẩn ngữ pháp.`,
  ];

  return {
    passiveSubject,
    beForm,
    pastParticiple,
    byAgent,
    adverb: adv,
    fullPassiveSentence,
    explanationSteps,
  };
}
