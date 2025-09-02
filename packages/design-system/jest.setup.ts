import '@testing-library/jest-dom';

// Mock de React Native para tests web
jest.mock('react-native', () => ({
  View: 'div',
  Text: 'span',
  TouchableOpacity: 'button',
  ScrollView: 'div',
  FlatList: 'div',
  Image: 'img',
  TextInput: 'input',
  Switch: 'input',
  Modal: 'div',
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'web',
  },
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// Mock de NativeWind
jest.mock('nativewind', () => ({
  styled: (Component: any) => Component,
  useColorScheme: () => 'light',
}));

// Mock de next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock de @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn().mockImplementation(() => ({
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
    invalidateQueries: jest.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Mock de expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      eas: {
        projectId: 'test-project-id',
      },
    },
  },
}));

// Mock de react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn(),
  useAnimatedStyle: jest.fn(),
  withSpring: jest.fn(),
  withTiming: jest.fn(),
}));

// Mock de expo-linear-gradient
jest.mock('expo-linear-gradient', () => 'LinearGradient');

// Mock de expo-clipboard
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
  getStringAsync: jest.fn(),
}));

// Configuración global para tests
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));
