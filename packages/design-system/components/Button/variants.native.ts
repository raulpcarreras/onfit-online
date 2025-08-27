// packages/design-system/components/Button/variants.native.ts
import type { TextStyle, ViewStyle } from "react-native";
import { EXTRA_VARIANTS, type ExtraVariant } from "./variants.shared";

export type NativeSize = "sm" | "md" | "default" | "lg" | "xl" | "2xl";

export function sizeClasses(size: NativeSize = "default") {
  switch (size) {
    case "sm":
      return "h-8 px-3";
    case "md":
    case "default":
      return "h-10 px-4";
    case "lg":
      return "h-11 px-5";
    case "xl":
      return "h-12 px-6";
    case "2xl":
      return "h-14 px-8";
    default:
      return "h-10 px-4";
  }
}

// style builder para variantes extra (usa ThemeBridge.colors)
export function getExtraVariantStyles(
  variant: ExtraVariant,
  colors: Record<string, string>
): { container: ViewStyle; label: TextStyle; extraClasses?: string } {
  switch (variant) {
    case "onfit":
      return {
        container: { backgroundColor: colors["onfit"] },
        label: { color: colors["onfit-foreground"] },
        extraClasses: "",
      };
    case "premium":
      // ⚠️ Si tienes expo-linear-gradient, puedes hacer un gradient real.
      // De momento, fallback a "from" sólido:
      return {
        container: { backgroundColor: colors["premium-from"] },
        label: { color: colors["premium-foreground"] },
        extraClasses: "",
      };
    case "social":
      return {
        container: { backgroundColor: colors["info"] },
        label: { color: colors["info-foreground"] },
        extraClasses: "",
      };
    case "success":
      return {
        container: { backgroundColor: colors["success"] },
        label: { color: colors["success-foreground"] },
        extraClasses: "",
      };
    case "warning":
      return {
        container: { backgroundColor: colors["warning"] },
        label: { color: colors["warning-foreground"] },
        extraClasses: "",
      };
    default:
      return { container: {}, label: {}, extraClasses: "" };
  }
}

// estilos base para variantes shadcn "core" en native (aprox)
// Puedes ajustarlos si ya los tenías en tu wrapper:
export function getCoreVariantStyles(
  variant: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive",
  colors: Record<string, string>
): { container: ViewStyle; label: TextStyle; extraClasses?: string } {
  switch (variant) {
    case "default":
      return {
        container: { backgroundColor: colors["primary"] },
        label: { color: colors["primary-foreground"] },
        extraClasses: "",
      };
    case "secondary":
      return {
        container: { backgroundColor: colors["secondary"] },
        label: { color: colors["secondary-foreground"] },
        extraClasses: "",
      };
    case "outline":
      return {
        container: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors["border"] },
        label: { color: colors["foreground"] },
        extraClasses: "",
      };
    case "ghost":
      return {
        container: { backgroundColor: "transparent" },
        label: { color: colors["foreground"] },
        extraClasses: "",
      };
    case "link":
      return {
        container: { backgroundColor: "transparent" },
        label: { color: colors["primary"] },
        extraClasses: "p-0 h-auto", // como web
      };
    case "destructive":
      return {
        container: { backgroundColor: colors["destructive"] },
        label: { color: colors["destructive-foreground"] },
        extraClasses: "",
      };
    default:
      return { container: {}, label: {}, extraClasses: "" };
  }
}
