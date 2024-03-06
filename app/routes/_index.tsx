import { Button, Grid, Img, chakra } from "@chakra-ui/react";
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
      <StepButton />
      <StepButton />
      <StepButton />
      <StepButton />

      <StepButton />
      <StepButton />
      <StepButton />
      <StepButton />

      <StepButton />
      <StepButton />
      <StepButton />
      <StepButton />

      <StepButton />
      <StepButton />
      <StepButton />
      <StepButton />

      <StepButton />
      <StepButton />
      <StepButton />
      <StepButton />
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
      borderTop="1px solid black"
      justifyContent="center"
      h="16"
    >
      <Img
        src="https://maxrchung.com/the-boy.jpg"
        position="absolute"
        width="100px"
        top={0}
        transform="translateY(-50%)"
      />
    </chakra.button>
  );
};
