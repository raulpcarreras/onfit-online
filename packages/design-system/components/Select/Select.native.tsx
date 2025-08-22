import * as React from "react";
import { View, Text, Pressable } from "react-native";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  value?: string;
  onValueChange?: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string; // ignorado en native
  disabled?: boolean;
};

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Selecciona…",
  label,
  disabled,
}: SelectProps) {
  // Stub minimal para RN: lista de botones
  return (
    <View style={{ gap: 8 }}>
      {label ? <Text style={{ opacity: 0.7 }}>{label}</Text> : null}
      <Text>{value ? options.find(o => o.value === value)?.label : placeholder}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {options.map((o) => (
          <Pressable
            key={o.value}
            disabled={disabled || o.disabled}
            onPress={() => onValueChange?.(o.value)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
              borderWidth: 1,
              opacity: disabled || o.disabled ? 0.5 : 1,
            }}
          >
            <Text>{o.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
