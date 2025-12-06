import React from "react";
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
import { Textarea } from "@/app/components/ui/Textarea";

export function Step1Problem() {
  const { state, dispatch } = useAhp();
  const { problem } = state;

  const handleNext = () => {
    if (problem.trim().length > 0) {
      dispatch({ type: "NEXT_STEP" });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>
            What is the core decision you are trying to make?
          </CardTitle>
          <CardDescription>
            Clearly state the problem or goal you want to achieve. This will be
            the foundation of your analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., Choose the best location for a new office"
            value={problem}
            onChange={(e) =>
              dispatch({ type: "SET_PROBLEM", payload: e.target.value })
            }
            className="min-h-[150px] text-lg"
          />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>Need inspiration? See examples</span>
            <span>Recommended: 50-300 characters</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={problem.trim().length === 0}
            size="lg"
          >
            Next: Define Criteria
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
