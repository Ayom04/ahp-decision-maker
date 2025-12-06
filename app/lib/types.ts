export interface Criterion {
  id: string;
  name: string;
}

export type ComparisonMatrix = Record<string, Record<string, number>>;

export interface ResultData {
  weights: Record<string, number>;
  consistency: {
    lambdaMax: number;
    ci: number;
    cr: number;
    ri: number;
    isConsistent: boolean;
  };
  normalizedMatrix: ComparisonMatrix;
}

export interface AhpState {
  step: number;
  problem: string;
  criteria: Criterion[];
  matrix: ComparisonMatrix;
  results: ResultData | null;
}

export type AhpAction =
  | { type: "SET_PROBLEM"; payload: string }
  | { type: "SET_CRITERIA_COUNT"; payload: number }
  | { type: "UPDATE_CRITERION_NAME"; payload: { id: string; name: string } }
  | {
      type: "UPDATE_COMPARISON";
      payload: { rowId: string; colId: string; value: number };
    }
  | { type: "CALCULATE_RESULTS"; payload: ResultData }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" };
