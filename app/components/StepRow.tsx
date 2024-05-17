import {
  useBoolean,
  useToast,
  Flex,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import {
  AddOutline,
  ChevronBackOutline,
  CloseOutline,
  TrashOutline,
} from "~/icons";
import CommonIcon from "~/icons/CommonIcon";
import { StepButton } from "./StepButton";
import { MAX_STEPS } from "./StepRows";
import { loader } from "~/routes/$stepId";
import { useStepContext } from "./StepContext";

interface StepRowProps {
  row: boolean[];
  rowIndex: number;
}

export const StepRow = ({ row, rowIndex }: StepRowProps) => {
  const { steps, setSteps } = useStepContext();
  const [isHover, setIsHover] = useBoolean();
  const [isToggle, setIsToggle] = useBoolean();
  const { isOwner } = useLoaderData<typeof loader>();
  const toast = useToast();

  const shouldShow = isHover || isToggle;

  return (
    <Flex position="relative">
      {row.map((hasStep, index) => (
        <StepButton
          key={index}
          rowIndex={rowIndex}
          columnIndex={index}
          hasStep={hasStep}
        />
      ))}

      {isOwner && (
        <ButtonGroup
          size="xs"
          variant="ghost"
          pos="absolute"
          left="100%"
          top="50%"
          transform="translateY(-50%)"
          pl="1"
          spacing={0}
          onMouseEnter={setIsHover.on}
          onMouseLeave={setIsHover.off}
        >
          {shouldShow ? (
            <>
              <IconButton
                aria-label="Add line"
                title="Add line"
                icon={<CommonIcon as={AddOutline} />}
                onClick={() => {
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
                }}
              />

              <IconButton
                aria-label="Delete line"
                title="Delete line"
                icon={<CommonIcon as={TrashOutline} />}
                onClick={() => {
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
                }}
              />

              <IconButton
                aria-label="Close"
                title="Close"
                icon={<CommonIcon as={CloseOutline} />}
                onClick={() => {
                  setIsHover.off();
                  setIsToggle.off();
                }}
              />
            </>
          ) : (
            <IconButton
              aria-label="Toggle"
              title="Toggle"
              icon={
                <CommonIcon
                  as={ChevronBackOutline}
                  color="gray.300"
                  rotate="180deg"
                />
              }
              onClick={setIsToggle.toggle}
            />
          )}
        </ButtonGroup>
      )}
    </Flex>
  );
};
