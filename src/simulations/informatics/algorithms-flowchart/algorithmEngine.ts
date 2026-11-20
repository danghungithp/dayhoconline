import { ArrayElement, SortAlgorithm } from './types';

export function generateRandomArray(size: number = 14): ArrayElement[] {
  const arr: ArrayElement[] = [];
  for (let i = 0; i < size; i++) {
    arr.push({
      value: Math.floor(Math.random() * 85) + 10,
      state: 'default',
    });
  }
  return arr;
}

export function generateSortedArray(size: number = 15): number[] {
  const set = new Set<number>();
  while (set.size < size) {
    set.add(Math.floor(Math.random() * 95) + 5);
  }
  return Array.from(set).sort((a, b) => a - b);
}

export interface SortStepResult {
  array: ArrayElement[];
  comparisonsCount: number;
  swapsCount: number;
  isSorted: boolean;
}

// Thực hiện 1 bước (step) của thuật toán sắp xếp
export function stepSortAlgorithm(
  arr: ArrayElement[],
  algorithm: SortAlgorithm,
  stepIdx: number,
  prevComparisons: number,
  prevSwaps: number
): SortStepResult {
  const n = arr.length;
  const newArr: ArrayElement[] = arr.map((item) => ({
    value: item.value,
    state: item.state === 'sorted' ? ('sorted' as const) : ('default' as const),
  }));

  if (algorithm === 'bubble') {
    // Bubble sort: tìm cặp phần tử nghịch thế
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (newArr[j].value > newArr[j + 1].value) {
          // Đánh dấu hoán đổi
          newArr[j].state = 'swapping';
          newArr[j + 1].state = 'swapping';
          const temp = newArr[j];
          newArr[j] = newArr[j + 1];
          newArr[j + 1] = temp;
          return {
            array: newArr,
            comparisonsCount: prevComparisons + 1,
            swapsCount: prevSwaps + 1,
            isSorted: false,
          };
        }
      }
    }
    // Đã sắp xếp xong
    return {
      array: newArr.map((item) => ({ value: item.value, state: 'sorted' as const })),
      comparisonsCount: prevComparisons,
      swapsCount: prevSwaps,
      isSorted: true,
    };
  }

  if (algorithm === 'selection') {
    // Selection sort
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (newArr[j].value < newArr[minIdx].value) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        newArr[i].state = 'swapping';
        newArr[minIdx].state = 'swapping';
        const temp = newArr[i];
        newArr[i] = newArr[minIdx];
        newArr[minIdx] = temp;
        newArr[i].state = 'sorted';
        return {
          array: newArr,
          comparisonsCount: prevComparisons + (n - i - 1),
          swapsCount: prevSwaps + 1,
          isSorted: false,
        };
      } else {
        newArr[i].state = 'sorted';
      }
    }
    return {
      array: newArr.map((item) => ({ value: item.value, state: 'sorted' as const })),
      comparisonsCount: prevComparisons,
      swapsCount: prevSwaps,
      isSorted: true,
    };
  }

  // Insertion sort fallback
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0 && newArr[j].value < newArr[j - 1].value) {
      newArr[j].state = 'swapping';
      newArr[j - 1].state = 'swapping';
      const temp = newArr[j];
      newArr[j] = newArr[j - 1];
      newArr[j - 1] = temp;
      return {
        array: newArr,
        comparisonsCount: prevComparisons + 1,
        swapsCount: prevSwaps + 1,
        isSorted: false,
      };
    }
  }

  return {
    array: newArr.map((item) => ({ value: item.value, state: 'sorted' as const })),
    comparisonsCount: prevComparisons,
    swapsCount: prevSwaps,
    isSorted: true,
  };
}
