/**
 * TennisCoachApp Color Palette
 * Tennis-themed colors for consistent UI design
 */

export const colors = {
  primary: {
    green: '#1E7B34',      // Rich tennis green (matches reference designs)
    dark: '#1B5E3A',       // Darker green for accents
  },
  accent: {
    yellow: '#FFD60A',      // Tennis ball yellow
    orange: '#FF8C00',      // Warm accent
  },
  neutral: {
    white: '#FFFFFF',
    background: '#F5F6FA',  // Light neutral off-white background
    gray: {
      100: '#F5F5F5',
      300: '#D1D5DB', 
      500: '#6B7280',
      700: '#374151',
      900: '#111827',
    },
  },
  semantic: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  }
} as const;

export type ColorKey = keyof typeof colors;
export type PrimaryColorKey = keyof typeof colors.primary;
export type AccentColorKey = keyof typeof colors.accent;
export type NeutralColorKey = keyof typeof colors.neutral;
export type SemanticColorKey = keyof typeof colors.semantic;
