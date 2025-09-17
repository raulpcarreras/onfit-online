import * as React from "react";
import { View, Text, ScrollView } from "react-native";

// Table Root
export const Table = React.forwardRef<
  React.ElementRef<typeof ScrollView>,
  React.ComponentPropsWithoutRef<typeof ScrollView>
>(({ className, children, ...props }, ref) => (
  <ScrollView ref={ref} className="w-full" {...props}>
    {children}
  </ScrollView>
));
Table.displayName = "Table";

// Table Header
export const TableHeader = ({ className, children, ...props }: any) => (
  <View className="bg-muted/50" {...props}>
    {children}
  </View>
);

// Table Body
export const TableBody = ({ className, children, ...props }: any) => (
  <View {...props}>{children}</View>
);

// Table Footer
export const TableFooter = ({ className, children, ...props }: any) => (
  <View className="bg-primary" {...props}>
    {children}
  </View>
);

// Table Row
export const TableRow = ({ className, children, ...props }: any) => (
  <View className="flex-row border-b border-border py-2" {...props}>
    {children}
  </View>
);

// Table Head
export const TableHead = ({ className, children, ...props }: any) => (
  <View className="flex-1 px-2 py-2" {...props}>
    <Text className="font-medium text-muted-foreground text-sm">{children}</Text>
  </View>
);

// Table Cell
export const TableCell = ({ className, children, ...props }: any) => (
  <View className="flex-1 px-2 py-2" {...props}>
    <Text className="text-sm">{children}</Text>
  </View>
);

// Table Caption
export const TableCaption = ({ className, children, ...props }: any) => (
  <View className="mt-4 p-2" {...props}>
    <Text className="text-sm text-muted-foreground text-center">{children}</Text>
  </View>
);
