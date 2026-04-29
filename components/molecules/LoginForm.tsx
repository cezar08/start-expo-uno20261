import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { Button } from '@/components/atoms/Button';
import { InputWithLabel } from '@/components/molecules/InputWithLabel';

export type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  errorMessage?: string | null;
};

export function LoginForm({ onSubmit, loading = false, errorMessage }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    await onSubmit(email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <InputWithLabel
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
        />
        <InputWithLabel
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />
        <Button
          title="Entrar"
          onPress={handleSubmit}
          loading={loading}
          disabled={!email.trim() || !password || loading}
          style={styles.button}
        />
        {errorMessage ? (
          <View style={styles.errorWrap}>
            <AppText variant="caption" style={styles.errorText}>
              {errorMessage}
            </AppText>
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  form: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  button: {
    marginTop: 8,
  },
  errorWrap: {
    marginTop: 12,
  },
  errorText: {
    color: '#d64045',
  },
});
