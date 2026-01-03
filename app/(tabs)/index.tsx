import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export default function HomeScreen() {
  const handleBookLesson = () => {
    router.push('/(tabs)/coaching');
  };

  return (
    <View style={styles.gradientContainer}>
      {/* Base background */}
      <View style={styles.baseBackground} />
      
      {/* Radial blob 1 - Top-left green */}
      <LinearGradient
        colors={['#2E7D32', '#2E7D32A0', '#2E7D3260', '#2E7D3200']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.radialBlob1}
      />
      
      {/* Radial blob 2 - Center blue */}
      <LinearGradient
        colors={['#4A90E200', '#4A90E240', '#4A90E2A0', '#4A90E2']}
        start={{ x: 0.3, y: 0.3 }}
        end={{ x: 0.8, y: 0.8 }}
        style={styles.radialBlob2}
      />
      
      {/* Radial blob 3 - Top-right white/blue */}
      <LinearGradient
        colors={['#F5F9FF', '#F5F9FFA0', '#F5F9FF60', '#F5F9FF00']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.radialBlob3}
      />
      
      {/* Radial blob 4 - Bottom-left green/blue blend */}
      <LinearGradient
        colors={['#2E7D3200', '#2E7D3250', '#4A90E280', '#4A90E260']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0.3 }}
        style={styles.radialBlob4}
      />
      
      {/* Radial blob 5 - Bottom-right white/green */}
      <LinearGradient
        colors={['#F5F9FF00', '#F5F9FF40', '#2E7D3260', '#2E7D3240']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0.2, y: 0.2 }}
        style={styles.radialBlob5}
      />
      
      {/* Radial blob 6 - Center-top white */}
      <LinearGradient
        colors={['#F5F9FF', '#F5F9FF80', '#F5F9FF40', '#F5F9FF00']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.radialBlob6}
      />
      
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
          {/* Tennis Pro Coaching Banner */}
          <View style={styles.bannerContainer}>
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
            <View style={styles.bannerContent}>
              <View style={styles.bannerIconContainer}>
                <View style={styles.bannerIcon}>
                  <Ionicons name="tennisball-outline" size={layout.iconSize.lg} color={colors.primary.green} />
                </View>
              </View>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>TennisPro Coaching</Text>
                <Text style={styles.bannerSubtext}>Elite Tennis Coaching</Text>
              </View>
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Elevate Your <Text style={styles.titleAccent}>Tennis</Text> Game
            </Text>
            <Text style={styles.subtitle}>
              Get personalized feedback from nationally ranked USTA players. Upload your videos and receive expert analysis.
            </Text>
          </View>

          {/* Quick Benefits Section */}
          <View style={styles.benefitsSection}>
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
            <View style={styles.benefitsContent}>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary.green} />
                <Text style={styles.benefitText}>24-Hour Response Time</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary.green} />
                <Text style={styles.benefitText}>USTA Certified Coaches</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary.green} />
                <Text style={styles.benefitText}>All Skill Levels Welcome</Text>
              </View>
            </View>
          </View>

          {/* Feature Cards */}
          <Card style={styles.featureCard}>
            <View style={styles.featureContent}>
              <View style={styles.featureIcon}>
                <Ionicons name="videocam-outline" size={layout.iconSize.md} color={colors.neutral.white} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Video Analysis</Text>
                <Text style={styles.featureDescription}>
                  Upload your tennis videos and receive detailed feedback within 24 hours.
                </Text>
              </View>
            </View>
          </Card>

          <TouchableOpacity onPress={handleBookLesson} activeOpacity={0.8}>
            <Card style={styles.featureCard}>
              <View style={styles.featureContent}>
                <View style={styles.featureIcon}>
                  <Ionicons name="person-outline" size={layout.iconSize.md} color={colors.neutral.white} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>1-on-1 Coaching</Text>
                  <Text style={styles.featureDescription}>
                    Book private lessons with USTA certified coaches for personalized training.
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBookLesson} activeOpacity={0.8}>
            <Card style={styles.featureCard}>
              <View style={styles.featureContent}>
                <View style={styles.featureIcon}>
                  <Ionicons name="trophy-outline" size={layout.iconSize.md} color={colors.neutral.white} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Expert Coaches</Text>
                  <Text style={styles.featureDescription}>
                    Learn from nationally ranked players with 9+ years of experience.
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          {/* Statistics Row */}
          <Card style={styles.statsCard}>
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
          </Card>

          {/* Book a Lesson Button */}
          <TouchableOpacity style={styles.bookButton} onPress={handleBookLesson} activeOpacity={0.8}>
            <Ionicons name="calendar-outline" size={layout.iconSize.sm} color={colors.neutral.white} style={styles.bookButtonIcon} />
            <Text style={styles.bookButtonText}>Book a Lesson</Text>
          </TouchableOpacity>

          {/* Trust Indicator */}
          <View style={styles.trustSection}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary.green} />
            <Text style={styles.trustText}>Trusted by 500+ players nationwide</Text>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  baseBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5F9FF',
  },
  radialBlob1: {
    position: 'absolute',
    top: -200,
    left: -200,
    width: 600,
    height: 600,
    borderRadius: 300,
    opacity: 0.5,
  },
  radialBlob2: {
    position: 'absolute',
    top: 200,
    left: 100,
    width: 500,
    height: 500,
    borderRadius: 250,
    opacity: 0.45,
  },
  radialBlob3: {
    position: 'absolute',
    top: -150,
    right: -150,
    width: 550,
    height: 550,
    borderRadius: 275,
    opacity: 0.4,
  },
  radialBlob4: {
    position: 'absolute',
    bottom: -200,
    left: -150,
    width: 600,
    height: 600,
    borderRadius: 300,
    opacity: 0.5,
  },
  radialBlob5: {
    position: 'absolute',
    bottom: -150,
    right: -200,
    width: 550,
    height: 550,
    borderRadius: 275,
    opacity: 0.45,
  },
  radialBlob6: {
    position: 'absolute',
    top: 100,
    left: 50,
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.35,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingTop: layout.spacing.md,
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: 120, // Increased bottom padding to ensure button is fully visible
  },
  bannerContainer: {
    marginBottom: layout.spacing.xl,
    borderRadius: layout.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    ...layout.shadows.md,
  },
  webBlurContainer: Platform.select({
    web: {
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    } as any,
    default: {},
  }),
  bannerContent: {
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.lg,
  },
  bannerIconContainer: {
    marginRight: layout.spacing.md,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.green,
    marginBottom: layout.spacing.xs / 2,
  },
  bannerSubtext: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.gray[600],
  },
  header: {
    paddingBottom: layout.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  titleAccent: {
    color: colors.primary.green,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[500],
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: layout.spacing.md,
  },
  benefitsSection: {
    marginBottom: layout.spacing.xl,
    borderRadius: layout.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    ...layout.shadows.md,
  },
  benefitsContent: {
    position: 'relative',
    zIndex: 1,
    paddingVertical: layout.spacing.lg,
    paddingHorizontal: layout.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  benefitItemLast: {
    marginBottom: 0,
  },
  benefitText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray[700],
    marginLeft: layout.spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
  featureCard: {
    marginBottom: layout.spacing.lg,
    borderRadius: layout.borderRadius.card,
    ...layout.shadows.md,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layout.spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.xs,
  },
  featureDescription: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[500],
    lineHeight: 22,
  },
  statsCard: {
    marginBottom: layout.spacing.lg,
    borderRadius: layout.borderRadius.card,
    ...layout.shadows.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: layout.spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.green,
    marginBottom: layout.spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray[900],
    textAlign: 'center',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.green,
    paddingVertical: layout.spacing.md + 4,
    paddingHorizontal: layout.spacing.xl,
    borderRadius: layout.borderRadius.full,
    marginTop: layout.spacing.lg,
    marginBottom: layout.spacing.xl,
    ...layout.shadows.sm,
  },
  bookButtonIcon: {
    marginRight: layout.spacing.sm,
  },
  bookButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
  trustSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.lg,
    marginBottom: layout.spacing.lg,
  },
  trustText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray[600],
    marginLeft: layout.spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
