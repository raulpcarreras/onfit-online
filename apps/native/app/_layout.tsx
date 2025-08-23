import 'react-native-reanimated';
import { LogBox } from 'react-native';
import { Slot } from 'expo-router';
import { UserProvider } from '../src/lib/user-provider';

// Silenciar warnings de desarrollo
LogBox.ignoreLogs(['onAnimatedValueUpdate']);

export default function RootLayout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
