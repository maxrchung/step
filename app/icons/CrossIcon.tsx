import { Icon } from "@chakra-ui/react";

export default function CrossIcon() {
  return (
    <Icon w={6} h={6} viewBox="0 0 512 512">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M368 368L144 144M368 144L144 368"
      />
    </Icon>
  );
}
