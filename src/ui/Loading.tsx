import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors, typography, spacing } from '@constants/theme';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ message, fullScreen = false }) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary.main} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  message: {
    ...typography.body1,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});

