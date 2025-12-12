import { ComparisonMatrix, Criterion, ResultData } from "./types";

const RI_TABLE: Record<number, number> = {
  1: 0.0,
  2: 0.0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
  11: 1.51,
  12: 1.54,
  13: 1.56,
  14: 1.57,
  15: 1.59,
};

export function generateMatrix(items: { id: string }[]): ComparisonMatrix {
  const matrix: ComparisonMatrix = {};
  items.forEach((row) => {
    matrix[row.id] = {};
    items.forEach((col) => {
      matrix[row.id][col.id] = row.id === col.id ? 1 : 0; // 0 indicates unfilled
    });
  });
  return matrix;
}

export function calculateResults(
  matrix: ComparisonMatrix,
  items: { id: string }[]
): ResultData {
  const n = items.length;
  const ids = items.map((c) => c.id);

  // 1. Column Sums
  const colSums: Record<string, number> = {};
  ids.forEach((colId) => {
    let sum = 0;
    ids.forEach((rowId) => {
      sum += matrix[rowId][colId];
    });
    colSums[colId] = sum;
  });

  // 2. Normalize Matrix
  const normalizedMatrix: ComparisonMatrix = {};
  ids.forEach((rowId) => {
    normalizedMatrix[rowId] = {};
    ids.forEach((colId) => {
      normalizedMatrix[rowId][colId] = matrix[rowId][colId] / colSums[colId];
    });
  });

  // 3. Calculate Weights (Priority Vector)
  const weights: Record<string, number> = {};
  ids.forEach((rowId) => {
    let rowSum = 0;
    ids.forEach((colId) => {
      rowSum += normalizedMatrix[rowId][colId];
    });
    weights[rowId] = rowSum / n;
  });

  // 4. Calculate Consistency
  // Weighted Sum Vector = Matrix * Weights
  const weightedSumVector: Record<string, number> = {};
  ids.forEach((rowId) => {
    let sum = 0;
    ids.forEach((colId) => {
      sum += matrix[rowId][colId] * weights[colId];
    });
    weightedSumVector[rowId] = sum;
  });

  // Lambda Max = Average of (Weighted Sum / Weight)
  let lambdaMaxSum = 0;
  ids.forEach((id) => {
    lambdaMaxSum += weightedSumVector[id] / weights[id];
  });
  const lambdaMax = lambdaMaxSum / n;

  const ci = (lambdaMax - n) / (n - 1);
  const ri = RI_TABLE[n] || 1.59; // Default to max if out of bounds (though limited to 15)
  const cr = ri === 0 ? 0 : ci / ri;

  return {
    weights,
    consistency: {
      lambdaMax,
      ci,
      cr,
      ri,
      isConsistent: cr < 0.1,
    },
    normalizedMatrix,
  };
}

export function calculateGlobalPriorities(
  criteriaWeights: Record<string, number>,
  alternativeMatrices: Record<string, ComparisonMatrix>,
  alternatives: { id: string }[],
  criteria: { id: string }[]
): Record<string, number> {
  // 1. Calculate local priorities for alternatives for EACH criterion
  const localPriorities: Record<string, Record<string, number>> = {}; // criterionId -> { altId -> score }

  criteria.forEach((crit) => {
    const mat = alternativeMatrices[crit.id];
    if (mat) {
      const res = calculateResults(mat, itemsNameSafe(alternatives));
      localPriorities[crit.id] = res.weights;
    } else {
      localPriorities[crit.id] = {};
      alternatives.forEach(
        (a) => (localPriorities[crit.id][a.id] = 1 / alternatives.length)
      );
    }
  });

  // 2. Aggregate
  const globalScores: Record<string, number> = {};
  alternatives.forEach((alt) => {
    let score = 0;
    criteria.forEach((crit) => {
      const critWeight = criteriaWeights[crit.id] || 0;
      const altLocalScore = localPriorities[crit.id]?.[alt.id] || 0;
      score += critWeight * altLocalScore;
    });
    globalScores[alt.id] = score;
  });

  return globalScores;
}

// Helper to ensure types match for calculateResults if needed,
// though structurally {id: string}[] is compatible.
function itemsNameSafe(items: { id: string }[]): { id: string }[] {
  return items;
}
