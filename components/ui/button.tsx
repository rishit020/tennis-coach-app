import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: any;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.primary.green : colors.neutral.white} 
          size="small" 
        />
      ) : (
        <>
          {icon && <View style={{ marginRight: layout.spacing.sm }}>{icon}</View>}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.borderRadius.full,
    ...layout.shadows.sm,
  },
  primary: {
    backgroundColor: colors.primary.green,
  },
  secondary: {
    backgroundColor: colors.accent.yellow,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary.green,
  },
  sm: {
    height: layout.buttonHeight.sm,
    paddingHorizontal: layout.spacing.md,
  },
  md: {
    height: layout.buttonHeight.md,
    paddingHorizontal: layout.spacing.lg,
  },
  lg: {
    height: layout.buttonHeight.lg,
    paddingHorizontal: layout.spacing.xl,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.neutral.white,
  },
  secondaryText: {
    color: colors.neutral.gray[900],
  },
  outlineText: {
    color: colors.primary.green,
  },
  smText: {
    fontSize: typography.fontSize.sm,
  },
  mdText: {
    fontSize: typography.fontSize.base,
  },
  lgText: {
    fontSize: typography.fontSize.lg,
  },
  disabledText: {
    opacity: 0.7,
  },
});
