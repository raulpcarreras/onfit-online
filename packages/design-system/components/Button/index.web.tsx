// packages/design-system/components/Button/index.web.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  // base
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "bg-transparent hover:bg-accent",
        link: "bg-transparent underline-offset-4 hover:underline text-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// 🔒 TIPADO: prohíbe onClick y expone onPress
type DOMProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "children"
>;

export type ButtonProps = DOMProps &
  VariantProps<typeof buttonVariants> & {
    onPress?: React.MouseEventHandler<HTMLButtonElement>;
    children?: React.ReactNode;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onPress, variant, size, type, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        // aseguramos type por defecto
        type={type ?? "button"}
        onClick={onPress}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };
