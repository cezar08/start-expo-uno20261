import React from 'react';
import { View, StyleSheet } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { Input, type InputProps } from '@/components/atoms/Input';

export type InputWithLabelProps = InputProps & {
  label: string;
};

export function InputWithLabel({ label, ...inputProps }: InputWithLabelProps) {
  return (
    <View style={styles.container}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
      <Input {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
});
