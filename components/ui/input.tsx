import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export function Input({
  label,
  error,
  required = false,
  multiline = false,
  numberOfLines = 1,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    styles.input,
    multiline && styles.multiline,
    isFocused && styles.focused,
    error && styles.error,
    style,
  ];

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={inputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor={colors.neutral.gray[500]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: layout.spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral.gray[700],
    marginBottom: layout.spacing.xs,
  },
  required: {
    color: colors.semantic.error,
  },
  input: {
    height: layout.inputHeight.md,
    borderWidth: 1,
    borderColor: colors.neutral.gray[300],
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: layout.spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[900],
    backgroundColor: colors.neutral.white,
  },
  multiline: {
    height: 'auto',
    minHeight: layout.inputHeight.lg,
    textAlignVertical: 'top',
    paddingTop: layout.spacing.md,
  },
  focused: {
    borderColor: colors.primary.green,
    borderWidth: 2,
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
