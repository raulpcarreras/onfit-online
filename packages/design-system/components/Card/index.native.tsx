// packages/design-system/components/Card/index.native.tsx
import React from "react";
import { View, Text, ViewProps, TextProps } from "react-native";
import { useThemeBridge } from "../../providers/theme";

export function Card(props: ViewProps) {
  const { colors } = useThemeBridge();
  
  return (
    <View 
      className="rounded-xl border border-input"
      style={[
        { backgroundColor: colors.card, borderColor: colors.border },
        props.style
      ]}
    >
      {props.children}
    </View>
  );
}

export function CardHeader(props: ViewProps) { 
  return <View className="p-4" style={props.style}>{props.children}</View>; 
}

export function CardContent(props: ViewProps) { 
  return <View className="p-4" style={props.style}>{props.children}</View>; 
}

export function CardFooter(props: ViewProps) { 
  return <View className="p-4" style={props.style}>{props.children}</View>; 
}

export function CardTitle(props: TextProps) { 
  const { colors } = useThemeBridge();
  
  return (
    <Text 
      className="text-base font-semibold"
      style={[{ color: colors.foreground }, (props as any).style]}
    >
      {props.children}
    </Text>
  ); 
}

export function CardDescription(props: TextProps) { 
  const { colors } = useThemeBridge();
  
  return (
    <Text 
      className="text-sm"
      style={[{ color: colors["muted-foreground"] }, (props as any).style]}
    >
      {props.children}
    </Text>
  ); 
}
