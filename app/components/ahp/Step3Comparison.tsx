import React, { useState } from "react";
import { useAhp } from "@/app/context/AhpContext";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { ComparisonInput } from "@/app/components/ahp/ComparisonInput";
import { ProgressBar } from "@/app/components/ui/ProgressBar";
import { Tooltip } from "@/app/components/ui/Tooltip";
import { calculateResults } from "@/app/lib/ahp-logic";
import { ComparisonMatrix, Criterion, Alternative } from "@/app/lib/types";

const SAATY_SCALE = [
  { value: 1, label: "Equal Importance" },
  { value: 3, label: "Moderate Importance" },
  { value: 5, label: "Strong Importance" },
  { value: 7, label: "Very Strong Importance" },
  { value: 9, label: "Extreme Importance" },
  { value: "2, 4, 6, 8", label: "Intermediate values" },
];

export function Step3Comparison() {
  const { state, dispatch } = useAhp();
  const { criteria, alternatives, matrix, alternativeMatrices } = state;
  const [activeCell, setActiveCell] = useState<string | null>(null);

  // --- PROGRESS CALCULATION ---
  const criteriaCompCount = (criteria.length * (criteria.length - 1)) / 2;
  const altsCompCountPerCrit =
    (alternatives.length * (alternatives.length - 1)) / 2;
  const totalComparisons =
    criteriaCompCount + criteria.length * altsCompCountPerCrit;

  const getCompletedCount = (
    items: { id: string }[],
    mat: ComparisonMatrix
  ) => {
    return items.reduce((acc, row, i) => {
      return (
        acc +
        items.slice(i + 1).reduce((rowAcc, col) => {
          return rowAcc + (mat[row.id]?.[col.id] ? 1 : 0);
        }, 0)
      );
    }, 0);
  };

  const completedCriteriaComps = getCompletedCount(criteria, matrix);
  const completedAltComps = criteria.reduce((acc, c) => {
    const mat = alternativeMatrices[c.id];
    return acc + (mat ? getCompletedCount(alternatives, mat) : 0);
  }, 0);

  const completedComparisons = completedCriteriaComps + completedAltComps;
  const progress = (completedComparisons / totalComparisons) * 100;

  const handleCalculate = () => {
    // Note: This only calculates criteria results for now in the reducer logic typically.
    // Real implementation would need to Aggregate everything.
    // For now, we just pass the criteria calculation to satisfy types,
    // actual aggregation might naturally happen in Step 4 or here.
    // Assuming existing calculateResults logic is for Criteria.
    const results = calculateResults(matrix, criteria);
    // You might want to calculate alternative scores here too if the reducer supports it,
    // but the prompt asked for TABLE GENERATION specifically. Logic later.
    dispatch({ type: "CALCULATE_RESULTS", payload: results });
    dispatch({ type: "NEXT_STEP" });
  };

  // --- HELPER WRAPPER ---
  const renderMatrix = (
    title: string,
    description: string,
    items: { id: string; name: string }[],
    mat: ComparisonMatrix,
    onUpdate: (rowId: string, colId: string, val: number) => void,
    contextId: string,
    itemLabelPrefix: string = "C"
  ) => {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-8">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">
                    {itemLabelPrefix === "C" ? "Criteria" : "Alternatives"}
                  </th>
                  {items.map((c, i) => (
                    <th
                      key={c.id}
                      className="px-4 py-3 font-medium text-center"
                    >
                      <Tooltip content={c.name}>
                        <span className="cursor-help underline decoration-dotted">
                          {itemLabelPrefix}
                          {i + 1}
                        </span>
                      </Tooltip>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((row, i) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <th className="px-4 py-3 font-medium bg-muted/20">
                      <Tooltip content={row.name}>
                        <span className="cursor-help">
                          {itemLabelPrefix}
                          {i + 1}
                        </span>
                      </Tooltip>
                    </th>
                    {items.map((col, j) => {
                      if (i === j) {
                        return (
                          <td
                            key={col.id}
                            className="px-4 py-3 text-center text-muted-foreground bg-muted/10"
                          >
                            1
                          </td>
                        );
                      }
                      if (i > j) {
                        const val = mat[row.id]?.[col.id];
                        return (
                          <td
                            key={col.id}
                            className="px-4 py-3 text-center text-muted-foreground bg-muted/10"
                          >
                            {val >= 1 ? val : `1/${Math.round(1 / val)}`}
                          </td>
                        );
                      }
                      const cellId = `${contextId}-${row.id}-${col.id}`;
                      return (
                        <td key={col.id} className="px-4 py-3 text-center">
                          <ComparisonInput
                            rowName={row.name}
                            colName={col.name}
                            value={mat[row.id]?.[col.id] || 1}
                            onChange={(val) => onUpdate(row.id, col.id, val)}
                            isOpen={activeCell === cellId}
                            onOpenChange={(open) =>
                              setActiveCell(open ? cellId : null)
                            }
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        {/* PROGRESS Header */}
        <Card className="mb-6 sticky top-4 z-20 shadow-md border-primary/20">
          <CardContent className="pt-6">
            <div className="flex justify-between text-sm mb-2 font-medium">
              <span>Total Progress</span>
              <span>
                {completedComparisons} / {totalComparisons} Comparisons
              </span>
            </div>
            <ProgressBar value={progress} />
          </CardContent>
        </Card>

        {/* 1. CRITERIA MATRIX */}
        {renderMatrix(
          `Criteria Comparison: ${state.problem}`,
          "Compare the importance of each criterion against the others pairwise.",
          criteria,
          matrix,
          (r, c, v) =>
            dispatch({
              type: "UPDATE_COMPARISON",
              payload: { rowId: r, colId: c, value: v },
            }),
          "criteria",
          "C"
        )}

        {/* 2. ALTERNATIVES MATRICES (Loop) */}
        {criteria.map((criterion, idx) => (
          <div key={criterion.id}>
            <div className="flex items-center gap-2 mb-4 mt-8">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                C{idx + 1}
              </div>
              <h2 className="text-xl font-bold">{criterion.name}</h2>
            </div>

            {renderMatrix(
              `Compare Alternatives based on ${criterion.name}`,
              `Which alternative is better with respect to ${criterion.name}?`,
              alternatives,
              alternativeMatrices[criterion.id] || {},
              (r, c, v) =>
                dispatch({
                  type: "UPDATE_ALTERNATIVE_COMPARISON",
                  payload: {
                    criterionId: criterion.id,
                    rowId: r,
                    colId: c,
                    value: v,
                  },
                }),
              `alt-${criterion.id}`,
              "A"
            )}
          </div>
        ))}

        <div className="flex justify-end mt-8 mb-20">
          <Button
            size="lg"
            onClick={handleCalculate}
            disabled={completedComparisons < totalComparisons}
          >
            Calculate Results
          </Button>
        </div>
      </div>

      <div className="lg:w-80 space-y-6">
        <div className="sticky top-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Keys</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm mb-2 text-primary">
                  Criteria
                </h4>
                <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                  {criteria.map((c, i) => (
                    <div key={c.id} className="flex gap-2 items-start">
                      <span className="font-bold min-w-[24px] mt-0.5">
                        C{i + 1}
                      </span>
                      <span className="text-muted-foreground break-words leading-tight">
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-2 text-primary">
                  Alternatives
                </h4>
                <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                  {alternatives.map((a, i) => (
                    <div key={a.id} className="flex gap-2 items-start">
                      <span className="font-bold min-w-[24px] mt-0.5">
                        A{i + 1}
                      </span>
                      <span className="text-muted-foreground break-words leading-tight">
                        {a.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Saaty's Scale Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SAATY_SCALE.map((item) => (
                  <div
                    key={item.value}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="font-bold min-w-[24px]">{item.value}</span>
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-xs text-muted-foreground">
                <p>
                  <strong>Tip:</strong> If A is less important than B, enter the
                  reciprocal (e.g., 1/3, 1/5).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
