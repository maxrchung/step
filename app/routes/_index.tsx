import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowForwardIcon,
  ArrowBackIcon,
} from "@chakra-ui/icons";
import { Flex, Grid, chakra } from "@chakra-ui/react";
import { useState } from "react";

// TODO:
//

const data = [
  [0, 3, 5, 20],
  [2, 4, 8, 20],
  [1, 2, 3],
  [4, 5, 6],
];

const MAX_NOTES = 140;

export default function Index() {
  return (
    <Grid
      templateColumns="repeat(4, 1fr)"
      autoRows="auto"
      w="container.sm"
      p="8"
      flexDirection="column-reverse"
    >
      <Column data={data} index={0} />
      <Column data={data} index={1} />
      <Column data={data} index={2} />
      <Column data={data} index={3} />
    </Grid>
  );
}

interface ColumnProps {
  data: number[][];
  index: number;
}

const Column = ({ data, index }: ColumnProps) => {
  const column = data[index];

  let columnIndex = column.length - 1;
  const stepButtons = [];

  for (let i = MAX_NOTES; i >= 0; --i) {
    const hasNote = column[columnIndex] === i;
    if (hasNote) {
      --columnIndex;
    }

    stepButtons.push(
      <StepButton key={i} arrowIndex={index} initialHasNote={hasNote} />
    );
  }

  return <Flex flexDirection="column-reverse">{stepButtons}</Flex>;
};

interface StepButtonProps {
  arrowIndex: number;
  initialHasNote: boolean;
}

const ArrowComponents = [
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowForwardIcon,
];

const StepButton = ({ arrowIndex, initialHasNote }: StepButtonProps) => {
  const ArrowComponent = ArrowComponents[arrowIndex];
  const [hasNote, setHasNote] = useState(initialHasNote);

  return (
    <chakra.button
      onClick={() => setHasNote(!hasNote)}
      position="relative"
      bg="gray.100"
      display="flex"
      justifyContent="center"
      h="16"
    >
      <chakra.hr
        pos="absolute"
        borderTop="1px solid black"
        width="100%"
        top="50%"
        transform="translateY(-50%)"
      />
      {hasNote && (
        <ArrowComponent
          pos="absolute"
          top="50%"
          transform="translateY(-50%)"
          zIndex={100}
          onClick={() => setHasNote(false)}
          w={16}
          h={16}
          color="red"
        />
      )}
    </chakra.button>
  );
};
