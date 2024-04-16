// Most icons will be sized similarly so this common class helps with that.

// Lol ionno about this forwardRef stuff
// https://v2.chakra-ui.com/community/recipes/as-prop#option-1-using-forwardref-from-chakra-uireact
import { forwardRef, Icon, IconProps } from "@chakra-ui/react";

const StepIcon = forwardRef<IconProps, "svg">((props, ref) => (
  <Icon boxSize={6} ref={ref} {...props} />
));

export default StepIcon;
