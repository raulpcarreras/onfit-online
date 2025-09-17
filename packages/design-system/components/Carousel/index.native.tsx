import * as React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

// Carousel Root
export const Carousel = ({ children, className, ...props }: any) => {
  return (
    <View className="w-full" {...props}>
      {children}
    </View>
  );
};

// Carousel API (placeholder para native)
export const CarouselApi = {
  scrollTo: () => {},
  scrollNext: () => {},
  scrollPrev: () => {},
  canScrollNext: true,
  canScrollPrev: true,
};

// Carousel Content
export const CarouselContent = ({ children, className, ...props }: any) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row"
      {...props}
    >
      {children}
    </ScrollView>
  );
};

// Carousel Item
export const CarouselItem = ({ children, className, ...props }: any) => {
  return (
    <View className="flex-shrink-0" {...props}>
      {children}
    </View>
  );
};

// Carousel Next
export const CarouselNext = ({ onPress, className, ...props }: any) => {
  return (
    <Pressable
      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-accent"
      onPress={onPress}
      {...props}
    >
      <Text className="text-foreground">›</Text>
    </Pressable>
  );
};

// Carousel Previous
export const CarouselPrevious = ({ onPress, className, ...props }: any) => {
  return (
    <Pressable
      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-accent"
      onPress={onPress}
      {...props}
    >
      <Text className="text-foreground">‹</Text>
    </Pressable>
  );
};
