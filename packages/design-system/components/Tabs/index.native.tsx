import * as React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

// Tabs Root
export const Tabs = ({ children, value, onValueChange, className, ...props }: any) => {
  return (
    <View className="w-full" {...props}>
      {children}
    </View>
  );
};

// Tabs List
export const TabsList = ({ children, className, ...props }: any) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="flex-row border-b border-border bg-background"
      {...props}
    >
      {children}
    </ScrollView>
  );
};

// Tabs Trigger
export const TabsTrigger = ({ 
  children, 
  value, 
  onPress, 
  active = false,
  className, 
  ...props 
}: any) => {
  return (
    <Pressable 
      className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
        active 
          ? "border-primary text-primary bg-primary/10" 
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
      onPress={onPress}
      {...props}
    >
      <Text className={active ? "text-primary font-medium" : "text-muted-foreground"}>
        {children}
      </Text>
    </Pressable>
  );
};

// Tabs Content
export const TabsContent = ({ 
  children, 
  value, 
  active = false,
  className, 
  ...props 
}: any) => {
  if (!active) return null;
  
  return (
    <View className="mt-2" {...props}>
      {children}
    </View>
  );
};
