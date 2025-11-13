import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedCard } from '@/components/animated-card';
import { TennisBallAccent } from '@/components/tennis-ball-accent';
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

  // Calculate initial position: header height + some padding
  // Position ball to align with heading text area
  const headerHeight = layout.spacing['3xl']; // 64px (content paddingTop)
  const headerSectionHeight = HEADER_ICON_SIZE + layout.spacing['2xl'] + layout.spacing.md; // Icon + spacing + text
  const ballTopPosition = headerHeight + headerSectionHeight + layout.spacing.xl; // Position for heading area

  return (
    <View style={styles.wrapper}>
      {/* Fixed Tennis Ball Accent - Locked in Position */}
      <View
        style={[
          styles.fixedBallContainer,
          {
            top: ballTopPosition,
          },
        ]}>
        <TennisBallAccent size={240} opacity={0.08} />
      </View>

      <Animated.ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
      <View style={[styles.content, { paddingBottom: bottomPadding }]}>
        {/* App Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <View style={styles.headerIcon}>
              <Ionicons name="tennisball-outline" size={layout.iconSize.md} color={colors.neutral.white} />
            </View>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.appName}>TennisPro Coaching</Text>
            <Text style={styles.appTagline}>Elite Tennis Coaching</Text>
          </View>
        </View>

        {/* Main Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.mainHeading}>
            Elevate Your <Text style={styles.highlightedText}>Tennis</Text> Game
          </Text>
          <Text style={styles.description}>
            Get personalized feedback from nationally ranked USTA players. Upload your videos and receive expert analysis.
          </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  fixedBallContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -120, // Half of ball size (240/2) to center it
    width: 240,
    height: 240,
    zIndex: 1, // Behind text but above background
    pointerEvents: 'none', // Allow touches to pass through
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingTop: layout.spacing['3xl'], // 64px - multiple of 16px for consistent rhythm
    paddingHorizontal: layout.spacing.lg + layout.spacing.xs, // 24px - premium horizontal margin using tokens
    backgroundColor: colors.neutral.white,
    // paddingBottom is calculated dynamically based on nav bar height and safe area
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacing['2xl'], // 48px - consistent major section spacing
    flexWrap: 'wrap', // Allow wrapping on smaller screens
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
  },
  appTagline: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small, // Small: 14
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.gray[500],
    lineHeight: typography.fontSize.small * typography.lineHeight.body, // 14 * 1.5 = 21
    textAlign: 'center',
  },
  headingContainer: {
    marginBottom: layout.spacing['2xl'], // 48px - consistent major section spacing
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: layout.spacing.xl, // 32px - multiple of 16px
    position: 'relative',
    minHeight: layout.spacing.xxl * 2.5, // 200px - using spacing token (80 * 2.5)
    backgroundColor: 'transparent', // Transparent to show parallax ball
    zIndex: 2, // Above parallax ball
    overflow: 'visible', // Allow ball to show through
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
    zIndex: 1, // Ensure text appears above accent
  },
  highlightedText: {
    fontFamily: typography.fontFamily.bold,
    color: colors.primary.green,
    letterSpacing: -0.5, // Inherit letter spacing from parent
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body, // Body: 16
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.mutedGray,
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
    textAlign: 'center',
    maxWidth: 320, // Optimal reading width for better readability
    zIndex: 1, // Ensure text appears above accent
  },
  featureCard: {
    marginBottom: layout.spacing.xl, // 32px - consistent spacing between cards (multiple of 16px)
    borderRadius: layout.borderRadius.medium, // 16px for premium feel
    minHeight: layout.spacing.xxl + layout.spacing.lg, // 104px - uniform card height using tokens
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
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body, // Body: 16
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.mutedGray, // Muted gray for better contrast and hierarchy
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginTop removed - spacing comes from last feature card's marginBottom
    marginBottom: layout.spacing.xl, // 32px - uniform spacing matching cards
    paddingVertical: layout.spacing.xl, // 32px vertical padding for breathing room
    paddingHorizontal: layout.spacing.md, // 16px internal padding
    backgroundColor: colors.neutral.background, // Subtle background for visual separation
    borderRadius: layout.borderRadius.medium, // 16px rounded corners
    marginHorizontal: -layout.spacing.xs, // Slight edge-to-edge feel while maintaining padding
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
