import React from "react";
import { Stack } from "expo-router";
import { UserProvider } from "@/lib/user-provider";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </UserProvider>
  );
}
