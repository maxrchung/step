import { Flex } from "@chakra-ui/react";
import { Style } from "~/style";
import { StepButton } from "./StepButton";

export const MAX_STEPS = 140;

interface ColumnProps {
  data: number[][];
  setData: (data: number[][]) => void;
  index: number;
  style: Style;
  spacing: number;
  rowHoverIndex: number;
  setRowHoverIndex: (index: number) => void;
}

export const Column = ({
  data,
  setData,
  index,
  style,
  spacing,
  rowHoverIndex,
  setRowHoverIndex,
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

  for (let i = MAX_STEPS - 1; i >= 0; --i) {
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
        rowIndex={i}
        rowHoverIndex={rowHoverIndex}
        setRowHoverIndex={setRowHoverIndex}
        data={data}
        setData={setData}
      />
    );
  }

  return (
    <Flex w={7} direction="column-reverse">
      {stepButtons}
    </Flex>
  );
};
