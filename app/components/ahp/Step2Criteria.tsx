import React, { useState, useEffect } from "react";
import { useAhp } from "@/app/context/AhpContext";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";

export function Step2Criteria() {
  const { state, dispatch } = useAhp();
  const { criteria, alternatives } = state;
  const [criteriaCount, setCriteriaCount] = useState(criteria.length || 3);
  const [alternativesCount, setAlternativesCount] = useState(
    alternatives?.length || 3
  );

  useEffect(() => {
    if (criteria.length === 0) {
      dispatch({ type: "SET_CRITERIA_COUNT", payload: 3 });
    }
  }, [criteria.length, dispatch]);

  useEffect(() => {
    if (alternatives.length === 0) {
      dispatch({ type: "SET_ALTERNATIVES_COUNT", payload: 3 });
    }
  }, [alternatives.length, dispatch]);

  const handleCriteriaCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    setCriteriaCount(val);
    if (val >= 2 && val <= 15) {
      dispatch({ type: "SET_CRITERIA_COUNT", payload: val });
    }
  };

  const handleAlternativesCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    setAlternativesCount(val);
    if (val >= 2 && val <= 7) {
      dispatch({ type: "SET_ALTERNATIVES_COUNT", payload: val });
    }
  };

  const handleCriterionNameChange = (id: string, name: string) => {
    dispatch({ type: "UPDATE_CRITERION_NAME", payload: { id, name } });
  };

  const handleAlternativeNameChange = (id: string, name: string) => {
    dispatch({ type: "UPDATE_ALTERNATIVE_NAME", payload: { id, name } });
  };

  const isCriteriaValid =
    criteria.length >= 2 &&
    criteria.length <= 15 &&
    criteria.every((c) => c.name.trim().length > 0);

  const isAlternativesValid =
    alternatives.length >= 2 &&
    alternatives.length <= 7 &&
    alternatives.every((a) => a.name.trim().length > 0);

  const isValid = isCriteriaValid && isAlternativesValid;

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Define Your Decision Criteria</CardTitle>
          <CardDescription>
            Add and name the criteria for your decision (2-15).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Number of Criteria
            </label>
            <Input
              type="number"
              min={2}
              max={15}
              value={criteriaCount}
              onChange={handleCriteriaCountChange}
              className="w-full"
            />
            {(criteriaCount < 2 || criteriaCount > 15) && (
              <p className="text-sm text-destructive">
                Please enter between 2 and 15 criteria.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {criteria.map((criterion, index) => (
              <div key={criterion.id} className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Criterion {index + 1}
                </label>
                <Input
                  value={criterion.name}
                  onChange={(e) =>
                    handleCriterionNameChange(criterion.id, e.target.value)
                  }
                  placeholder={`Criterion ${index + 1}`}
                  className={
                    criterion.name.trim() === "" ? "border-destructive" : ""
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Define Your Alternatives</CardTitle>
          <CardDescription>
            Add and name the alternatives you are comparing (2-7).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Number of Alternatives
            </label>
            <Input
              type="number"
              min={2}
              max={7}
              value={alternativesCount}
              onChange={handleAlternativesCountChange}
              className="w-full"
            />
            {(alternativesCount < 2 || alternativesCount > 7) && (
              <p className="text-sm text-destructive">
                Please enter between 2 and 7 alternatives.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {alternatives.map((alternative, index) => (
              <div key={alternative.id} className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Alternative {index + 1}
                </label>
                <Input
                  value={alternative.name}
                  onChange={(e) =>
                    handleAlternativeNameChange(alternative.id, e.target.value)
                  }
                  placeholder={`Alternative ${index + 1}`}
                  className={
                    alternative.name.trim() === "" ? "border-destructive" : ""
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => dispatch({ type: "NEXT_STEP" })}
            disabled={!isValid}
          >
            Next: Pairwise Comparison
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
