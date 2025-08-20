import React from "react";
import { View, Image, Text, StyleSheet, ImageProps } from "react-native";
export const Avatar = ({ children }: { children?: React.ReactNode }) => <View style={s.wrap}>{children}</View>;
export const AvatarImage = (props: ImageProps) => <Image style={s.img} {...props} />;
export const AvatarFallback = ({ children }: { children?: React.ReactNode }) => (
  <View style={[s.img, s.fallback]}><Text style={{ color: "#F59E0B" }}>{children}</Text></View>
);
export default Avatar;
const s = StyleSheet.create({
  wrap: { width: 32, height: 32, borderRadius: 9999, overflow: "hidden" },
  img: { width: 32, height: 32, borderRadius: 9999 },
  fallback: { backgroundColor: "rgba(245,158,11,0.15)", alignItems: "center", justifyContent: "center" },
});
