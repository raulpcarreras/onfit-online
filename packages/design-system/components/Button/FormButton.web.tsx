import * as React from "react";
import { Button, type ButtonProps } from "./index.web";

export type FormButtonProps = Omit<ButtonProps, "type"> & {
  submit?: boolean; // si true → type="submit"
};

export const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ submit = true, ...props }, ref) => {
    return <Button ref={ref} type={submit ? "submit" : "button"} {...props} />;
  },
);

FormButton.displayName = "FormButton";
