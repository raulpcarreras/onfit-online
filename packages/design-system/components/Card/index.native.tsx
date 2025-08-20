import React from "react";
import { View, Text, StyleSheet, ViewProps } from "react-native";

export function Card({ style, children, ...rest }: ViewProps & { children?: React.ReactNode }) {
  return <View style={[s.card, style]} {...rest}>{children}</View>;
}
export function CardHeader({ children }: { children?: React.ReactNode }) { return <View style={s.header}>{children}</View>; }
export function CardTitle({ children }: { children?: React.ReactNode }) { return <Text style={s.title}>{children}</Text>; }
export function CardDescription({ children }: { children?: React.ReactNode }) { return <Text style={s.desc}>{children}</Text>; }
export function CardContent({ children }: { children?: React.ReactNode }) { return <View style={s.content}>{children}</View>; }
export function CardFooter({ children }: { children?: React.ReactNode }) { return <View style={s.footer}>{children}</View>; }

export default Card;

const s = StyleSheet.create({
  card: { backgroundColor: "#111827", borderColor: "#262626", borderWidth: 1, borderRadius: 12, padding: 12 },
  header: { marginBottom: 8 },
  title: { color: "#fff", fontWeight: "600", fontSize: 16 },
  desc: { color: "#9CA3AF" },
  content: { },
  footer: { marginTop: 8 },
});
