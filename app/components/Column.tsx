import { Flex } from "@chakra-ui/react";
import { Style } from "~/style";
import { StepButton } from "./StepButton";

const MAX_NOTES = 140;

interface ColumnProps {
  data: number[][];
  setData: (data: number[][]) => void;
  index: number;
  style: Style;
  spacing: number;
}

export const Column = ({
  data,
  setData,
  index,
  style,
  spacing,
}: ColumnProps) => {
  const column = data[index];
  const setStep =
    (columnIndex: number, stepIndex: number) => (isShown: boolean) => {
      data[columnIndex] = isShown
        ? // Add step
          [...data[columnIndex], stepIndex].sort((a, b) => a - b)
        : // Remove step
          data[columnIndex].filter((step) => step !== stepIndex);
      setData([...data]);
    };

  let stepIndex = column.length - 1;
  const stepButtons = [];

  for (let i = MAX_NOTES; i >= 0; --i) {
    const hasNote = column[stepIndex] === i;
    if (hasNote) {
      --stepIndex;
    }

    stepButtons.push(
      <StepButton
        key={i}
        columnIndex={index}
        setStep={setStep(index, i)}
        hasStep={hasNote}
        style={style}
        spacing={spacing}
      />
    );
  }

  return (
    <Flex w={7} direction="column-reverse">
      {stepButtons}
    </Flex>
  );
};
