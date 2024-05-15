import { Flex } from "@chakra-ui/react";
import { useStepContext } from "./StepContext";
import { STYLE_ICONS } from "~/style";
import { StepRow } from "./StepRow";

export const MAX_STEPS = 140;

export const StepRows = () => {
  const { steps, style } = useStepContext();

  const styleLength = STYLE_ICONS[style].length;

  // Convert column format to rows
  const rows: boolean[][] = Array(MAX_STEPS)
    .fill(null)
    .map(() => Array(styleLength).fill(false));

  // Fill in steps
  for (let i = 0; i < steps.length; ++i) {
    for (let j = 0; j < steps[i].length; ++j) {
      // Safeguard if row/column length changes
      if (rows[steps[i][j]]) {
        rows[steps[i][j]][i] = true;
      }
    }
  }

  return (
    // Reverse so higher steps cover lower steps
    <Flex direction="column-reverse">
      {rows.reverse().map((row, index) => (
        <StepRow key={index} row={row} rowIndex={rows.length - 1 - index} />
      ))}
    </Flex>
  );
};
