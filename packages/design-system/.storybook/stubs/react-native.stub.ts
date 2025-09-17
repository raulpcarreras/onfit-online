// Stub para react-native en Storybook web
export const View = () => null;
export const Text = () => null;
export const Pressable = () => null;
export const ActivityIndicator = () => null;
export const Appearance = {
    getColorScheme: () => "light",
    addChangeListener: () => ({ remove: () => {} }),
};
export const StyleSheet = {
    create: (styles: any) => styles,
};
export const Dimensions = {
    get: () => ({ width: 375, height: 812 }),
};
export const Platform = {
    OS: "web",
    select: (obj: any) => obj.web || obj.default,
};
export default {};
