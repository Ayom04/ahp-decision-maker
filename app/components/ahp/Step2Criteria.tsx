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
  const { criteria } = state;
  const [count, setCount] = useState(criteria.length || 3);

  useEffect(() => {
    if (criteria.length === 0) {
      dispatch({ type: "SET_CRITERIA_COUNT", payload: 3 });
    }
  }, [criteria.length, dispatch]);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    setCount(val);
    if (val >= 2 && val <= 15) {
      dispatch({ type: "SET_CRITERIA_COUNT", payload: val });
    }
  };

  const handleNameChange = (id: string, name: string) => {
    dispatch({ type: "UPDATE_CRITERION_NAME", payload: { id, name } });
  };

  const isValid =
    criteria.length >= 2 &&
    criteria.length <= 15 &&
    criteria.every((c) => c.name.trim().length > 0);

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>Define Your Decision Criteria</CardTitle>
          <CardDescription>
            Add and name the criteria for your decision. Start by telling us how
            many criteria you need (2-15).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Number of Criteria
            </label>
            <Input
              type="number"
              min={2}
              max={15}
              value={count}
              onChange={handleCountChange}
              className="w-full"
            />
            {(count < 2 || count > 15) && (
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
                    handleNameChange(criterion.id, e.target.value)
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
