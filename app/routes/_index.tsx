import { Flex, Grid, chakra } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function Index() {
  return (
    <Grid
      templateColumns="repeat(4, 1fr)"
      autoRows="auto"
      w="container.sm"
      p="8"
      flexDirection="column-reverse"
    >
      <Flex flexDirection="column-reverse">
        <StepButton />
        <StepButton />
        <StepButton />
        <StepButton />

        <StepButton />
        <StepButton />
        <StepButton />
        <StepButton />
      </Flex>

      <Flex flexDirection="column-reverse">
        <StepButton />
        <StepButton />
        <StepButton />
        <StepButton />

        <StepButton />
        <StepButton />
        <StepButton />
        <StepButton />
      </Flex>
      <Flex flexDirection="column-reverse">
        <StepButton />
        <StepButton />
        <StepButton />
        <StepButton />

        <StepButton />
        <StepButton />
        <StepButton />
        <StepButton />
      </Flex>
      <Flex flexDirection="column-reverse">
        <StepButton />
        <StepButton />
        <StepButton />
        <StepButton />

        <StepButton />
        <StepButton />
        <StepButton />
        <StepButton />
      </Flex>
    </Grid>
  );
}

const StepButton = () => {
  const [hasNote, setHasNote] = useState(true);

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
        // <Img
        //   src="https://maxrchung.com/the-boy.jpg"
        //   position="absolute"
        //   width="100px"
        //   top="50%"
        //   transform="translateY(-50%)"
        //   zIndex={100}
        //   onClick={() => setHasNote(false)}
        // />
        <ArrowUpIcon
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
