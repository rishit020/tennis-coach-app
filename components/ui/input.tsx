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
        placeholderTextColor={colors.neutral.gray[500]} // Darker placeholder for better readability
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
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium, // Medium weight
    color: '#374151', // Slightly darker (#374151)
    marginBottom: layout.spacing.xs + 2, // 6-8px spacing above inputs
  },
  required: {
    color: colors.semantic.error,
    fontSize: typography.fontSize.xs, // Smaller asterisk
    opacity: 0.8, // Slightly tinted but not overly strong
  },
  input: {
    height: layout.inputHeight.md,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Slightly darker border for better definition
    borderRadius: layout.borderRadius.lg, // Rounded-lg for premium feel
    paddingHorizontal: layout.spacing.md, // py-3 px-4 equivalent
    paddingVertical: layout.spacing.sm + 2, // ~12px vertical padding
    fontSize: typography.fontSize.body, // 16px
    color: colors.neutral.gray[900],
    backgroundColor: colors.neutral.white,
  },
  multiline: {
    height: 'auto',
    minHeight: 150, // 150-180px height for textarea
    maxHeight: 180,
    textAlignVertical: 'top',
    paddingTop: layout.spacing.md,
    paddingBottom: layout.spacing.md,
  },
  focused: {
    borderColor: colors.primary.green,
    borderWidth: 2,
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
