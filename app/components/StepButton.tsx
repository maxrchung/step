import { useBoolean, chakra, Box, useToast } from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import StepIcon from "~/icons/StepIcon";
import { loader } from "~/routes/$stepId";
import { STYLE_ICONS } from "~/style";
import { useStepContext } from "./StepContext";

interface StepButtonProps {
  rowIndex: number;
  columnIndex: number;
  hasStep: boolean;
}

export const StepButton = ({
  rowIndex,
  columnIndex,
  hasStep,
}: StepButtonProps) => {
  const { steps, setSteps, spacing, style } = useStepContext();

  const { isOwner } = useLoaderData<typeof loader>();
  const [isHover, setIsHover] = useBoolean();
  const shouldShowStep = hasStep || isHover;

  const toggleStep = () => {
    steps[columnIndex] = hasStep
      ? // Remove step
        steps[columnIndex].filter((step) => step !== rowIndex)
      : // Add step
        [...steps[columnIndex], rowIndex].sort((a, b) => a - b);
    setSteps([...steps]);
  };

  if (!isOwner) {
    return (
      <Box
        position="relative"
        bg="gray.100"
        display="flex"
        justifyContent="center"
        w={7}
        h={`${spacing}px`}
      >
        <chakra.hr
          pos="absolute"
          width="100%"
          top="50%"
          transform="translateY(-50%)"
          borderColor="gray.300"
        />
        {shouldShowStep && (
          <StepIcon
            as={STYLE_ICONS[style][columnIndex]}
            pos="absolute"
            top="50%"
            transform="translateY(-50%)"
            zIndex={100}
            w={6}
            h={6}
            color="red.500"
          />
        )}
      </Box>
    );
  }

  return (
    <chakra.button
      onClick={hasStep ? undefined : toggleStep}
      position="relative"
      bg="gray.100"
      display="flex"
      justifyContent="center"
      w={7}
      h={`${spacing}px`}
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
        <StepIcon
          as={STYLE_ICONS[style][columnIndex]}
          pos="absolute"
          top="50%"
          transform="translateY(-50%)"
          zIndex={100}
          onClick={toggleStep}
          w={6}
          h={6}
          opacity={hasStep && isHover ? 0.5 : hasStep ? 1 : 0.5}
          filter={
            hasStep && isHover
              ? undefined
              : hasStep
              ? undefined
              : "grayscale(1)"
          }
          color={
            hasStep && isHover ? "red.400" : hasStep ? "red.500" : "gray.300"
          }
        />
      )}
    </chakra.button>
  );
};
