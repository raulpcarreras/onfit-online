"use client";

import * as LabelPrimitive from "@rn-primitives/label";
import * as React from "react";
import { cn } from "../lib/utils";

const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Text>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Text> & { onFocus?: () => void }
>(
  (
    { className, onPress, onLongPress, onPressIn, onPressOut, onFocus, ...props },
    ref,
  ) => (
    <LabelPrimitive.Root
      className="web:cursor-default"
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
    >
      <LabelPrimitive.Text
        ref={ref}
        className={cn(
          "text-sm text-foreground native:text-base font-medium leading-none web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70",
          className,
        )}
        {...props}
      />
    </LabelPrimitive.Root>
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
