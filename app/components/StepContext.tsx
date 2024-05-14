import { createContext, useContext } from "react";
import { Style } from "~/style";

export const DEFAULT_STEP_CONTEXT = {
  steps: [] as number[][],
  setSteps: (steps: number[][]) => {},
  style: Style.DDR_SINGLE,
  spacing: 28,
  rowHoverIndex: -1,
  setRowHoverIndex: (rowHoverIndex: number) => {},
};

export const StepContext = createContext(DEFAULT_STEP_CONTEXT);
export const useStepContext = () => useContext(StepContext);
