import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

export type AddTaskFormProps = {
  onSubmit: (title: string) => Promise<boolean>;
};

export function AddTaskForm({ onSubmit }: AddTaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) return;
    const wasAdded = await onSubmit(title);
    if (wasAdded) {
      setTitle('');
    }
  };

  return (
    <View style={styles.container}>
      <Input
        value={title}
        onChangeText={setTitle}
        placeholder="Nova tarefa..."
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        autoCapitalize="sentences"
        style={styles.input}
      />
      <Button
        title="Adicionar"
        onPress={handleSubmit}
        disabled={!title.trim()}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  input: {
    width: '100%',
  },
  button: {
    alignSelf: 'stretch',
    minHeight: 48,
  },
});
