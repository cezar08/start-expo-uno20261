import React from 'react';
import { View, StyleSheet } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { Button } from '@/components/atoms/Button';
import { AddTaskForm } from '@/components/molecules/AddTaskForm';
import { TaskList } from '@/components/organisms/TaskList';
import { TopBar } from '@/components/organisms/TopBar';
import { TasksProvider, useTasks } from '@/contexts/TasksContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { ThemedView } from '@/components/themed-view';

function HomeScreenContent() {
  const { tasks, addTask, toggleTask, deleteTask, isLoading, errorMessage, refreshTasks } = useTasks();
  const { isConnected } = useNetworkStatus();

  return (
    <ThemedView style={styles.container}>
      <TopBar onNotificationsPress={() => {}} />
      <View style={styles.content}>
        {isConnected === false ? (
          <View style={styles.offlineBanner}>
            <AppText variant="caption" style={styles.offlineText}>
              Dispositivo offline: sincronizacao com API indisponivel.
            </AppText>
          </View>
        ) : null}
        <View style={styles.section}>
          <AppText variant="subtitle">Tarefas</AppText>
          <AddTaskForm onSubmit={addTask} />
          {errorMessage ? (
            <View style={styles.errorBox}>
              <AppText variant="caption" style={styles.errorText}>
                {errorMessage}
              </AppText>
              <Button title="Tentar novamente" variant="outline" onPress={refreshTasks} />
            </View>
          ) : null}
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
  offlineBanner: {
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: '#fee08a',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  offlineText: {
    color: '#402a0f',
  },
  errorBox: {
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(214, 64, 69, 0.1)',
  },
  errorText: {
    color: '#d64045',
  },
});
