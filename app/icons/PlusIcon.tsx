import { Icon } from "@chakra-ui/react";

export default function PlusIcon() {
  return (
    <Icon w={6} h={6} viewBox="0 0 512 512">
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="M256 112v288M400 256H112"
      />
    </Icon>
  );
}
