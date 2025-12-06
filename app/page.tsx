"use client";

import { useAhp } from "@/app/context/AhpContext";
import { Step1Problem } from "@/app/components/ahp/Step1Problem";
import { Step2Criteria } from "@/app/components/ahp/Step2Criteria";
import { Step3Comparison } from "@/app/components/ahp/Step3Comparison";
import { Step4Results } from "@/app/components/ahp/Step4Results";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/app/lib/utils";

export default function Home() {
  const { state, dispatch } = useAhp();
  const { step } = state;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-12 relative">
        <div className="flex items-center justify-between mb-8">
          {step > 1 ? (
            <Button
              variant="ghost"
              onClick={() => dispatch({ type: "PREV_STEP" })}
              className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back
            </Button>
          ) : (
            <div className="w-20" />
          )}{" "}
          {/* Spacer to keep title centered if needed, or just let it flow */}
          <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary-foreground"
              >
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight hidden sm:block">
              AHP Decision Maker
            </h1>
          </div>
          <div className="w-20" /> {/* Spacer for balance */}
        </div>

        {/* Step Progress */}
        <div className="relative flex justify-between items-start max-w-3xl mx-auto">
          {/* Connecting Lines */}
          <div className="absolute top-4 left-0 w-full h-[2px] bg-muted -z-10" />
          <div
            className="absolute top-4 left-0 h-[2px] bg-primary -z-10 transition-all duration-500 ease-in-out"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />

          {[
            { id: 1, label: "Problem" },
            { id: 2, label: "Criteria" },
            { id: 3, label: "Compare" },
            { id: 4, label: "Results" },
          ].map((s) => (
            <div
              key={s.id}
              className="flex flex-col items-center gap-2 bg-background px-2 z-10"
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 border-2",
                  step >= s.id
                    ? "border-primary bg-primary text-primary-foreground scale-110"
                    : "border-muted bg-background text-muted-foreground"
                )}
              >
                {s.id}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-300 uppercase tracking-wider",
                  step >= s.id ? "text-primary" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </header>

      <main>
        {step === 1 && <Step1Problem />}
        {step === 2 && <Step2Criteria />}
        {step === 3 && <Step3Comparison />}
        {step === 4 && <Step4Results />}
      </main>
    </div>
  );
}
