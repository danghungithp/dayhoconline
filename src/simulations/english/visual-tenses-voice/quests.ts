import { TenseId } from './grammarEngine';

export interface EnglishSimulationState {
  mode: 'timeline' | 'transformer';
  selectedTense: TenseId;
  passiveTenseKey: string;
  isPassiveVoice: boolean;
  selectedVerbBase: string;
  hasListenedAudio: boolean;
}

export interface EnglishQuest {
  id: string;
  title: string;
  description: string;
  hint: string;
  xpReward: number;
  checkCompleted: (state: EnglishSimulationState) => boolean;
  targetCondition: (state: any) => boolean;
}

export const ENGLISH_QUESTS: EnglishQuest[] = [
  {
    id: 'quest-past-continuous',
    title: 'Nhiệm vụ 1: Hành động tiếp diễn tại mốc quá khứ',
    description: 'Chuyển sang "Trục thời gian các thì" và chọn đúng thì diễn tả hành động đang xảy ra tại một thời điểm xác định trong quá khứ (Past Continuous).',
    hint: 'Chọn thì "Past Continuous Tense" (Quá khứ tiếp diễn: S + was/were + V-ing) trên danh sách các thì.',
    xpReward: 30,
    checkCompleted: state => {
      return state.mode === 'timeline' && state.selectedTense === 'past-continuous';
    },
    targetCondition: (state: any) => {
      return state.mode === 'timeline' && state.selectedTense === 'past-continuous';
    },
  },
  {
    id: 'quest-present-perfect-bridge',
    title: 'Nhiệm vụ 2: Cầu nối quá khứ - hiện tại (Present Perfect)',
    description: 'Chọn thì diễn tả hành động bắt đầu từ quá khứ kéo dài đến hiện tại hoặc để lại kết quả ở hiện tại (Present Perfect Tense).',
    hint: 'Chọn thì "Present Perfect Tense" (Hiện tại hoàn thành: S + have/has + V3) trên trục thời gian.',
    xpReward: 35,
    checkCompleted: state => {
      return state.mode === 'timeline' && state.selectedTense === 'present-perfect';
    },
    targetCondition: (state: any) => {
      return state.mode === 'timeline' && state.selectedTense === 'present-perfect';
    },
  },
  {
    id: 'quest-transform-simple',
    title: 'Nhiệm vụ 3: Chuyển đổi Bị động thì Đơn (Present / Past Simple)',
    description: 'Chuyển sang tab "Biến đổi Chủ động ↔ Bị động" và kích hoạt thành công dạng bị động của thì Hiện tại đơn hoặc Quá khứ đơn.',
    hint: 'Nhấp sang tab "Chủ động ↔ Bị động", chọn thì Present Simple hoặc Past Simple rồi bật công tắc "Câu bị động (Passive)".',
    xpReward: 40,
    checkCompleted: state => {
      return (
        state.mode === 'transformer' &&
        state.isPassiveVoice &&
        (state.passiveTenseKey === 'present-simple' || state.passiveTenseKey === 'past-simple')
      );
    },
    targetCondition: (state: any) => {
      return (
        state.mode === 'transformer' &&
        state.isPassiveVoice &&
        (state.passiveTenseKey === 'present-simple' || state.passiveTenseKey === 'past-simple')
      );
    },
  },
  {
    id: 'quest-modal-passive',
    title: 'Nhiệm vụ 4: Câu bị động với Động từ khuyết thiếu (Modal Verbs)',
    description: 'Thực hiện chuyển đổi câu bị động với động từ khuyết thiếu dạng "modal + be + V3" (ví dụ: can be / must be / will be).',
    hint: 'Trong chế độ Transformer, chọn thì "Modal Verb (Can)" hoặc "Modal Verb (Must)" và bấm nghe đọc mẫu câu bị động!',
    xpReward: 45,
    checkCompleted: state => {
      return (
        state.mode === 'transformer' &&
        state.isPassiveVoice &&
        (state.passiveTenseKey === 'modal-can' || state.passiveTenseKey === 'modal-must' || state.passiveTenseKey === 'future-simple')
      );
    },
    targetCondition: (state: any) => {
      return (
        state.mode === 'transformer' &&
        state.isPassiveVoice &&
        (state.passiveTenseKey === 'modal-can' || state.passiveTenseKey === 'modal-must' || state.passiveTenseKey === 'future-simple')
      );
    },
  },
];
