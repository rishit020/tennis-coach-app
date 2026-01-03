/**
 * TennisCoachApp Color Palette
 * Tennis-themed colors for consistent UI design
 * Design tokens for standardized color usage
 */

export const colors = {
  primary: {
    green: '#1d6b36',      // Standardized primary green
    dark: '#1B5E3A',       // Darker green for accents
  },
  accent: {
    yellow: '#FFD60A',      // Tennis ball yellow
    orange: '#FF8C00',      // Warm accent
  },
  neutral: {
    white: '#FFFFFF',       // Standardized background white
    background: '#F5F6FA',  // Light neutral off-white background
    gray: {
      100: '#F5F5F5',
      300: '#D1D5DB', 
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      900: '#111827',
    },
    // Design token aliases
    darkText: '#111318',    // Standardized dark text color
    mutedGray: '#6B6F76',   // Standardized muted gray
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
