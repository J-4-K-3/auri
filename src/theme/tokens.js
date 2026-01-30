/**
 * Auri Landing Page - Theme Tokens
 * This file documents the design system used throughout the landing page
 */

export const colors = {
  slate900: '#0F1220',
  slate800: '#161A2A',
  slate700: '#1E2336',
  slate100: '#E9ECF4',
  slate050: '#F5F7FB',
  white: '#FFFFFF',
  gold: '#FFC14D',
  peach: '#FF8A65',
  blush: '#F76E8E',
  teal: '#39B6B3',
  success: '#2ECC71',
  warn: '#F5A623',
  error: '#FF5A5F',
  link: '#4D9CFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  card: 24,
  input: 16,
  chip: 12,
  button: 12,
  avatar: 40,
  pill: 48,
};

export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '600' },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '500' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
};

export const shadows = {
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  android: {
    elevation: 8,
  },
};

export const zIndices = {
  header: 10,
  modal: 20,
  toast: 30,
};

export const gradients = {
  warm: ['#FFC14D', '#FF8A65', '#F76E8E'],
  subtle: [
    'rgba(255, 138, 101, 0.4)',
    'rgba(247, 110, 142, 0.6)',
    'rgba(15, 18, 32, 0.9)',
  ],
  headerFade: ['rgba(22, 26, 42, 0)', '#1E2336'],
};

export const lightTheme = {
  background: colors.slate050,
  card: colors.white,
  text: colors.slate900,
  subText: 'rgba(15, 18, 32, 0.64)',
  border: 'rgba(15, 18, 32, 0.08)',
  statusBar: 'dark',
  navBar: colors.slate050,
  previewColor: colors.slate050,
};

export const darkTheme = {
  background: colors.slate800,
  card: colors.slate700,
  text: colors.white,
  subText: 'rgba(233, 236, 244, 0.72)',
  border: 'rgba(233, 236, 244, 0.08)',
  statusBar: 'light',
  navBar: colors.slate700,
  previewColor: colors.slate800,
};

export const amoledTheme = {
  background: colors.slate900,
  card: colors.slate800,
  text: colors.white,
  subText: 'rgba(233, 236, 244, 0.72)',
  border: 'rgba(233, 236, 244, 0.12)',
  statusBar: 'light',
  navBar: colors.slate900,
  previewColor: colors.slate900,
};

export const blushTheme = {
  background: '#f9e3ecff',
  card: '#FFFFFF',
  text: '#4A4A4A',
  subText: 'rgba(74, 74, 74, 0.64)',
  border: 'rgba(247, 110, 142, 0.2)',
  statusBar: 'dark',
  navBar: '#f9e3ecff',
  previewColor: '#f9e3ecff',
};

export const purpleTheme = {
  background: '#2A1F3D',
  card: '#3A2E52',
  text: '#E8D5F2',
  subText: 'rgba(232, 213, 242, 0.72)',
  border: 'rgba(232, 213, 242, 0.15)',
  statusBar: 'light',
  navBar: '#2A1F3D',
  previewColor: '#2A1F3D',
};

export const themeModeMap = {
  light: lightTheme,
  dark: darkTheme,
  amoled: amoledTheme,
  blush: blushTheme,
  purple: purpleTheme,
};

export const transitions = {
  fast: '0.2s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
};

