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
  const { criteria, matrix } = state;

  const [activeCell, setActiveCell] = useState<string | null>(null);

  const totalComparisons = (criteria.length * (criteria.length - 1)) / 2;
  const completedComparisons = criteria.reduce((acc, row, i) => {
    return (
      acc +
      criteria.slice(i + 1).reduce((rowAcc, col) => {
        return rowAcc + (matrix[row.id]?.[col.id] ? 1 : 0);
      }, 0)
    );
  }, 0);

  const progress = (completedComparisons / totalComparisons) * 100;

  const handleCalculate = () => {
    const results = calculateResults(matrix, criteria);
    dispatch({ type: "CALCULATE_RESULTS", payload: results });
    dispatch({ type: "NEXT_STEP" });
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Pairwise Comparison: {state.problem}</CardTitle>
            <CardDescription>
              For each pair, determine which criterion is more important and by
              how much.
            </CardDescription>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Comparisons Completed</span>
                <span>
                  {completedComparisons} of {totalComparisons}
                </span>
              </div>
              <ProgressBar value={progress} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-32">
              {" "}
              {/* Added padding for popover space */}
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Criteria</th>
                    {criteria.map((c, i) => (
                      <th
                        key={c.id}
                        className="px-4 py-3 font-medium text-center"
                      >
                        <Tooltip content={c.name}>
                          <span className="cursor-help underline decoration-dotted">
                            C{i + 1}
                          </span>
                        </Tooltip>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((row, i) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <th className="px-4 py-3 font-medium bg-muted/20">
                        <Tooltip content={row.name}>
                          <span className="cursor-help">C{i + 1}</span>
                        </Tooltip>
                      </th>
                      {criteria.map((col, j) => {
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
                          return (
                            <td
                              key={col.id}
                              className="px-4 py-3 text-center text-muted-foreground bg-muted/10"
                            >
                              {matrix[row.id]?.[col.id] >= 1
                                ? matrix[row.id]?.[col.id]
                                : `1/${Math.round(
                                    1 / matrix[row.id]?.[col.id]
                                  )}`}
                            </td>
                          );
                        }
                        const cellId = `${row.id}-${col.id}`;
                        return (
                          <td key={col.id} className="px-4 py-3 text-center">
                            <ComparisonInput
                              rowName={row.name}
                              colName={col.name}
                              value={matrix[row.id]?.[col.id] || 1}
                              onChange={(val) =>
                                dispatch({
                                  type: "UPDATE_COMPARISON",
                                  payload: {
                                    rowId: row.id,
                                    colId: col.id,
                                    value: val,
                                  },
                                })
                              }
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
          <CardFooter className="flex justify-end">
            <div className="space-x-2">
              {/* Reset button could be added here */}
              <Button
                onClick={handleCalculate}
                disabled={completedComparisons < totalComparisons}
              >
                Calculate Weights
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:w-80 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Criteria Key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
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
                <strong>Tip:</strong> If Criterion A is less important than B,
                enter the reciprocal (e.g., 1/3, 1/5).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
