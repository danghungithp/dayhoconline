export type AlgorithmMode = 'sorting' | 'binary-search';
export type SortAlgorithm = 'bubble' | 'selection' | 'insertion';

export interface ArrayElement {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted';
}

export interface AlgorithmsState {
  mode: AlgorithmMode;
  // Sorting mode
  sortAlgorithm: SortAlgorithm;
  array: ArrayElement[];
  isPlaying: boolean;
  speedMs: number; // 100 to 1000 ms
  stepCount: number;
  comparisonsCount: number;
  swapsCount: number;
  isSorted: boolean;

  // Binary search mode
  searchArray: number[];
  targetValue: number;
  leftIndex: number;
  rightIndex: number;
  midIndex: number;
  searchFoundIndex: number | null; // null nếu chưa thấy hoặc không có
  flowchartStep: 'start' | 'calc-mid' | 'compare-equal' | 'branch' | 'found' | 'not-found';
}
