import {
  useBoolean,
  chakra,
  Box,
  IconButton,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import { AddOutline, TrashOutline } from "~/icons";
import CommonIcon from "~/icons/CommonIcon";
import StepIcon from "~/icons/StepIcon";
import { loader } from "~/routes/$stepId";
import { STYLE_ICONS } from "~/style";
import { MAX_STEPS } from "./StepColumn";
import { useStepContext } from "./StepContext";

interface StepButtonProps {
  columnIndex: number;
  rowIndex: number;
  setStep: (columnIndex: number, rowIndex: number, isShown: boolean) => void;
  hasStep: boolean;
}

export const StepButton = ({
  columnIndex,
  setStep,
  hasStep,
  rowIndex,
}: StepButtonProps) => {
  const { steps, setSteps, rowHoverIndex, setRowHoverIndex, spacing, style } =
    useStepContext();

  const { isOwner } = useLoaderData<typeof loader>();
  const [isHover, setIsHover] = useBoolean();
  const [isStepHover, setIsStepHover] = useBoolean();
  const shouldShowStep = hasStep || isHover;
  const isLast = columnIndex === STYLE_ICONS[style].length - 1;
  const toast = useToast();

  if (!isOwner) {
    return (
      <Box
        position="relative"
        bg="gray.100"
        display="flex"
        justifyContent="center"
        h={7}
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
      onClick={hasStep ? undefined : () => setStep(columnIndex, rowIndex, true)}
      position="relative"
      bg="gray.100"
      display="flex"
      justifyContent="center"
      h={`${spacing}px`}
      onMouseEnter={() => {
        setIsHover.on();
        setRowHoverIndex(rowIndex);
      }}
      onMouseLeave={() => {
        setIsHover.off();
        setRowHoverIndex(-1);
      }}
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
          onClick={() => setStep(columnIndex, rowIndex, false)}
          w={6}
          h={6}
          onMouseEnter={setIsStepHover.on}
          onMouseLeave={setIsStepHover.off}
          opacity={hasStep && isStepHover ? 0.5 : hasStep ? 1 : 0.5}
          filter={
            hasStep && isStepHover
              ? undefined
              : hasStep
              ? undefined
              : "grayscale(1)"
          }
          color={
            hasStep && isStepHover
              ? "red.400"
              : hasStep
              ? "red.500"
              : "gray.300"
          }
        />
      )}
      {rowHoverIndex === rowIndex && isLast && (
        <ButtonGroup
          size="xs"
          variant="ghost"
          pos="absolute"
          left="100%"
          top="50%"
          transform="translateY(-50%)"
          pl="1"
          // Add some extra padding so selection doesn't need to be too precise
          pr="5"
          py="5"
          spacing={0}
        >
          <IconButton
            aria-label="Add line"
            title="Add line"
            icon={<CommonIcon as={AddOutline} />}
            onClick={(event) => {
              for (const column of steps) {
                const last = column[column.length - 1];
                if (last >= MAX_STEPS - 1) {
                  toast({
                    description: `We failed to add a line. Steps are limited to ${MAX_STEPS} lines.`,
                    status: "error",
                  });
                  return;
                }
              }
              setSteps(
                steps.map((column) =>
                  column.map((step) => (step < rowIndex ? step : step + 1))
                )
              );
              event.stopPropagation();
            }}
          />
          <IconButton
            aria-label="Delete line"
            title="Delete line"
            icon={<CommonIcon as={TrashOutline} />}
            onClick={(event) => {
              setSteps(
                steps.map((column) =>
                  column.flatMap((step) =>
                    step < rowIndex
                      ? [step]
                      : step === rowIndex
                      ? []
                      : [step - 1]
                  )
                )
              );
              event.stopPropagation();
            }}
          />
        </ButtonGroup>
      )}
    </chakra.button>
  );
};
