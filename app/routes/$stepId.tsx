import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowForwardIcon,
  ArrowBackIcon,
} from "@chakra-ui/icons";
import {
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  chakra,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator.server";
import { getStep } from "~/db";
import Delete from "./$stepId.delete";
import DeleteIcon from "~/icons/DeleteIcon";
import EditIcon from "~/icons/EditIcon";
import CheckIcon from "~/icons/CheckIcon";
import CrossIcon from "~/icons/CrossIcon";
import LinkIcon from "~/icons/LinkIcon";

const MAX_NOTES = 140;
const DEBOUNCE_TIME = 1000;

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.stepId, "Step ID is missing.");

  const user = (await authenticator.isAuthenticated(request)) || undefined;
  const step = await getStep(params.stepId);

  invariant(step, `We failed to load Step with ID ${params.stepId}.`);
  const isOwner = user?.id === step.owner;

  return json({ step, isOwner });
};

export default function Step() {
  const { step, isOwner } = useLoaderData<typeof loader>();
  const [data, setData] = useState<number[][]>(step.steps ?? [[], [], [], []]);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(step.title);
  const toast = useToast();

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log(data);
    }, DEBOUNCE_TIME);
    return () => clearTimeout(timeout);
  }, [data]);

  return (
    <Flex flexDir="column" gap="5" align="center">
      <Container centerContent>
        {isEdit ? (
          <Flex gap="2" align="center" width="100%">
            <Input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <Flex>
              <IconButton
                aria-label="Confirm"
                title="Confirm"
                icon={<CheckIcon />}
                variant="ghost"
                onClick={() => setIsEdit(true)}
              />
              <IconButton
                aria-label="Cancel"
                title="Cancel"
                icon={<CrossIcon />}
                variant="ghost"
                onClick={() => {
                  setIsEdit(false);
                  setTitle(step.title);
                }}
              />
            </Flex>
          </Flex>
        ) : (
          <Flex gap="2" width="100%" justify="center">
            <Heading size="lg" minWidth="0">
              {step.title}
            </Heading>

            {isOwner && (
              <IconButton
                aria-label="Edit name"
                title="Edit name"
                icon={<EditIcon />}
                variant="ghost"
                onClick={() => setIsEdit(true)}
              />
            )}
          </Flex>
        )}
      </Container>

      <Flex>
        <IconButton
          aria-label="Copy link"
          title="Copy link"
          icon={<LinkIcon />}
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(location.href);
            toast({
              description: "Link copied to clipboard.",
              status: "success",
            });
          }}
        />

        {isOwner && (
          <Delete id={step.id} title={step.title}>
            <IconButton
              aria-label="Delete"
              title="Delete"
              icon={<DeleteIcon />}
              variant="ghost"
              type="submit"
            />
          </Delete>
        )}
      </Flex>

      <Flex justify="center">
        <Column data={data} setData={setData} index={0} />
        <Column data={data} setData={setData} index={1} />
        <Column data={data} setData={setData} index={2} />
        <Column data={data} setData={setData} index={3} />
      </Flex>
    </Flex>
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
