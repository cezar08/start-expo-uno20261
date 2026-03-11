import React from 'react';
import { View, StyleSheet } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { AddTaskForm } from '@/components/molecules/AddTaskForm';
import { TaskList } from '@/components/organisms/TaskList';
import { TopBar } from '@/components/organisms/TopBar';
import { TasksProvider, useTasks } from '@/contexts/TasksContext';
import { ThemedView } from '@/components/themed-view';

function HomeScreenContent() {
  const { tasks, addTask, toggleTask, deleteTask, isLoading } = useTasks();

  return (
    <ThemedView style={styles.container}>
      <TopBar onNotificationsPress={() => {}} />
      <View style={styles.content}>
        <View style={styles.section}>
          <AppText variant="subtitle">Tarefas</AppText>
          <AddTaskForm onSubmit={addTask} />
        </View>
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          isLoading={isLoading}
        />
      </View>
    </ThemedView>
  );
}

export default function HomeScreen() {
  return (
    <TasksProvider>
      <HomeScreenContent />
    </TasksProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 16,
    gap: 12,
  },
});
