import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/atoms/AppText';
import { TopBar } from '@/components/organisms/TopBar';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';

export default function MenuScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      <TopBar onNotificationsPress={() => {}} />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <AppText variant="subtitle">Menu</AppText>
          <AppText variant="body" style={styles.paragraph}>
            Opções e configurações do aplicativo.
          </AppText>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <AppText variant="body" style={styles.logoutText}>
              Sair
            </AppText>
          </TouchableOpacity>
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
    marginBottom: 24,
    opacity: 0.9,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 8,
  },
  logoutText: {
    fontWeight: '600',
  },
});
