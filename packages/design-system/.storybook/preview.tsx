import type { Preview } from "@storybook/react";
import React from "react";

// ✅ importa tus tokens + tailwind una vez aquí (los mismos que usas en la app)
import "../.storybook/preview.css"; // Tailwind + tokens HSL

// ✅ tu ThemeProvider web real
import { ThemeProvider } from "../providers/theme/ThemeProvider.web";

export const globalTypes = {
  theme: {
    description: "Global theme",
    defaultValue: "light", // 👈 valor inicial
    toolbar: {
      icon: "mirror",
      items: [
        { value: "light", title: "Light" },
        { value: "dark", title: "Dark" },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as "light" | "dark";

      // 👉 sincroniza la clase en <html> del iframe para que Tailwind/vars funcionen
      React.useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
      }, [theme]);

      return (
        <ThemeProvider defaultMode={theme}>
          <div className="min-h-fit bg-background text-foreground p-6">
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],

  parameters: {
    // ❌ Desacopla el addon de backgrounds para que NO te pise el tema al cambiar de story
    backgrounds: {
      // Opción A: deshabilitarlo por completo
      disable: true,
    },
    layout: "centered",
    controls: { expanded: true },
  },
};

export default preview;
