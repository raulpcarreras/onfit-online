import * as React from "react";
import { View, Text, Pressable } from "react-native";
import { Button } from "../Button";
import { CalendarIcon } from "../../icons/Calendar";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const DatePicker = ({ 
  date, 
  onSelect, 
  placeholder = "Seleccionar fecha",
  disabled = false 
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePress = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View className="w-full">
      <Button
        variant="outline"
        onPress={handlePress}
        disabled={disabled}
        className="w-full justify-start"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        <Text className="text-left font-normal">
          {date ? formatDate(date) : placeholder}
        </Text>
      </Button>
      
      {isOpen && (
        <View className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50">
          <View className="p-4">
            <Text className="text-center text-muted-foreground mb-4">
              Selecciona una fecha
            </Text>
            <View className="flex-row justify-between">
              <Pressable 
                className="px-3 py-2 bg-primary rounded-md"
                onPress={() => {
                  onSelect?.(new Date());
                  setIsOpen(false);
                }}
              >
                <Text className="text-primary-foreground">Hoy</Text>
              </Pressable>
              <Pressable 
                className="px-3 py-2 bg-secondary rounded-md"
                onPress={() => {
                  onSelect?.(undefined);
                  setIsOpen(false);
                }}
              >
                <Text className="text-secondary-foreground">Limpiar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
