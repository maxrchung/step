import {
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useToast,
} from "@chakra-ui/react";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { authenticator } from "~/auth/authenticator.server";
import { getStep } from "~/db";
import Delete from "./$stepId.delete";
import useInitial from "~/hooks/useInitial";
import CommonIcon from "~/icons/CommonIcon";
import {
  BackspaceOutline,
  CheckmarkOutline,
  CloseOutline,
  CreateOutline,
  LinkOutline,
  TrashOutline,
} from "~/icons";
import { STYLE_ICONS, Style, createEmptyStyle } from "~/style";
import { Column } from "~/components/Column";

const DEBOUNCE_TIME = 1000;

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  if (!params.stepId) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const user = (await authenticator.isAuthenticated(request)) || undefined;
  const step = await getStep(params.stepId);

  if (!step) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const isOwner = user?.id === step.owner;

  return json({ step, isOwner });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.step?.title ? `${data?.step?.title} - Step` : "Step" },
  ];
};

export default function Step() {
  const { step, isOwner } = useLoaderData<typeof loader>();
  const [style, setStyle] = useState<Style>(step.style);
  const [steps, setSteps] = useState<number[][]>(step.steps);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(step.title);
  const toast = useToast();
  const editFetcher = useFetcher();
  const [isSyncing, setIsSyncing] = useState(false);
  const isInitial = useInitial();
  const [spacing, setSpacing] = useState(step.spacing ?? 28);
  const [rowHoverIndex, setRowHoverIndex] = useState(-1);

  useEffect(() => {
    if (!isOwner || isInitial) {
      return;
    }

    const timeout = setTimeout(() => {
      editFetcher.submit(
        { steps: steps },
        {
          action: `/${step.id}/editsteps`,
          method: "patch",
          encType: "application/json",
        }
      );
      setIsSyncing(false);
    }, DEBOUNCE_TIME);

    setIsSyncing(true);

    return () => clearTimeout(timeout);
  }, [steps]);

  // Using the stepper, you can make a lot of spacing changes quickly which can
  // be annoying to show so many toast notifications. Probably a good idea to
  // debounce it like this so there aren't so many updates.
  useEffect(() => {
    if (!isOwner || isInitial) {
      return;
    }

    const timeout = setTimeout(() => {
      const formData = new FormData();
      formData.set("spacing", spacing.toString());
      editFetcher.submit(formData, {
        method: "post",
        action: `/${step.id}/editspacing`,
      });
    }, DEBOUNCE_TIME);

    return () => clearTimeout(timeout);
  }, [spacing]);

  useEffect(() => {
    if (editFetcher.data) {
      setIsEdit(false);
    }
  }, [editFetcher.data]);

  return (
    <Flex flexDir="column" gap="5" align="center">
      <Container centerContent>
        {isEdit ? (
          <Flex
            gap="2"
            align="center"
            width="100%"
            as={editFetcher.Form}
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
                isDisabled={editFetcher.state === "submitting"}
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
                editFetcher.submit(formData, {
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

        {isOwner && (
          <NumberInput
            onChange={(value) => {
              setSpacing(Number(value));
            }}
            value={spacing}
            mr={2}
            inputMode="numeric"
            min={0}
          >
            <NumberInputField w={20} />
            <NumberInputStepper>
              <NumberIncrementStepper
                aria-label="Increase spacing"
                title="Increase spacing"
              />
              <NumberDecrementStepper
                aria-label="Decrease spacing"
                title="Decrease spacing"
              />
            </NumberInputStepper>
          </NumberInput>
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
                toast({
                  description: "You cleared all the steps.",
                  status: "success",
                });
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
            spacing={spacing}
            rowHoverIndex={rowHoverIndex}
            setRowHoverIndex={setRowHoverIndex}
          />
        ))}
      </Flex>

      {
        // Not sure if I want this or not, I think I'll remove it for now
        // isSyncing && <Spinner aria-label="Syncing" pos="fixed" bottom="5" />
      }
    </Flex>
  );
}
