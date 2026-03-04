import React from 'react';
import { Text, StyleSheet, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type AppTextVariant = 'title' | 'subtitle' | 'body' | 'caption';

export type AppTextProps = TextProps & {
  variant?: AppTextVariant;
};

export function AppText({ style, variant = 'body', ...rest }: AppTextProps) {
  const color = useThemeColor({}, 'text');

  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        { color },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: undefined,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
