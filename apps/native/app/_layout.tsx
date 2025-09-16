import 'react-native-reanimated';
import { LogBox } from 'react-native';
import { Slot } from 'expo-router';

// Silenciar warnings de desarrollo
LogBox.ignoreLogs(['onAnimatedValueUpdate']);

export default function RootLayout() {
  return <Slot />;
}
