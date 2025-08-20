import React from "react";
import { View } from "react-native";
type FC<P = any> = React.FC<React.PropsWithChildren<P>>;
export const Tooltip: FC = ({ children }) => <View>{children}</View>;
export const TooltipTrigger: FC = ({ children }) => <View>{children}</View>;
export const TooltipContent: FC = ({ children }) => <View>{children}</View>;
export default Tooltip;
