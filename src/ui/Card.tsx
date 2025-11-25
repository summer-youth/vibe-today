import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '@constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, elevated = true }) => {
  return (
    <View style={[styles.card, elevated && shadows.md, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
});

