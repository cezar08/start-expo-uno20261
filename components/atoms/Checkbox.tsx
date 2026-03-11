import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useThemeColor } from '@/hooks/use-theme-color';

export type CheckboxProps = {
  checked: boolean;
  onToggle: () => void;
};

export function Checkbox({ checked, onToggle }: CheckboxProps) {
  const tint = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <TouchableOpacity onPress={onToggle} style={styles.touch} activeOpacity={0.7}>
      <View
        style={[
          styles.box,
          { borderColor: checked ? tint : iconColor },
          checked && { backgroundColor: tint },
        ]}
      >
        {checked && <MaterialIcons name="check" size={18} color="#fff" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touch: {
    padding: 4,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
