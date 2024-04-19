import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  Select,
  chakra,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator.server";
import { getStep } from "~/db";
import Delete from "./$stepId.delete";
import useInitial from "~/hooks/useInitial";
import CommonIcon from "~/icons/CommonIcon";
import {
  BackspaceOutline,
  CloseOutline,
  CreateOutline,
  LinkOutline,
  TrashOutline,
} from "~/icons";
import StepIcon from "~/icons/StepIcon";
import { STYLE_ICONS, Style, createEmptyStyle } from "~/style";

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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.step.title ? `${data?.step.title} - Step` : "Step" }];
};

export default function Step() {
  const { step, isOwner } = useLoaderData<typeof loader>();
  const [style, setStyle] = useState<Style>(step.style);
  const [steps, setSteps] = useState<number[][]>(step.steps);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(step.title);
  const toast = useToast();
  const editNameFetcher = useFetcher();
  const editStyleFetcher = useFetcher();
  const editStepsFetcher = useFetcher();
  const isInitial = useInitial();

  useEffect(() => {
    if (!isOwner || isInitial) {
      return;
    }

    const timeout = setTimeout(() => {
      editStepsFetcher.submit(
        { steps: steps },
        {
          action: `/${step.id}/editsteps`,
          method: "patch",
          encType: "application/json",
        }
      );
    }, DEBOUNCE_TIME);

    return () => clearTimeout(timeout);
  }, [steps]);

  useEffect(() => {
    if (editNameFetcher.data) {
      setIsEdit(false);
    }
  }, [editNameFetcher.data]);

  return (
    <Flex flexDir="column" gap="5" align="center">
      <Container centerContent>
        {isEdit ? (
          <Flex
            gap="2"
            align="center"
            width="100%"
            as={editNameFetcher.Form}
            action={`/${step.id}/editname`}
            method="patch"
            onSubmit={(event) => {
              if (title === step.title) {
                setIsEdit(false);
                event.preventDefault();
              }
            }}
          >
            <Input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              name="title"
            />
            <Flex>
              <IconButton
                aria-label="Confirm"
                title="Confirm"
                icon={<CommonIcon as={CheckmarkOutline} />}
                variant="ghost"
                type="submit"
                isDisabled={editNameFetcher.state === "submitting"}
              />

              <IconButton
                aria-label="Cancel"
                title="Cancel"
                icon={<CommonIcon as={CloseOutline} />}
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
              {title}
            </Heading>

            {isOwner && (
              <IconButton
                aria-label="Edit name"
                title="Edit name"
                icon={<CommonIcon as={CreateOutline} />}
                variant="ghost"
                onClick={() => setIsEdit(true)}
              />
            )}
          </Flex>
        )}
      </Container>

      <Flex>
        {isOwner && (
          <Select
            isDisabled={!isOwner}
            onChange={(event) => {
              const option = event.target.value as Style;

              const response = steps.find((column) => column.length > 0)
                ? confirm(
                    "Are you sure you want to change the style? All the current steps will be deleted."
                  )
                : true;

              if (response) {
                const formData = new FormData();
                formData.set("style", option);
                editStyleFetcher.submit(formData, {
                  method: "post",
                  action: `/${step.id}/editstyle`,
                });
                setStyle(option);
                setSteps(createEmptyStyle(option));
              }
            }}
            value={style}
            mr={2}
          >
            {Object.values(Style).map((style) => (
              <option key={style}>{style}</option>
            ))}
          </Select>
        )}

        <IconButton
          aria-label="Copy link"
          title="Copy link"
          icon={<CommonIcon as={LinkOutline} />}
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
          <IconButton
            aria-label="Clear all"
            title="Clear all"
            icon={<CommonIcon as={BackspaceOutline} />}
            variant="ghost"
            onClick={() => {
              const response = confirm(
                "Are you sure you want to clear all the current steps? This cannot be undone."
              );

              if (response) {
                setSteps(createEmptyStyle(step.style));
              }
            }}
          />
        )}

        {isOwner && (
          <Delete id={step.id} title={step.title}>
            <IconButton
              aria-label="Delete"
              title="Delete"
              icon={<CommonIcon as={TrashOutline} />}
              variant="ghost"
              type="submit"
            />
          </Delete>
        )}
      </Flex>

      <Flex justify="center">
        {STYLE_ICONS[style].map((_step, index) => (
          <Column
            key={index}
            data={steps}
            setData={setSteps}
            index={index}
            style={style}
          />
        ))}
      </Flex>
    </Flex>
  );
}

interface ColumnProps {
  data: number[][];
  setData: (data: number[][]) => void;
  index: number;
  style: Style;
}

const Column = ({ data, setData, index, style }: ColumnProps) => {
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
        style={style}
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
  style: Style;
}

const StepButton = ({
  columnIndex,
  setStep,
  hasStep,
  style,
}: StepButtonProps) => {
  const { step, isOwner } = useLoaderData<typeof loader>();
  const [isHover, setIsHover] = useBoolean();
  const [isStepHover, setIsStepHover] = useBoolean();
  const shouldShowStep = hasStep || isHover;

  return isOwner ? (
    <chakra.button
      onClick={hasStep ? undefined : () => setStep(true)}
      position="relative"
      bg="gray.100"
      display="flex"
      justifyContent="center"
      h={8}
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
    </chakra.button>
  ) : (
    <Box
      position="relative"
      bg="gray.100"
      display="flex"
      justifyContent="center"
      h={8}
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
          as={STYLE_ICONS[step.style][columnIndex]}
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
