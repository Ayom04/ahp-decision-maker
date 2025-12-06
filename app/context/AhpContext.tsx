"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  AhpState,
  AhpAction,
  Criterion,
  ComparisonMatrix,
} from "@/app/lib/types";
import { generateMatrix } from "@/app/lib/ahp-logic";

const initialState: AhpState = {
  step: 1,
  problem: "",
  criteria: [],
  matrix: {},
  results: null,
};

function ahpReducer(state: AhpState, action: AhpAction): AhpState {
  switch (action.type) {
    case "SET_PROBLEM":
      return { ...state, problem: action.payload };

    case "SET_CRITERIA_COUNT": {
      const count = action.payload;
      const newCriteria: Criterion[] = Array.from(
        { length: count },
        (_, i) => ({
          id: `c${i + 1}`,
          name: `Criterion ${i + 1}`,
        })
      );
      return {
        ...state,
        criteria: newCriteria,
        matrix: generateMatrix(newCriteria),
        results: null, // Reset results when criteria change
      };
    }

    case "UPDATE_CRITERION_NAME": {
      const { id, name } = action.payload;
      return {
        ...state,
        criteria: state.criteria.map((c) => (c.id === id ? { ...c, name } : c)),
      };
    }

    case "UPDATE_COMPARISON": {
      const { rowId, colId, value } = action.payload;
      const newMatrix = { ...state.matrix };

      // Ensure nested objects exist (should be handled by generateMatrix, but safe guard)
      if (!newMatrix[rowId]) newMatrix[rowId] = {};
      if (!newMatrix[colId]) newMatrix[colId] = {};

      newMatrix[rowId][colId] = value;
      // Reciprocal
      if (value !== 0) {
        newMatrix[colId][rowId] = 1 / value;
      } else {
        newMatrix[colId][rowId] = 0; // Or handle as incomplete
      }

      return { ...state, matrix: newMatrix, results: null };
    }

    case "CALCULATE_RESULTS":
      return { ...state, results: action.payload };

    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 4) };

    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

const AhpContext = createContext<{
  state: AhpState;
  dispatch: React.Dispatch<AhpAction>;
} | null>(null);

export function AhpProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ahpReducer, initialState);

  return (
    <AhpContext.Provider value={{ state, dispatch }}>
      {children}
    </AhpContext.Provider>
  );
}

export function useAhp() {
  const context = useContext(AhpContext);
  if (!context) {
    throw new Error("useAhp must be used within an AhpProvider");
  }
  return context;
}
