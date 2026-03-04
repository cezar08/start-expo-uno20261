import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { TopBar } from '@/components/organisms/TopBar';
import { ThemedView } from '@/components/themed-view';

export default function AgendaScreen() {
  return (
    <ThemedView style={styles.container}>
      <TopBar onNotificationsPress={() => {}} />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <AppText variant="subtitle">Agenda</AppText>
          <AppText variant="body" style={styles.paragraph}>
            Aqui você pode ver seus compromissos e eventos. (Tela de exemplo para a aula.)
          </AppText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  paragraph: {
    marginTop: 8,
    opacity: 0.9,
  },
});
