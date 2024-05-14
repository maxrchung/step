import { Flex } from "@chakra-ui/react";
import { StepButton } from "./StepButton";
import { useStepContext } from "./StepContext";

export const MAX_STEPS = 140;

interface StepColumnProps {
  columnIndex: number;
}

export const StepColumn = ({ columnIndex }: StepColumnProps) => {
  const { steps, setSteps } = useStepContext();

  const column = steps[columnIndex];
  const setStep = (columnIndex: number, rowIndex: number, isShown: boolean) => {
    steps[columnIndex] = isShown
      ? // Add step
        [...steps[columnIndex], rowIndex].sort((a, b) => a - b)
      : // Remove step
        steps[columnIndex].filter((step) => step !== rowIndex);
    setSteps([...steps]);
  };

  let stepIndex = column.length - 1;
  const stepButtons = [];

  for (let i = MAX_STEPS - 1; i >= 0; --i) {
    const hasStep = column[stepIndex] === i;
    if (hasStep) {
      --stepIndex;
    }

    stepButtons.push(
      <StepButton
        key={i}
        columnIndex={columnIndex}
        rowIndex={i}
        setStep={setStep}
        hasStep={hasStep}
      />
    );
  }

  return (
    // Reverse so higher steps cover lower steps
    <Flex w={7} direction="column-reverse">
      {stepButtons}
    </Flex>
  );
};
