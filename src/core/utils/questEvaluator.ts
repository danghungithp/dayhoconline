import { 
  CustomQuestItem, 
  QuestEvaluationResult, 
  AssignmentEvaluationSummary,
  ConditionEvaluationResult
} from '../../types/assignment.types';

/**
 * Đánh giá tự động bộ nhiệm vụ theo thời gian thực (Pure evaluation function)
 */
export function evaluateAssignmentQuests(
  quests: CustomQuestItem[],
  state: {
    parameters: Record<string, any>;
    calculatedOutputs: Record<string, any>;
  }
): AssignmentEvaluationSummary {
  let totalScore = 0;
  let maxScore = 0;

  const results: QuestEvaluationResult[] = quests.map(quest => {
    maxScore += quest.points;

    const conditionResults: ConditionEvaluationResult[] = quest.conditions.map(cond => {
      const sourceObj = cond.source === 'parameters' ? state.parameters : state.calculatedOutputs;
      const actual = sourceObj ? sourceObj[cond.fieldKey] : undefined;
      const expected = cond.value;

      let met = false;
      switch (cond.operator) {
        case 'eq':
          met = actual === expected;
          break;
        case 'neq':
          met = actual !== expected;
          break;
        case 'gt':
          met = typeof actual === 'number' && actual > expected;
          break;
        case 'gte':
          met = typeof actual === 'number' && actual >= expected;
          break;
        case 'lt':
          met = typeof actual === 'number' && actual < expected;
          break;
        case 'lte':
          met = typeof actual === 'number' && actual <= expected;
          break;
        case 'in':
          met = Array.isArray(expected) && expected.includes(actual);
          break;
        default:
          met = actual === expected;
      }

      return {
        conditionId: cond.id,
        met,
        actualValue: actual,
      };
    });

    const isCompleted =
      conditionResults.length > 0 &&
      (quest.logic === 'ANY'
        ? conditionResults.some(c => c.met)
        : conditionResults.every(c => c.met));

    const score = isCompleted ? quest.points : 0;
    totalScore += score;

    return {
      questId: quest.id,
      completed: isCompleted,
      score,
      conditionResults,
    };
  });

  const isAllCompleted = results.length > 0 && results.every(r => r.completed);

  return {
    isAllCompleted,
    totalScore,
    maxScore,
    results,
  };
}
