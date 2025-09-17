// packages/design-system/components/Button/variants.shared.ts

export const EXTRA_VARIANTS = [
    "onfit",
    "premium",
    "social",
    "success",
    "warning",
] as const;

export type ExtraVariant = (typeof EXTRA_VARIANTS)[number];

export function isExtraVariant(v?: string): v is ExtraVariant {
    return !!v && (EXTRA_VARIANTS as readonly string[]).includes(v);
}

// Tamaños extra que no trae shadcn:
export type ExtraSize = "md" | "xl" | "2xl";

// Mapea tamaños "extra" a tamaños base (si te sirve en web o nativo)
export function mapSizeToBase(size?: string): "sm" | "default" | "lg" {
    if (!size) return "default";
    if (size === "md") return "default";
    if (size === "xl" || size === "2xl") return "lg";
    if (size === "sm" || size === "default" || size === "lg") return size;
    return "default";
}
