export interface Criterion {
  id: string;
  name: string;
}

export interface Alternative {
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
  alternativeRankings?: Record<string, number>;
}

export interface AhpState {
  step: number;
  problem: string;
  criteria: Criterion[];
  alternatives: Alternative[];
  matrix: ComparisonMatrix; // For criteria
  alternativeMatrices: Record<string, ComparisonMatrix>; // specific criterion id -> alternatives matrix
  results: ResultData | null;
}

export type AhpAction =
  | { type: "SET_PROBLEM"; payload: string }
  | { type: "SET_CRITERIA_COUNT"; payload: number }
  | { type: "UPDATE_CRITERION_NAME"; payload: { id: string; name: string } }
  | { type: "SET_ALTERNATIVES_COUNT"; payload: number }
  | { type: "UPDATE_ALTERNATIVE_NAME"; payload: { id: string; name: string } }
  | {
      type: "UPDATE_COMPARISON";
      payload: { rowId: string; colId: string; value: number };
    }
  | {
      type: "UPDATE_ALTERNATIVE_COMPARISON";
      payload: {
        criterionId: string;
        rowId: string;
        colId: string;
        value: number;
      };
    }
  | { type: "CALCULATE_RESULTS"; payload: ResultData }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" };
