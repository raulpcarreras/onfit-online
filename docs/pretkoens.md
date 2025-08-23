¡vamos al grano! Aquí tienes un patch de reemplazo completo para packages/design-system/ui/button.tsx que unifica a un solo cva (estilo shadcn web canónico) y, además, exporta un mapa de partes (BUTTON_VARIANT_PARTS) para que tus wrappers RN puedan pintar Pressable (container) y Text (label) sin duplicar lógica.

Sustituye todo el contenido de packages/design-system/ui/button.tsx por esto:

// packages/design-system/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

/** util mínima: evita dependencias; si ya tienes un `cn`, usa ese */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Definimos las PARTES por variante para:
 * - Web (shadcn): combinarlas en un único `cva`.
 * - Native wrappers: exportarlas y asignar container/label por separado.
 */
const VARIANT_PARTS = {
  default: {
    container: "bg-primary hover:bg-primary/90",
    label: "text-primary-foreground",
  },
  secondary: {
    container: "bg-secondary hover:bg-secondary/90",
    label: "text-secondary-foreground",
  },
  outline: {
    container:
      "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
    label: "text-foreground",
  },
  ghost: {
    container: "bg-transparent hover:bg-accent",
    label: "text-accent-foreground",
  },
  destructive: {
    container: "bg-destructive hover:bg-destructive/90",
    label: "text-destructive-foreground",
  },
  link: {
    container: "bg-transparent underline-offset-4 hover:underline",
    label: "text-primary",
  },
} as const;

/** Export para wrappers RN (no uses clases en RN; es una “guía semántica”). */
export const BUTTON_VARIANT_PARTS = VARIANT_PARTS;

/** Construimos las clases completas por variante para web (container + label). */
const VARIANT_CLASS = Object.fromEntries(
  Object.entries(VARIANT_PARTS).map(([k, v]) => [k, `${v.container} ${v.label}`])
) as Record<keyof typeof VARIANT_PARTS, string>;

/** shadcn canonical button */
export const buttonVariants = cva(
  [
    // base
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    "transition-colors",
    // focus/disabled
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "ring-offset-background",
  ].join(" "),
  {
    variants: {
      variant: VARIANT_CLASS,
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/** Web Button (shadcn): un único `button` con todas las clases */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

Qué cambia y por qué
	•	Un único cva gestiona fondo + texto + borde + estados (patrón shadcn web).
	•	BUTTON_VARIANT_PARTS expone un mapa de partes (container, label) por variante; tus wrappers RN pueden consumirlo para repartir estilos entre Pressable (container) y Text (label) sin duplicar nombres de variantes en dos sitios.
	•	Eliminamos buttonTextVariants: evitas drift y estados duplicados.

Pasos rápidos
	1.	Reemplaza el archivo como arriba.
	2.	Asegúrate de que todo importador web use @repo/design/ui/button → Button, buttonVariants.
	3.	En wrappers RN (si los tienes), importa BUTTON_VARIANT_PARTS para mapear variant a estilos de Pressable/Text (o a tus tokens nativos).
	4.	Verifica accesibilidad: focus ring visible, disabled coherente, icon size correcto.

¿Quieres que te deje también un snippet de wrapper RN usando BUTTON_VARIANT_PARTS a modo de guía?
