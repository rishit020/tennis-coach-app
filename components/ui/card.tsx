import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  style, 
  padding = 'md',
  shadow = 'sm' 
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    styles[`shadow${shadow.charAt(0).toUpperCase() + shadow.slice(1)}`],
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.neutral.white,
    borderRadius: layout.borderRadius.card,
  },
  paddingSm: {
    padding: layout.spacing.md,
  },
  paddingMd: {
    padding: layout.spacing.lg,
  },
  paddingLg: {
    padding: layout.spacing.xl,
  },
  shadowSm: {
    ...layout.shadows.sm,
  },
  shadowMd: {
    ...layout.shadows.md,
  },
  shadowLg: {
    ...layout.shadows.lg,
  },
});
