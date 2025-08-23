import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from '@/lib/user-provider';

export default function LoginScreen() {
  const { user } = useUser();

  // Si ya hay usuario, no debería estar aquí (el guard lo redirige)
  if (user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ONFIT</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Login (Placeholder)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
