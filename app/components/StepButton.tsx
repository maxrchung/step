import {
  useBoolean,
  chakra,
  Box,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import { AddOutline, TrashOutline } from "~/icons";
import CommonIcon from "~/icons/CommonIcon";
import StepIcon from "~/icons/StepIcon";
import { loader } from "~/routes/$stepId";
import { Style, STYLE_ICONS } from "~/style";

interface StepButtonProps {
  columnIndex: number;
  setStep: (isShown: boolean) => void;
  hasStep: boolean;
  style: Style;
  spacing: number;
  rowIndex: number;
  rowHoverIndex: number;
  setRowHoverIndex: (index: number) => void;
  data: number[][];
  setData: (data: number[][]) => void;
}

export const StepButton = ({
  columnIndex,
  setStep,
  hasStep,
  style,
  spacing,
  rowIndex,
  rowHoverIndex,
  setRowHoverIndex,
  data,
  setData,
}: StepButtonProps) => {
  const { isOwner } = useLoaderData<typeof loader>();
  const [isHover, setIsHover] = useBoolean();
  const [isStepHover, setIsStepHover] = useBoolean();
  const shouldShowStep = hasStep || isHover;
  const isLast = columnIndex === STYLE_ICONS[style].length - 1;

  return isOwner ? (
    <chakra.button
      onClick={hasStep ? undefined : () => setStep(true)}
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
          onClick={() => setStep(false)}
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
          spacing={0}
        >
          <IconButton
            aria-label="Add line"
            title="Add line"
            icon={<CommonIcon as={AddOutline} />}
            onClick={(event) => {
              console.log("Add line");
              event.stopPropagation();
            }}
          />
          <IconButton
            aria-label="Delete line"
            title="Delete line"
            icon={<CommonIcon as={TrashOutline} />}
            onClick={(event) => {
              const copy = data.map((column) =>
                column.flatMap((step) => {
                  if (step < rowIndex) {
                    return [step];
                  }

                  if (step === rowIndex) {
                    return [];
                  }

                  if (step > rowIndex) {
                    return [step - 1];
                  }

                  return [];
                })
              );
              setData(copy);
              event.stopPropagation();
            }}
          />
        </ButtonGroup>
      )}
    </chakra.button>
  ) : (
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
};
