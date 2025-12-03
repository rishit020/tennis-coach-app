import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedCard } from '@/components/animated-card';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

// Design token constants for circular elements
const HEADER_ICON_SIZE = layout.spacing['2xl'] + layout.spacing.xs; // 48
const FEATURE_ICON_SIZE = layout.spacing['2xl'] + layout.spacing.md; // 56
const FEATURE_ICON_SIZE_INNER = layout.iconSize.md; // 24
const BUTTON_ICON_SIZE = layout.iconSize.sm + 2; // 22

export default function HomeScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowOpacity = useRef(new Animated.Value(0.3)).current;
  const insets = useSafeAreaInsets();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check for reduce motion preference
    if (Platform.OS !== 'web') {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    }
  }, []);

  const handleBookLesson = () => {
    router.push('/(tabs)/coaching');
  };

  const handlePressIn = () => {
    if (reduceMotion) return;
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(shadowOpacity, {
          toValue: 0.5,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(shadowOpacity, {
          toValue: 0.3,
          duration: 100,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  };

  const handlePressOut = () => {
    if (reduceMotion) return;
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Calculate bottom padding: nav bar height (70) + spacing (24) + safe area bottom
  const bottomPadding = 70 + layout.spacing.lg + Math.max(insets.bottom, 12);

  return (
    <View style={styles.wrapper}>
      {/* ============================================================
          PREMIUM TENNIS COURT IMAGE BACKGROUND
          ============================================================
          
          Design Philosophy:
          - High-quality tennis court illustration as background
          - Subtle blur effect for premium, clean aesthetic
          - Light overlay gradient ensures text readability
          - Maintains professional appearance while adding visual interest
          
          Layer Structure (bottom to top):
          1. Tennis court background image (cover, centered)
          2. BlurView overlay (subtle blur for depth)
          3. Light gradient overlay (ensures text readability)
          4. Content layer (cards with glass-like effect)
      */}
      
      <ImageBackground
        source={require('@/assets/images/tennis-background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={styles.backgroundImageStyle}
      >
        {/* Blur Effect - Subtle blur for premium aesthetic
            Intensity: 25 - provides soft focus without losing image detail
            Tint: light - maintains brightness of the tennis court image */}
        <BlurView 
          intensity={25} 
          tint="light" 
          style={StyleSheet.absoluteFill}
        >
          {/* Light Gradient Overlay - Ensures text readability
              White gradient overlay (40-60% opacity) creates clean backdrop
              for text while preserving the tennis court aesthetic */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.5)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </BlurView>

        <Animated.ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
      <View style={[styles.content, { paddingBottom: bottomPadding }]}>
        {/* App Header */}
        <View style={styles.header}>
          <BlurView intensity={20} tint="light" style={styles.headerBanner}>
            <View style={styles.headerIconContainer}>
              <View style={styles.headerIcon}>
                <Ionicons name="tennisball-outline" size={layout.iconSize.md} color={colors.neutral.white} />
              </View>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.appName}>TennisPro Coaching</Text>
              <Text style={styles.appTagline}>Elite Tennis Coaching</Text>
            </View>
          </BlurView>
        </View>

        {/* Main Heading */}
        <View style={styles.headingContainer}>
          <BlurView intensity={20} tint="light" style={styles.headingBanner}>
            <Text style={styles.mainHeading}>
              Elevate Your <Text style={styles.highlightedText}>Tennis</Text> Game
            </Text>
            <Text style={styles.description}>
              Get personalized feedback from nationally ranked USTA players. Upload your videos and receive expert analysis.
            </Text>
          </BlurView>
        </View>

        {/* Feature Cards */}
        <AnimatedCard style={styles.featureCard} padding="md" shadow="sm">
          <View style={styles.featureContent}>
            <View style={styles.featureIcon}>
              <Ionicons name="videocam-outline" size={FEATURE_ICON_SIZE_INNER} color={colors.neutral.white} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Video Analysis</Text>
              <Text style={styles.featureDescription}>
                Upload your tennis videos and receive detailed feedback within 24 hours.
              </Text>
            </View>
          </View>
        </AnimatedCard>

        <AnimatedCard onPress={handleBookLesson} style={styles.featureCard} padding="md" shadow="sm">
          <View style={styles.featureContent}>
            <View style={styles.featureIcon}>
              <Ionicons name="person-outline" size={FEATURE_ICON_SIZE_INNER} color={colors.neutral.white} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>1-on-1 Coaching</Text>
              <Text style={styles.featureDescription}>
                Book private lessons with USTA certified coaches for personalized training.
              </Text>
            </View>
          </View>
        </AnimatedCard>

        <AnimatedCard onPress={handleBookLesson} style={styles.featureCard} padding="md" shadow="sm">
          <View style={styles.featureContent}>
            <View style={styles.featureIcon}>
              <Ionicons name="trophy-outline" size={FEATURE_ICON_SIZE_INNER} color={colors.neutral.white} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Expert Coaches</Text>
              <Text style={styles.featureDescription}>
                Learn from nationally ranked players with 9+ years of experience.
              </Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Statistics Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100+</Text>
            <Text style={styles.statLabel}>Tournament Wins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>9+</Text>
            <Text style={styles.statLabel}>Years Experience</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Satisfaction Rate</Text>
          </View>
        </View>

        {/* Book a Lesson Button */}
        <View style={styles.bookButtonContainer}>
          <Animated.View
            style={[
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}>
            <Animated.View
              style={[
                {
                  // Shadow properties must be on the animated view
                  shadowColor: colors.primary.green,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: reduceMotion ? 0.3 : shadowOpacity,
                  shadowRadius: 12,
                  elevation: 6,
                },
              ]}>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={handleBookLesson}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}>
                <Ionicons name="calendar-outline" size={BUTTON_ICON_SIZE} color={colors.neutral.white} style={styles.bookButtonIcon} />
                <Text style={styles.bookButtonText}>Book a Lesson</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </View>
        </Animated.ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F0F7F4', // Fallback color if image fails to load
  },
  // Tennis Court Background Image
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    // Image-specific styling
    opacity: 1, // Full opacity - blur and overlay handle the softening
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Transparent to show background image
  },
  content: {
    paddingTop: layout.spacing['3xl'], // 64px - multiple of 16px for consistent rhythm
    paddingHorizontal: layout.spacing.lg + layout.spacing.xs, // 24px - premium horizontal margin using tokens
    backgroundColor: 'transparent', // Transparent to show premium background
    // paddingBottom is calculated dynamically based on nav bar height and safe area
  },
  header: {
    marginBottom: layout.spacing['2xl'], // 48px - consistent major section spacing
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.lg,
    borderRadius: layout.borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Glass morphism background
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerIconContainer: {
    marginRight: layout.spacing.md,
  },
  headerIcon: {
    width: HEADER_ICON_SIZE,
    height: HEADER_ICON_SIZE,
    borderRadius: HEADER_ICON_SIZE / 2, // Perfect circle: half of width/height
    backgroundColor: colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  appName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h2, // H2: 22
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.primary.green,
    lineHeight: typography.fontSize.h2 * typography.lineHeight.heading, // 22 * 1.3 = 28.6
    marginBottom: layout.spacing.xs, // 4px - tight spacing between name and tagline
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  appTagline: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.small, // Small: 14
    fontWeight: typography.fontWeight.semibold, // 600 - bolder for readability
    color: colors.neutral.darkText, // Darker for better contrast
    lineHeight: typography.fontSize.small * typography.lineHeight.body, // 14 * 1.5 = 21
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headingContainer: {
    marginBottom: layout.spacing['2xl'], // 48px - consistent major section spacing
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headingBanner: {
    paddingVertical: layout.spacing.xl,
    paddingHorizontal: layout.spacing.lg,
    borderRadius: layout.borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Glass morphism background
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    maxWidth: '90%',
  },
  mainHeading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h1, // H1: 32 (using standard scale, keeping premium look)
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.h1 * typography.lineHeight.heading, // 32 * 1.3 = 41.6
    marginBottom: layout.spacing.md, // 16px - multiple of 16px
    textAlign: 'center',
    letterSpacing: -0.5, // Design-specific value for premium look
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  highlightedText: {
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.green,
    letterSpacing: -0.5, // Inherit letter spacing from parent
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.body, // Body: 16
    fontWeight: typography.fontWeight.semibold, // 600 - bolder for readability
    color: colors.neutral.darkText, // Darker for better contrast
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
    textAlign: 'center',
    maxWidth: 320, // Optimal reading width for better readability
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featureCard: {
    marginBottom: layout.spacing.xl, // 32px - consistent spacing between cards (multiple of 16px)
    borderRadius: layout.borderRadius.medium, // 16px for premium feel
    minHeight: layout.spacing.xxl + layout.spacing.lg, // 104px - uniform card height using tokens
    // Liquid glass effect: more transparent for see-through appearance
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // More transparent for glass morphism
    overflow: 'hidden', // Required for BlurView to work properly
    // Shadow is handled by Card component and AnimatedCard animation
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: FEATURE_ICON_SIZE,
    height: FEATURE_ICON_SIZE,
    borderRadius: FEATURE_ICON_SIZE / 2, // Perfect circle: half of width/height
    backgroundColor: colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layout.spacing.md, // Reduced from lg for tighter spacing
    flexShrink: 0, // Prevent icon from shrinking
  },
  featureText: {
    flex: 1,
    justifyContent: 'center', // Vertically center text content
  },
  featureTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h2, // H2: 22
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.h2 * typography.lineHeight.heading, // 22 * 1.3 = 28.6
    marginBottom: layout.spacing.xs, // 4px - tight spacing between title and description
  },
  featureDescription: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.body, // Body: 16
    fontWeight: typography.fontWeight.medium, // 500 - bolder for readability on glass
    color: colors.neutral.darkText, // Darker for better contrast on transparent background
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginTop removed - spacing comes from last feature card's marginBottom
    marginBottom: layout.spacing.xl, // 32px - uniform spacing matching cards
    paddingVertical: layout.spacing.xl, // 32px vertical padding for breathing room
    paddingHorizontal: layout.spacing.md, // 16px internal padding
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Liquid glass: more transparent
    borderRadius: layout.borderRadius.medium, // 16px rounded corners
    marginHorizontal: -layout.spacing.xs, // Slight edge-to-edge feel while maintaining padding
    overflow: 'hidden', // Required for BlurView
    // Subtle border for definition
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.primary.green,
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.heading, // 30 * 1.3 = 39
    marginBottom: layout.spacing.xs,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small, // Small: 14
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.small * typography.lineHeight.body, // 14 * 1.5 = 21
    textAlign: 'center',
  },
  bookButtonContainer: {
    // marginTop removed - spacing comes from statsRow's marginBottom
    marginBottom: layout.spacing['2xl'], // 48px - keep bottom spacing for nav bar clearance
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.green,
    height: 56, // ~56px height as specified
    paddingHorizontal: layout.spacing.xl,
    borderRadius: layout.borderRadius.pill, // Full pill shape (radius 999)
    width: '100%', // Full-width
    // Shadow is handled by the animated wrapper above
  },
  bookButtonIcon: {
    marginRight: layout.spacing.sm, // Small spacing between icon and text
  },
  bookButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.body, // Body: 16
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.white,
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
  },
});
