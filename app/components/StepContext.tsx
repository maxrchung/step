import { createContext, useContext } from "react";
import { Style } from "~/style";

export const INITIAL_STEP_CONTEXT = {
  steps: [] as number[][],
  setSteps: (steps: number[][]) => {},
  style: Style.DDR_SINGLE,
  spacing: 28,
};

export const StepContext = createContext(INITIAL_STEP_CONTEXT);
export const useStepContext = () => useContext(StepContext);
