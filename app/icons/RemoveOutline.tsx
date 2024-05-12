import * as React from "react";
import type { SVGProps } from "react";
const SvgRemoveOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="ionicon"
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M400 256H112"
    />
  </svg>
);
export default SvgRemoveOutline;
