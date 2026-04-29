import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function StyleLabScreen() {
  const [input, setInput] = useState('');
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const iconMuted = useThemeColor({}, 'icon');

  const platformLabel = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : Platform.OS;
  const touchGuideline =
    Platform.OS === 'ios'
      ? 'HIG: alvo mínimo recomendado ~44×44 pt'
      : Platform.OS === 'android'
        ? 'Material: alvo mínimo típico 48×48 dp'
        : 'Web / outro';

  return (
    <ThemedView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <AppText variant="title">Laboratório de estilo</AppText>
        <AppText variant="caption" style={{ color: iconMuted, marginTop: 4 }}>
          Comparar o mesmo código em simulador iOS e emulador Android.
        </AppText>

        <View style={[styles.card, { borderColor: iconMuted }]}>
          <AppText variant="subtitle">Plataforma em tempo de execução</AppText>
          <Text style={[styles.mono, { color: textColor }]}>{platformLabel}</Text>
          <Text style={[styles.caption, { color: iconMuted }]}>{touchGuideline}</Text>
        </View>

        <View style={[styles.card, { borderColor: iconMuted }]}>
          <AppText variant="subtitle">Ícone nativo (mesmo componente)</AppText>
          <Text style={[styles.caption, { color: iconMuted, marginBottom: 8 }]}>
            iOS: SF Symbols via Expo. Android: mapeamento para Material Icons.
          </Text>
          <View style={styles.row}>
            <IconSymbol name="house.fill" size={40} color={tint} />
            <Text style={[styles.body, { color: textColor, flex: 1, marginLeft: 12 }]}>
              &lt;IconSymbol name=&quot;house.fill&quot; /&gt;
            </Text>
          </View>
        </View>

        <View style={[styles.card, { borderColor: iconMuted }]}>
          <AppText variant="subtitle">Feedback ao toque</AppText>
          <Text style={[styles.caption, { color: iconMuted, marginBottom: 12 }]}>
            TouchableOpacity reduz opacidade em ambas as plataformas. No Android, Pressable pode usar
            ripple (ondulação Material).
          </Text>
          <TouchableOpacity
            style={[styles.touchableDemo, { backgroundColor: tint }]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Demonstração TouchableOpacity">
            <Text style={styles.touchableLabel}>TouchableOpacity (opacidade)</Text>
          </TouchableOpacity>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Demonstração Pressable com ripple no Android"
            android_ripple={{ color: 'rgba(255,255,255,0.35)', foreground: true }}
            style={({ pressed }) => [
              styles.pressableDemo,
              { backgroundColor: '#5c6bc0' },
              Platform.OS === 'ios' && pressed && { opacity: 0.88 },
            ]}>
            <Text style={styles.touchableLabel}>Pressable + android_ripple</Text>
          </Pressable>
        </View>

        <View style={[styles.card, { borderColor: iconMuted }]}>
          <AppText variant="subtitle">Elevação / sombra (mesmo retângulo)</AppText>
          <Text style={[styles.caption, { color: iconMuted, marginBottom: 12 }]}>
            Android usa elevation; iOS costuma usar shadow* no estilo. O resultado visual difere.
          </Text>
          <View
            style={[
              styles.elevatedBox,
              Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                },
                android: { elevation: 8 },
                default: { elevation: 4 },
              }),
              { backgroundColor: backgroundColor },
            ]}>
            <Text style={{ color: textColor }}>Caixa com sombra (iOS) ou elevação (Android)</Text>
          </View>
        </View>

        <View style={[styles.card, { borderColor: iconMuted }]}>
          <AppText variant="subtitle">ActivityIndicator</AppText>
          <Text style={[styles.caption, { color: iconMuted, marginBottom: 8 }]}>
            O spinner é renderizado com o componente nativo de cada sistema.
          </Text>
          <ActivityIndicator size="large" color={tint} />
        </View>

        <View style={[styles.card, { borderColor: iconMuted }]}>
          <AppText variant="subtitle">TextInput (teclado e aparência)</AppText>
          <Text style={[styles.caption, { color: iconMuted, marginBottom: 8 }]}>
            Placeholder, retorno e estilo padrão seguem convenções do SO.
          </Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Digite para comparar teclados…"
            placeholderTextColor={iconMuted}
            style={[
              styles.textInput,
              { color: textColor, borderColor: iconMuted, backgroundColor },
            ]}
            returnKeyType="done"
          />
        </View>

        <View style={[styles.card, { borderColor: iconMuted }]}>
          <AppText variant="subtitle">Alvos de toque (referência visual)</AppText>
          <View style={styles.targetsRow}>
            <View style={[styles.targetIos, { borderColor: tint }]}>
              <Text style={[styles.targetLabel, { color: textColor }]}>44×44</Text>
              <Text style={[styles.caption, { color: iconMuted }]}>referência HIG (pt)</Text>
            </View>
            <View style={[styles.targetAndroid, { borderColor: tint }]}>
              <Text style={[styles.targetLabel, { color: textColor }]}>48×48</Text>
              <Text style={[styles.caption, { color: iconMuted }]}>referência Material (dp)</Text>
            </View>
          </View>
          <View style={styles.materialRow}>
            <MaterialIcons name="android" size={28} color={iconMuted} />
            <MaterialIcons name="phone-iphone" size={28} color={iconMuted} />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  mono: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 16,
    marginTop: 8,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchableDemo: {
    minHeight: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  pressableDemo: {
    minHeight: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  touchableLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  elevatedBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  targetsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  targetIos: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetAndroid: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  materialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 12,
  },
});
