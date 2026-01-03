import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import React, { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  required = false,
  multiline = false,
  numberOfLines = 1,
  style,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    styles.input,
    multiline && styles.multiline,
    isFocused && styles.focused,
    error && styles.error,
    style,
  ];

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        ref={ref}
        style={inputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor={colors.neutral.gray[600]} // Darker placeholder for better readability on transparent background
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: layout.spacing.md,
  },
  label: {
    fontSize: typography.fontSize.xs, // 12px
    fontWeight: typography.fontWeight.semibold, // Semi-bold
    color: colors.neutral.gray[900], // High contrast
    marginBottom: layout.spacing.xs + 2, // 6-8px spacing above inputs
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5, // Generous letter-spacing
  },
  required: {
    color: colors.semantic.error,
    fontSize: typography.fontSize.xs, // Smaller asterisk
    opacity: 0.8, // Slightly tinted but not overly strong
  },
  input: {
    height: layout.inputHeight.md,
    borderWidth: 1.5, // Slightly thicker for better visibility
    borderColor: 'rgba(255, 255, 255, 0.55)', // More visible border while maintaining glass aesthetic
    borderRadius: 12, // 12px border radius
    paddingHorizontal: 16, // 16px left/right
    paddingVertical: 12, // 12px top/bottom
    fontSize: 16, // 16px to prevent zooming on mobile
    color: colors.neutral.gray[900],
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // More shaded for better contrast
    fontFamily: typography.fontFamily.regular,
  },
  multiline: {
    height: 'auto',
    minHeight: 150, // 150-180px height for textarea
    maxHeight: 180,
    textAlignVertical: 'top',
    paddingTop: 12, // 12px top
    paddingBottom: 12, // 12px bottom
    paddingHorizontal: 16, // 16px left/right
  },
  focused: {
    borderColor: colors.primary.green,
    borderWidth: 1.5, // Consistent with default border width
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // More opaque on focus for better visibility
    // Focus ring effect with green at 0.3 opacity
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  error: {
    borderColor: colors.semantic.error,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.semantic.error,
    marginTop: layout.spacing.xs,
  },
});
