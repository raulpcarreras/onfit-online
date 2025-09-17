import { cva, type VariantProps } from "class-variance-authority";
import { buttonVariants as shadcnVariants } from "../../ui/button";

type ShadcnProps = VariantProps<typeof shadcnVariants>;
export type ShadcnVariant = ShadcnProps["variant"];
export type ShadcnSize = ShadcnProps["size"];

export const EXTRA_VARIANTS = [
    "onfit",
    "premium",
    "social",
    "success",
    "warning",
] as const;

export type ExtraVariant = (typeof EXTRA_VARIANTS)[number];
export type AnyVariant = ShadcnVariant | ExtraVariant;
export type ExtraSize = "md" | "xl" | "2xl";
export type AnySize = ShadcnSize | ExtraSize;

export const extraButtonVariants = cva("", {
    variants: {
        variant: {
            onfit: "bg-[hsl(var(--onfit))] text-[hsl(var(--onfit-foreground))] hover:bg-[hsl(var(--onfit))]/90",
            premium:
                "bg-gradient-to-r from-[hsl(var(--premium-from))] to-[hsl(var(--premium-to))] text-[hsl(var(--premium-foreground))] hover:opacity-95",
            social: "bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] hover:bg-[hsl(var(--info))]/90",
            success:
                "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]/90",
            warning:
                "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))]/90",
        },
        size: {
            md: "h-10 px-4 text-sm",
            xl: "h-12 px-6 text-base",
            "2xl": "h-14 px-8 text-lg",
        },
    },
});

export function isExtraVariant(v?: AnyVariant): v is ExtraVariant {
    return !!v && (EXTRA_VARIANTS as readonly string[]).includes(v);
}

export function mapSizeToBase(size?: AnySize): ShadcnSize {
    if (!size) return "default";
    if (size === "md") return "default";
    if (size === "xl" || size === "2xl") return "lg";
    return size;
}
