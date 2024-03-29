import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowForwardIcon,
  ArrowBackIcon,
} from "@chakra-ui/icons";
import { Button, Flex, chakra, useBoolean } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PlusIcon from "~/icons/PlusIcon";

const MAX_NOTES = 140;
const DEBOUNCE_TIME = 1000;

export default function Index() {
  const [data, setData] = useState<number[][]>([
    [0, 3, 5, 20],
    [2, 4, 8, 20],
    [1, 2, 3],
    [4, 5, 6],
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log(data);
    }, DEBOUNCE_TIME);
    return () => clearTimeout(timeout);
  }, [data]);

  return (
    // <Flex p={8} justify="center">
    //   <Column data={data} setData={setData} index={0} />
    //   <Column data={data} setData={setData} index={1} />
    //   <Column data={data} setData={setData} index={2} />
    //   <Column data={data} setData={setData} index={3} />
    // </Flex>
    <Button
      display="flex"
      gap="2"
      alignItems="center"
      alignSelf="center"
      type="submit"
    >
      <PlusIcon />
      Create a new Step
    </Button>
  );
}

interface ColumnProps {
  data: number[][];
  setData: (data: number[][]) => void;
  index: number;
}

const Column = ({ data, setData, index }: ColumnProps) => {
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
      />
    );
  }

  return (
    <Flex w={8} direction="column-reverse">
      {stepButtons}
    </Flex>
  );
};

interface StepButtonProps {
  columnIndex: number;
  setStep: (isShown: boolean) => void;
  hasStep: boolean;
}

const StepComponents = [
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowForwardIcon,
];

const StepButton = ({ columnIndex, setStep, hasStep }: StepButtonProps) => {
  const StepComponent = StepComponents[columnIndex];
  const [isHover, setIsHover] = useBoolean();
  const [isStepHover, setIsStepHover] = useBoolean();
  const shouldShowStep = hasStep || isHover;

  return (
    <chakra.button
      onClick={hasStep ? undefined : () => setStep(true)}
      position="relative"
      bg="gray.100"
      display="flex"
      justifyContent="center"
      h="8"
      onMouseEnter={setIsHover.on}
      onMouseLeave={setIsHover.off}
    >
      <chakra.hr
        pos="absolute"
        width="100%"
        top="50%"
        transform="translateY(-50%)"
        borderColor="gray.300"
      />
      {shouldShowStep && (
        <StepComponent
          pos="absolute"
          top="50%"
          transform="translateY(-50%)"
          zIndex={100}
          onClick={() => setStep(false)}
          w={10}
          h={10}
          onMouseEnter={setIsStepHover.on}
          onMouseLeave={setIsStepHover.off}
          color={
            hasStep && isStepHover
              ? "red.400"
              : hasStep
              ? "red.500"
              : "gray.300"
          }
        />
      )}
    </chakra.button>
  );
};
