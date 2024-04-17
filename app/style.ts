import {
  DdrDown,
  DdrLeft,
  DdrRight,
  DdrUp,
  PiuBottomLeft,
  PiuBottomRight,
  PiuMiddle,
  PiuTopLeft,
  PiuTopRight,
  SmxDown,
  SmxLeft,
  SmxMiddle,
  SmxRight,
  SmxUp,
} from "./icons";

export enum Style {
  DDR_SINGLE = "DDR Single",
  DDR_DOUBLE = "DDR Double",
  PIU_SINGLE = "PIU Single",
  PIU_DOUBLE = "PIU Double",
  SMX_SINGLE = "SMX Single",
  SMX_DOUBLE = "SMX Double",
}

type StepComponent = typeof DdrLeft;

export const STYLE_ICONS: {
  [key in Style]: StepComponent[];
} = {
  [Style.DDR_SINGLE]: [DdrLeft, DdrDown, DdrUp, DdrRight],
  [Style.DDR_DOUBLE]: [
    DdrLeft,
    DdrDown,
    DdrUp,
    DdrRight,
    DdrLeft,
    DdrDown,
    DdrUp,
    DdrRight,
  ],
  [Style.PIU_SINGLE]: [
    PiuBottomLeft,
    PiuTopLeft,
    PiuMiddle,
    PiuTopRight,
    PiuBottomRight,
  ],
  [Style.PIU_DOUBLE]: [
    PiuBottomLeft,
    PiuTopLeft,
    PiuMiddle,
    PiuTopRight,
    PiuBottomRight,
    PiuBottomLeft,
    PiuTopLeft,
    PiuMiddle,
    PiuTopRight,
    PiuBottomRight,
  ],
  [Style.SMX_SINGLE]: [SmxLeft, SmxDown, SmxMiddle, SmxUp, SmxRight],
  [Style.SMX_DOUBLE]: [
    SmxLeft,
    SmxDown,
    SmxMiddle,
    SmxUp,
    SmxRight,
    SmxLeft,
    SmxDown,
    SmxMiddle,
    SmxUp,
    SmxRight,
  ],
};

export const getStyleLength = (style: Style) => STYLE_ICONS[style].length;

export const createEmptyStyle = (style: Style) =>
  Array(STYLE_ICONS[style].length)
    .fill(null)
    .map(() => []);
