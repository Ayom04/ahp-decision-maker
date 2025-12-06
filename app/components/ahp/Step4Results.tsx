import React, { useState } from "react";
import { useAhp } from "@/app/context/AhpContext";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { ProgressBar } from "@/app/components/ui/ProgressBar";
import { Tooltip } from "@/app/components/ui/Tooltip";
import { cn } from "@/app/lib/utils";

export function Step4Results() {
  const { state, dispatch } = useAhp();
  const { criteria, results, matrix } = state;
  const [showMatrices, setShowMatrices] = useState(false);

  if (!results) return null;

  const { weights, consistency, normalizedMatrix } = results;
  const { cr, ci, lambdaMax, isConsistent } = consistency;

  // Sort criteria by weight descending
  const sortedCriteria = [...criteria].sort(
    (a, b) => weights[b.id] - weights[a.id]
  );

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Results & Analysis
        </h1>
        <div className="flex gap-2">
          {/* Export functionality could go here */}
        </div>
      </div>

      {/* Consistency Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className={cn(
            "border-l-4",
            isConsistent ? "border-l-green-500" : "border-l-destructive"
          )}
        >
          <CardHeader className="pb-2">
            <CardDescription>Consistency Evaluation</CardDescription>
            <CardTitle
              className={cn(
                "text-2xl",
                isConsistent ? "text-green-500" : "text-destructive"
              )}
            >
              {isConsistent ? "Consistent" : "Inconsistent"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              CR = {cr.toFixed(2)} ({isConsistent ? "< 0.10" : ">= 0.10"})
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>λmax (Eigenvalue)</CardDescription>
            <CardTitle className="text-2xl">{lambdaMax.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Max eigenvalue of matrix
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Consistency Index</CardDescription>
            <CardTitle className="text-2xl">{ci.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              CI = (λmax - n) / (n - 1)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weights and Ranking */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Criteria Weights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {criteria.map((c) => (
              <div key={c.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">
                    {(weights[c.id] * 100).toFixed(1)}%
                  </span>
                </div>
                <ProgressBar value={weights[c.id] * 100} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ranked Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedCriteria.map((c, index) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 font-medium">{c.name}</div>
                <div className="font-bold">
                  {(weights[c.id] * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Matrices Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Detailed Matrices</h2>
          <Button
            variant="ghost"
            onClick={() => setShowMatrices(!showMatrices)}
          >
            {showMatrices ? "Hide" : "Show"}
          </Button>
        </div>

        {showMatrices && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Criteria Key</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Comparison Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50">
                        <tr>
                          <th className="px-4 py-2">Criteria</th>
                          {criteria.map((c, i) => (
                            <th key={c.id} className="px-4 py-2 text-center">
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
                            <th className="px-4 py-2 font-medium bg-muted/20">
                              <Tooltip content={row.name}>
                                <span className="cursor-help">C{i + 1}</span>
                              </Tooltip>
                            </th>
                            {criteria.map((col) => (
                              <td
                                key={col.id}
                                className="px-4 py-2 text-center"
                              >
                                {matrix[row.id][col.id].toFixed(2)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Normalized Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50">
                        <tr>
                          <th className="px-4 py-2">Criteria</th>
                          {criteria.map((c, i) => (
                            <th key={c.id} className="px-4 py-2 text-center">
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
                            <th className="px-4 py-2 font-medium bg-muted/20">
                              <Tooltip content={row.name}>
                                <span className="cursor-help">C{i + 1}</span>
                              </Tooltip>
                            </th>
                            {criteria.map((col) => (
                              <td
                                key={col.id}
                                className="px-4 py-2 text-center"
                              >
                                {normalizedMatrix[row.id][col.id].toFixed(2)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
