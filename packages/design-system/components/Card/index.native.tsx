// packages/design-system/components/Card/index.native.tsx
import React from "react";
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native";

export function Card(props: ViewProps) {
  return <View style={[styles.card, props.style]}>{props.children}</View>;
}
export function CardHeader(props: ViewProps) { return <View style={[styles.section, props.style]}>{props.children}</View>; }
export function CardContent(props: ViewProps) { return <View style={[styles.section, props.style]}>{props.children}</View>; }
export function CardFooter(props: ViewProps) { return <View style={[styles.section, props.style]}>{props.children}</View>; }
export function CardTitle(props: TextProps) { return <Text style={[styles.title, (props as any).style]}>{props.children}</Text>; }
export function CardDescription(props: TextProps) { return <Text style={[styles.desc, (props as any).style]}>{props.children}</Text>; }

const styles = StyleSheet.create({
  card: { backgroundColor: "#111", borderRadius: 12, borderWidth: 1, borderColor: "#262626" },
  section: { padding: 16 },
  title: { fontSize: 16, fontWeight: "600", color: "#fff" },
  desc: { fontSize: 13, color: "#9ca3af" },
});
