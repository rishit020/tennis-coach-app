/**
 * TennisCoachApp Typography System
 * Consistent font sizing and styling across the app
 * Modern typography scale with Inter-like system fonts
 */

import { Platform } from 'react-native';

export const typography = {
  fontFamily: {
    // Inter-like system font stack for modern, clean typography
    // Uses platform defaults: SF Pro on iOS, Roboto on Android (both Inter-like geometric sans-serif)
    // On web, uses Inter if available, falls back to system fonts
    regular: Platform.select({
      ios: undefined, // Uses SF Pro (system default on iOS)
      android: undefined, // Uses Roboto (system default on Android)
      web: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      default: undefined,
    }),
    medium: Platform.select({
      ios: undefined,
      android: undefined,
      web: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      default: undefined,
    }),
    bold: Platform.select({
      ios: undefined,
      android: undefined,
      web: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      default: undefined,
    }),
  },
  fontSize: {
    // Typography scale: H1, H2, body, small
    xs: 12,
    small: 14,    // Small text
    body: 16,     // Body text
    lg: 18,
    xl: 20,
    h2: 22,       // H2 heading
    '2xl': 24,
    h1: 32,       // H1 heading
    '3xl': 30,
    '4xl': 36,
    // Legacy aliases for backward compatibility
    sm: 14,
    base: 16,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    // Typography-specific line heights
    heading: 1.3,  // Tighter for headings
    body: 1.5,     // Standard for body text
  },
  fontWeight: {
    normal: '400' as const,    // Body text
    medium: '500' as const,
    semibold: '600' as const,  // Emphasis
    bold: '700' as const,      // Headings
  }
} as const;

export type FontSizeKey = keyof typeof typography.fontSize;
export type FontWeightKey = keyof typeof typography.fontWeight;
export type LineHeightKey = keyof typeof typography.lineHeight;
