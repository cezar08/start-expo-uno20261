import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/atoms/AppText';
import { LoginForm } from '@/components/molecules/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, authError } = useAuth();
  const { isConnected } = useNetworkStatus();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    if (isConnected === false) {
      Alert.alert('Sem internet', 'Conectar o dispositivo para autenticar.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <AppText variant="title" style={styles.title}>
          Bem-vindo
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          Entre com seu e-mail e senha para continuar.
        </AppText>
      </View>
      <LoginForm onSubmit={handleSubmit} loading={loading} errorMessage={authError} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
});
