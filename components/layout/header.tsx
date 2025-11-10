import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export function Header({ title, subtitle, showBackButton = false, onBackPress }: HeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showBackButton && (
          <View style={styles.backButton}>
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={colors.neutral.gray[700]} 
            />
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.neutral.white,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.lg,
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray[200],
  },
  backButton: {
    marginRight: layout.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[500],
    marginTop: layout.spacing.xs,
  },
});
