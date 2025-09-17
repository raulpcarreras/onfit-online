import "react-native-reanimated";
import { LogBox } from "react-native";
import { Slot } from "expo-router";
import { ThemeProvider } from "@repo/design/providers/theme";
import "../global.css";

// Silenciar warnings de desarrollo
LogBox.ignoreLogs(["onAnimatedValueUpdate"]);

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
