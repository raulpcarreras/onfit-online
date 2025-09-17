import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface SimpleButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export function SimpleButton({ title, onPress, disabled = false }: SimpleButtonProps) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#CCCCCC',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
