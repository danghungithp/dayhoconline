export type ComparativeCategory = 'animals' | 'vehicles';
export type ComparisonAttribute = 'speed' | 'weight' | 'height';

export interface EntityItem {
  id: string;
  nameEn: string;
  nameVi: string;
  emoji: string;
  speedKmH: number; // Tốc độ
  weightKg: number; // Cân nặng
  heightM: number;  // Chiều cao
}

export interface AdjectiveInfo {
  base: string;
  comparative: string;
  superlative: string;
  type: 'short' | 'long' | 'irregular';
  meaningVi: string;
}

export interface PastFutureState {
  activeTab: 'comparatives' | 'past-future';

  // Chế độ so sánh
  category: ComparativeCategory;
  itemAId: string;
  itemBId: string;
  attribute: ComparisonAttribute;
  showSuperlative: boolean;

  // Chế độ Quá khứ & Tương lai
  selectedTense: 'past-simple' | 'future-will' | 'future-going-to';
  verbBase: string; // ví dụ: go, buy, visit, travel, learn
  speechFeedback: string | null;
  isListening: boolean;
  score: number;
}

export interface GeneratedSentence {
  comparativeEn: string;
  comparativeVi: string;
  superlativeEn: string;
  superlativeVi: string;
  targetAdjective: AdjectiveInfo;
}
