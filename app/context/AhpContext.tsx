"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  AhpState,
  AhpAction,
  Criterion,
  Alternative,
  ComparisonMatrix,
} from "@/app/lib/types";
import { generateMatrix } from "@/app/lib/ahp-logic";

const initialState: AhpState = {
  step: 1,
  problem: "",
  criteria: [],
  alternatives: [],
  matrix: {},
  alternativeMatrices: {},
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

      // When criteria change, we must reset the alternative matrices structure
      // because keys (criterion IDs) might have changed.
      const newAlternativeMatrices: Record<string, ComparisonMatrix> = {};
      newCriteria.forEach((c) => {
        newAlternativeMatrices[c.id] = generateMatrix(state.alternatives);
      });

      return {
        ...state,
        criteria: newCriteria,
        matrix: generateMatrix(newCriteria),
        alternativeMatrices: newAlternativeMatrices,
        results: null,
      };
    }

    case "UPDATE_CRITERION_NAME": {
      const { id, name } = action.payload;
      return {
        ...state,
        criteria: state.criteria.map((c) => (c.id === id ? { ...c, name } : c)),
      };
    }

    case "SET_ALTERNATIVES_COUNT": {
      const count = action.payload;
      const newAlternatives: Alternative[] = Array.from(
        { length: count },
        (_, i) => ({
          id: `a${i + 1}`,
          name: `Alternative ${i + 1}`,
        })
      );

      // Regenerate matrices for each criterion based on new alternatives
      const newAlternativeMatrices: Record<string, ComparisonMatrix> = {};
      state.criteria.forEach((c) => {
        newAlternativeMatrices[c.id] = generateMatrix(newAlternatives);
      });

      return {
        ...state,
        alternatives: newAlternatives,
        alternativeMatrices: newAlternativeMatrices,
        results: null,
      };
    }

    case "UPDATE_ALTERNATIVE_NAME": {
      const { id, name } = action.payload;
      return {
        ...state,
        alternatives: state.alternatives.map((a) =>
          a.id === id ? { ...a, name } : a
        ),
      };
    }

    case "UPDATE_COMPARISON": {
      const { rowId, colId, value } = action.payload;
      const newMatrix = { ...state.matrix };

      if (!newMatrix[rowId]) newMatrix[rowId] = {};
      if (!newMatrix[colId]) newMatrix[colId] = {};

      newMatrix[rowId][colId] = value;
      if (value !== 0) {
        newMatrix[colId][rowId] = 1 / value;
      } else {
        newMatrix[colId][rowId] = 0;
      }

      return { ...state, matrix: newMatrix, results: null };
    }

    case "UPDATE_ALTERNATIVE_COMPARISON": {
      const { criterionId, rowId, colId, value } = action.payload;
      const newAlternativeMatrices = { ...state.alternativeMatrices }; // Shallow copy of the record

      // Deep copy the specific matrix we are modifying
      const specificMatrix = { ...newAlternativeMatrices[criterionId] };

      if (!specificMatrix[rowId]) specificMatrix[rowId] = {};
      if (!specificMatrix[colId]) specificMatrix[colId] = {};

      specificMatrix[rowId][colId] = value;
      if (value !== 0) {
        specificMatrix[colId][rowId] = 1 / value;
      } else {
        specificMatrix[colId][rowId] = 0;
      }

      newAlternativeMatrices[criterionId] = specificMatrix;

      return {
        ...state,
        alternativeMatrices: newAlternativeMatrices,
        results: null,
      };
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
