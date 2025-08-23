import * as React from "react";
import { View, Text } from "react-native";

// Chart Components - Placeholder para Native
// En producción, usar librerías como react-native-chart-kit o victory-native

export const LineChart = ({ children, className, ...props }: any) => {
  return (
    <View className="w-full h-64 bg-muted rounded-lg p-4" {...props}>
      <Text className="text-center text-muted-foreground">Chart no disponible en Native</Text>
      {children}
    </View>
  );
};

export const Line = (props: any) => <View {...props} />;
export const AreaChart = ({ children, ...props }: any) => <View {...props}>{children}</View>;
export const Area = (props: any) => <View {...props} />;
export const BarChart = ({ children, ...props }: any) => <View {...props}>{children}</View>;
export const Bar = (props: any) => <View {...props} />;
export const PieChart = ({ children, ...props }: any) => <View {...props}>{children}</View>;
export const Pie = (props: any) => <View {...props} />;
export const Cell = (props: any) => <View {...props} />;
export const XAxis = (props: any) => <View {...props} />;
export const YAxis = (props: any) => <View {...props} />;
export const CartesianGrid = (props: any) => <View {...props} />;
export const Tooltip = (props: any) => <View {...props} />;
export const Legend = (props: any) => <View {...props} />;
export const ResponsiveContainer = ({ children, ...props }: any) => <View {...props}>{children}</View>;
