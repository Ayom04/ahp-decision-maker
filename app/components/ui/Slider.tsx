"use client";

import * as React from "react";
import { cn } from "@/app/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
}

export function Slider({
  className,
  value,
  min,
  max,
  step = 1,
  onValueChange,
  ...props
}: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(parseFloat(e.target.value));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative w-full h-6 flex items-center", className)}>
      <div className="absolute w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        {...props}
      />
      <div
        className="absolute h-4 w-4 bg-primary border-2 border-background rounded-full shadow-md pointer-events-none transition-all duration-150"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
}
