import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/Button"; // o '../ui/button' si prefieres
import { useThemeBridge } from "../providers/theme";
import { useEffect } from "react";

// Hook para sincronizar el tema con Storybook
function useStorybookThemeSync() {
  const { resolvedMode } = useThemeBridge();

  useEffect(() => {
    // Cambiar la clase .dark del HTML según el tema
    if (typeof document !== "undefined") {
      const html = document.documentElement;

      if (resolvedMode === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  }, [resolvedMode]);
}

const meta = {
  title: "Components/Button",
  component: Button as any,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
  argTypes: {
    onClick: { action: "click" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Botón con variantes y tamaños del design system. El tema se cambia automáticamente desde el panel de controles de Storybook.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    useStorybookThemeSync();
    return <Button {...args} />;
  },
};

export const Variants: Story = {
  render: (args) => {
    useStorybookThemeSync();
    return (
      <div className="space-y-4">
        <div className="flex gap-3 flex-wrap">
          <h3 className="w-full text-lg font-semibold mb-2">Variantes Shadcn:</h3>
          <Button {...args} variant="default">
            Default
          </Button>
          <Button {...args} variant="secondary">
            Secondary
          </Button>
          <Button {...args} variant="outline">
            Outline
          </Button>
          <Button {...args} variant="ghost">
            Ghost
          </Button>
          <Button {...args} variant="link">
            Link
          </Button>
          <Button {...args} variant="destructive">
            Destructive
          </Button>
        </div>

        <div className="flex gap-3 flex-wrap">
          <h3 className="w-full text-lg font-semibold mb-2">Variantes Personalizadas:</h3>
          <Button {...args} variant="onfit">
            Onfit
          </Button>
          <Button {...args} variant="premium">
            Premium
          </Button>
          <Button {...args} variant="social">
            Social
          </Button>
          <Button {...args} variant="success">
            Success
          </Button>
          <Button {...args} variant="warning">
            Warning
          </Button>
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: (args) => {
    useStorybookThemeSync();
    return (
      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <h3 className="w-full text-lg font-semibold mb-2">Tamaños Shadcn:</h3>
          <Button {...args} size="sm">
            sm
          </Button>
          <Button {...args} size="default">
            default
          </Button>
          <Button {...args} size="lg">
            lg
          </Button>
          <Button {...args} size="icon" aria-label="icon button">
            👍
          </Button>
        </div>

        <div className="flex gap-3 items-center">
          <h3 className="w-full text-lg font-semibold mb-2">Tamaños Personalizados:</h3>
          <Button {...args} size="md">
            md
          </Button>
          <Button {...args} size="xl">
            xl
          </Button>
          <Button {...args} size="2xl">
            2xl
          </Button>
        </div>
      </div>
    );
  },
};
