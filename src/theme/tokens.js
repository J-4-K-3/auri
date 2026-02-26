/**
 * Auri Landing Page - Theme Tokens
 * This file documents the design system used throughout the landing page
 */

export const colors = {
  // Primary Palette (Aurora)
  auroraTeal: '#00F5D4',
  auroraPurple: '#9B5DE5',
  auroraPink: '#F15BB5',
  auroraBlue: '#00BBF9',
  auroraYellow: '#FEE440',

  // Neutrals (Midnight)
  midnight950: '#05070A',
  midnight900: '#0A0E14',
  midnight800: '#141B26',
  midnight700: '#1E293B',
  midnight600: '#334155',
  
  // Surfaces
  slate100: '#F1F5F9',
  white: '#FFFFFF',
  
  // Semantic
  success: '#10B981',
  warn: '#F59E0B',
  error: '#EF4444',
  link: '#3B82F6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const typography = {
  display: { fontSize: 48, lineHeight: 1.1, fontWeight: '800', letterSpacing: '-0.02em' },
  h1: { fontSize: 36, lineHeight: 1.2, fontWeight: '700', letterSpacing: '-0.01em' },
  h2: { fontSize: 30, lineHeight: 1.3, fontWeight: '700' },
  h3: { fontSize: 24, lineHeight: 1.4, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 1.6, fontWeight: '400' },
  bodyLarge: { fontSize: 18, lineHeight: 1.6, fontWeight: '400' },
  caption: { fontSize: 14, lineHeight: 1.5, fontWeight: '500' },
};

export const shadows = {
  soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  medium: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  large: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: (color) => `0 0 20px ${color}40`,
};

export const gradients = {
  aurora: 'linear-gradient(135deg, #00F5D4 0%, #00BBF9 100%)',
  sunset: 'linear-gradient(135deg, #F15BB5 0%, #9B5DE5 100%)',
  cosmic: 'linear-gradient(135deg, #9B5DE5 0%, #3B82F6 100%)',
  midnight: 'linear-gradient(180deg, #0A0E14 0%, #05070A 100%)',
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
};

export const lightTheme = {
  background: colors.slate100,
  surface: colors.white,
  surfaceElevated: colors.white,
  textPrimary: colors.midnight950,
  textSecondary: colors.midnight600,
  border: 'rgba(0, 0, 0, 0.08)',
  accent: colors.auroraBlue,
  glass: 'rgba(255, 255, 255, 0.7)',
};

export const darkTheme = {
  background: colors.midnight950,
  surface: colors.midnight900,
  surfaceElevated: colors.midnight800,
  textPrimary: colors.white,
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  border: 'rgba(255, 255, 255, 0.08)',
  accent: colors.auroraTeal,
  glass: 'rgba(20, 27, 38, 0.7)',
};

export const amoledTheme = {
  background: '#000000',
  surface: '#0A0A0A',
  surfaceElevated: '#121212',
  textPrimary: colors.white,
  textSecondary: 'rgba(255, 255, 255, 0.5)',
  border: 'rgba(255, 255, 255, 0.12)',
  accent: colors.auroraPurple,
  glass: 'rgba(0, 0, 0, 0.8)',
};

export const blushTheme = {
  background: '#FFF5F7',
  surface: colors.white,
  surfaceElevated: '#FFE4E8',
  textPrimary: '#4D001F',
  textSecondary: 'rgba(77, 0, 31, 0.6)',
  border: 'rgba(241, 91, 181, 0.15)',
  accent: colors.auroraPink,
  glass: 'rgba(255, 255, 255, 0.8)',
};

export const purpleTheme = {
  background: '#0F071A',
  surface: '#1A0B2E',
  surfaceElevated: '#2D144D',
  textPrimary: '#E9D5FF',
  textSecondary: 'rgba(233, 213, 255, 0.6)',
  border: 'rgba(155, 93, 229, 0.2)',
  accent: colors.auroraPurple,
  glass: 'rgba(26, 11, 46, 0.8)',
};

export const themeModeMap = {
  light: lightTheme,
  dark: darkTheme,
  amoled: amoledTheme,
  blush: blushTheme,
  purple: purpleTheme,
};


