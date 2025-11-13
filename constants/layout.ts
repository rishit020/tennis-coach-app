/**
 * TennisCoachApp Layout Constants
 * Spacing, sizing, and layout values for consistent design
 */

export const layout = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    xxl: 80, // Extended spacing scale
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
    card: 14,  // Consistent card border radius (12-16px)
    button: 12, // Button border radius
    // Design token aliases
    small: 8,   // Standardized small radius
    medium: 16, // Standardized medium radius
    pill: 999,  // Standardized pill radius
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    // Design token aliases
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    hover: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6,
    },
  },
  screenPadding: {
    horizontal: 16,
    vertical: 20,
  },
  buttonHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },
  inputHeight: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 48,
  },
} as const;

export type SpacingKey = keyof typeof layout.spacing;
export type BorderRadiusKey = keyof typeof layout.borderRadius;
export type ShadowKey = keyof typeof layout.shadows;
