"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Slider } from "@/app/components/ui/Slider";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/app/lib/utils";

interface ComparisonInputProps {
  rowName: string;
  colName: string;
  value: number;
  onChange: (value: number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComparisonInput({
  rowName,
  colName,
  value,
  onChange,
  isOpen,
  onOpenChange,
}: ComparisonInputProps) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Convert AHP value (1/9 to 9) to Slider value (-8 to 8)
  const getSliderValue = (val: number) => {
    if (val >= 1) return val - 1;
    return -(Math.round(1 / val) - 1);
  };

  // Convert Slider value (-8 to 8) to AHP value
  const getAhpValue = (sliderVal: number) => {
    if (sliderVal >= 0) return sliderVal + 1;
    return 1 / (Math.abs(sliderVal) + 1);
  };

  const sliderValue = getSliderValue(value);

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const popoverWidth = 320; // Approx width

      let left = rect.left + rect.width / 2;

      // Keep within bounds
      if (left + popoverWidth / 2 > viewportWidth) {
        left = viewportWidth - popoverWidth / 2 - 20;
      } else if (left - popoverWidth / 2 < 0) {
        left = popoverWidth / 2 + 20;
      }

      setCoords({
        top: rect.bottom + 8,
        left: left,
      });
      onOpenChange(true);
    }
  };

  // Close on click outside
  useEffect(() => {
    if (isOpen) {
      const close = () => onOpenChange(false);
      // Use a slight delay to avoid immediate closing if triggered by the button click itself
      // (though stopPropagation in handler handles that)
      document.addEventListener("click", close);
      return () => document.removeEventListener("click", close);
    }
  }, [isOpen, onOpenChange]);

  const handlePortalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getLabel = (val: number) => {
    if (val === 0) return "Equal Importance";
    const importance = Math.abs(val) + 1;
    const favored = val > 0 ? rowName : colName;

    let desc = "";
    if (importance === 1) desc = "Equal";
    else if (importance <= 3) desc = "Moderate";
    else if (importance <= 5) desc = "Strong";
    else if (importance <= 7) desc = "Very Strong";
    else desc = "Extreme";

    return `${desc} Importance for ${favored}`;
  };

  return (
    <>
      <Button
        ref={triggerRef}
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation(); // Prevent the document listener from firing immediately
          if (isOpen) {
            onOpenChange(false);
          } else {
            handleOpen();
          }
        }}
        className={cn(
          "w-20 h-9 font-normal transition-colors",
          value !== 1 && "border-primary font-medium bg-primary/10",
          isOpen && "ring-2 ring-primary ring-offset-2"
        )}
      >
        {value >= 1 ? value : `1/${Math.round(1 / value)}`}
      </Button>

      {isOpen &&
        createPortal(
          <div
            className="fixed z-[9999] bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-lg shadow-2xl p-4 w-80 animate-in fade-in zoom-in-95 duration-200"
            style={{
              top: coords.top,
              left: coords.left,
              transform: "translateX(-50%)",
            }}
            onClick={handlePortalClick}
          >
            <div className="space-y-4">
              <div className="text-sm font-medium text-center min-h-[40px] flex items-center justify-center bg-zinc-950/50 rounded-md p-2">
                {getLabel(sliderValue)}
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span className="max-w-[100px] truncate" title={colName}>
                  {colName}
                </span>
                <span
                  className="max-w-[100px] truncate text-right"
                  title={rowName}
                >
                  {rowName}
                </span>
              </div>

              <Slider
                min={-8}
                max={8}
                step={1}
                value={sliderValue}
                onValueChange={(val) => onChange(getAhpValue(val))}
                className="py-2"
              />

              <div className="flex justify-between text-[10px] text-zinc-500 px-1 font-mono">
                <span>9</span>
                <span>1</span>
                <span>9</span>
              </div>
            </div>

            {/* Arrow */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-zinc-900" />
          </div>,
          document.body
        )}
    </>
  );
}
