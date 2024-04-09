import { useRef } from "react";

export default function useInitial() {
  const isInitial = useRef(true);
  const temp = isInitial.current;
  isInitial.current = false;
  return temp;
}
