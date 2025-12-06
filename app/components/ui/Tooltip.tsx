"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [transform, setTransform] = useState("-translate-x-1/2");
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      let left = rect.left + rect.width / 2;
      let xTransform = "-translate-x-1/2";

      // Check right edge
      if (left + 100 > viewportWidth) {
        // Assuming max width approx 200px (half is 100)
        left = rect.right;
        xTransform = "-translate-x-full";
      }
      // Check left edge - shift to align left if close to edge
      else if (left - 100 < 0) {
        left = Math.max(10, rect.left); // Ensure at least 10px from edge
        xTransform = "translate-x-0";
      }

      setPosition({
        top: rect.top - 8,
        left: left,
      });
      setTransform(xTransform);
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {mounted &&
        isVisible &&
        createPortal(
          <div
            className={`fixed z-[9999] px-3 py-1.5 text-sm font-medium text-primary-foreground bg-primary rounded-md shadow-xl pointer-events-none transform ${transform} -translate-y-full animate-in fade-in zoom-in-95 duration-150`}
            style={{ top: position.top, left: position.left }}
          >
            {content}
            {/* Arrow - simplified to be centered or hidden to avoid complexity with shifting tooltip */}
          </div>,
          document.body
        )}
    </>
  );
}
