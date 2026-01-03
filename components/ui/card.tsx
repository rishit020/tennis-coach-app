import { layout } from '@/constants/layout';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg' | null;
  shadow?: 'sm' | 'md' | 'lg' | null;
  glassmorphic?: boolean;
}

export function Card({ 
  children, 
  style, 
  padding = 'md',
  shadow = 'sm',
  glassmorphic = true
}: CardProps) {
  const cardStyle = [
    styles.base,
    padding ? styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`] : null,
    shadow ? styles[`shadow${shadow.charAt(0).toUpperCase() + shadow.slice(1)}`] : null,
    style,
  ].filter(Boolean);

  if (glassmorphic) {
    return (
      <View style={[cardStyle, styles.glassContainer]}>
        {Platform.OS === 'web' ? (
          <View style={[StyleSheet.absoluteFill, styles.webBlurContainer]}>
            <LinearGradient
              colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ) : (
          <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill}>
            <LinearGradient
              colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </BlurView>
        )}
        <View style={styles.glassContent}>{children}</View>
      </View>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: layout.borderRadius.card,
    overflow: 'hidden',
  },
  glassContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  webBlurContainer: Platform.select({
    web: {
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    } as any,
    default: {},
  }),
  glassContent: {
    position: 'relative',
    zIndex: 1,
  },
  paddingSm: {
    padding: layout.spacing.md,
  },
  paddingMd: {
    padding: 20, // 20px - consistent card padding (20-24px range)
  },
  paddingLg: {
    padding: layout.spacing.xl,
  },
  shadowSm: {
    ...layout.shadows.sm,
  },
  shadowMd: {
    ...layout.shadows.md,
  },
  shadowLg: {
    ...layout.shadows.lg,
  },
});
