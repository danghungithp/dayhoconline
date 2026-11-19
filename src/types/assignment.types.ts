/**
 * Định nghĩa kiểu dữ liệu cho bài tập, nhiệm vụ tùy biến và bộ đánh giá tự động (Quest Evaluator)
 */

export type ConditionOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in';

export interface QuestCondition {
  id: string;
  source: 'parameters' | 'calculatedOutputs';
  fieldKey: string;
  fieldLabel: string;
  operator: ConditionOperator;
  value: any;
}

export interface CustomQuestItem {
  id: string;
  title: string;
  instruction: string;
  points: number;
  logic: 'ALL' | 'ANY';
  conditions: QuestCondition[];
  hint?: string;
}

export interface ConditionEvaluationResult {
  conditionId: string;
  met: boolean;
  actualValue: any;
}

export interface QuestEvaluationResult {
  questId: string;
  completed: boolean;
  score: number;
  conditionResults: ConditionEvaluationResult[];
}

export interface AssignmentEvaluationSummary {
  isAllCompleted: boolean;
  totalScore: number;
  maxScore: number;
  results: QuestEvaluationResult[];
}
