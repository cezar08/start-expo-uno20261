import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { TaskItem } from '@/components/molecules/TaskItem';

import type { Task } from '@/types/task';

export type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
};

export function TaskList({ tasks, onToggle, onDelete, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <View style={styles.placeholder}>
        <AppText variant="body">Carregando tarefas...</AppText>
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.placeholder}>
        <AppText variant="body" style={styles.placeholderText}>
          Nenhuma tarefa. Adicione uma acima.
        </AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onToggle={() => onToggle(item.id)}
          onDelete={() => onDelete(item.id)}
        />
      )}
      style={styles.list}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  placeholderText: {
    opacity: 0.7,
  },
});
