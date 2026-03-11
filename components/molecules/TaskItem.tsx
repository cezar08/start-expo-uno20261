import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { AppText } from '@/components/atoms/AppText';
import { Checkbox } from '@/components/atoms/Checkbox';
import { useThemeColor } from '@/hooks/use-theme-color';

import type { Task } from '@/types/task';

export type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const iconColor = useThemeColor({}, 'icon');

  return (
    <View style={styles.container}>
      <Checkbox checked={task.completed} onToggle={onToggle} />
      <AppText
        variant="body"
        style={[styles.title, task.completed && styles.titleCompleted]}
        numberOfLines={2}
      >
        {task.title}
      </AppText>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} hitSlop={12}>
        <MaterialIcons name="delete-outline" size={22} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  title: {
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteBtn: {
    padding: 4,
  },
});
