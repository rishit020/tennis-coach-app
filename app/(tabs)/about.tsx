import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

interface CoachCardProps {
  name: string;
  role: string;
  description: string;
  certifications: string[];
  icon: string;
}

function CoachCard({ name, role, description, certifications, icon }: CoachCardProps) {
  return (
    <Card style={styles.coachCard} padding="lg" shadow="md">
      <View style={styles.coachCardContent}>
        {/* Icon */}
        <View style={styles.coachIconContainer}>
          <View style={styles.coachIconCircle}>
            <Ionicons name={icon as any} size={32} color={colors.neutral.white} />
          </View>
        </View>

        {/* Name */}
        <Text style={styles.coachName}>{name}</Text>

        {/* Role */}
        <Text style={styles.coachRole}>{role}</Text>

        {/* Description */}
        <Text style={styles.coachDescription}>{description}</Text>

        {/* Certifications */}
        <View style={styles.certificationsContainer}>
          {certifications.map((cert, index) => (
            <View key={index} style={styles.certificationBadge}>
              <Text style={styles.certificationText}>{cert}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

export default function AboutScreen() {
  const screenWidth = Dimensions.get('window').width;
  const maxContentWidth = 768; // Max width for desktop
  const isTablet = screenWidth >= 600; // Tablet breakpoint

  const coaches = [
    {
      name: 'Rishit Sharma',
      role: 'Performance Coach',
      description: 'Top USTA nationally ranked player with 9+ years of competitive tennis experience.',
      certifications: ['USTA Certified', 'Nationally Ranked'],
      icon: 'medal',
    },
    {
      name: 'Mihir Mohan',
      role: 'Performance Coach',
      description: 'Top USTA nationally ranked player with 9+ years of competitive tennis experience.',
      certifications: ['USTA Certified', 'Nationally Ranked'],
      icon: 'trophy',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.content, { maxWidth: maxContentWidth }]}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>
              About <Text style={styles.titleAccent}>TennisPro Coaching</Text>
            </Text>
            <Text style={styles.headerSubtitle}>
              We're passionate about helping tennis players of all levels improve their game through personalized coaching and expert analysis from nationally ranked players.
            </Text>
          </View>

          {/* Mission Section */}
          <View style={styles.section}>
            <Card style={styles.missionCard} padding="lg" shadow="md">
              <View style={styles.missionIconContainer}>
                <View style={styles.missionIcon}>
                  <Ionicons name="heart" size={28} color={colors.neutral.white} />
                </View>
              </View>
              <Text style={styles.missionTitle}>Our Mission</Text>
              <Text style={styles.missionDescription}>
                To provide accessible, high-quality tennis coaching that helps players develop their skills, build confidence, and achieve their goals on and off the court. We believe every player deserves expert guidance from coaches who understand the game at the highest level.
              </Text>
            </Card>
          </View>

          {/* Why Choose Us Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose Us</Text>
            <View style={[styles.featuresGrid, !isTablet && styles.featuresGridMobile]}>
              <View style={[styles.featureCardWrapper, !isTablet && styles.featureCardWrapperMobile]}>
                <Card style={styles.featureCard} padding="md" shadow="sm">
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="star" size={24} color={colors.primary.green} />
                  </View>
                  <Text style={styles.featureTitle}>Nationally Ranked Coaches</Text>
                  <Text style={styles.featureDescription}>
                    Learn from USTA nationally ranked players with proven competitive experience.
                  </Text>
                </Card>
              </View>
              <View style={[styles.featureCardWrapper, !isTablet && styles.featureCardWrapperMobile]}>
                <Card style={styles.featureCard} padding="md" shadow="sm">
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="videocam" size={24} color={colors.primary.green} />
                  </View>
                  <Text style={styles.featureTitle}>Video Analysis</Text>
                  <Text style={styles.featureDescription}>
                    Get detailed feedback on your technique through professional video analysis.
                  </Text>
                </Card>
              </View>
              <View style={[styles.featureCardWrapper, !isTablet && styles.featureCardWrapperMobile]}>
                <Card style={styles.featureCard} padding="md" shadow="sm">
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="person" size={24} color={colors.primary.green} />
                  </View>
                  <Text style={styles.featureTitle}>Personalized Coaching</Text>
                  <Text style={styles.featureDescription}>
                    Receive tailored instruction that matches your skill level and goals.
                  </Text>
                </Card>
              </View>
              <View style={[styles.featureCardWrapper, !isTablet && styles.featureCardWrapperMobile]}>
                <Card style={styles.featureCard} padding="md" shadow="sm">
                  <View style={styles.featureIconContainer}>
                    <Ionicons name="calendar" size={24} color={colors.primary.green} />
                  </View>
                  <Text style={styles.featureTitle}>Flexible Scheduling</Text>
                  <Text style={styles.featureDescription}>
                    Book sessions that fit your schedule with our flexible coaching options.
                  </Text>
                </Card>
              </View>
            </View>
          </View>

          {/* Meet Our Team Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meet Our Team</Text>
            <View style={[styles.teamCardsContainer, !isTablet && styles.teamCardsContainerMobile]}>
              {coaches.map((coach, index) => (
                <View key={index} style={[styles.teamCardWrapper, !isTablet && styles.teamCardWrapperMobile]}>
                  <CoachCard
                    name={coach.name}
                    role={coach.role}
                    description={coach.description}
                    certifications={coach.certifications}
                    icon={coach.icon}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* What We Offer Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What We Offer</Text>
            <Card style={styles.offerCard} padding="lg" shadow="md">
              <View style={styles.offerList}>
                <View style={styles.offerItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary.green} />
                  <Text style={styles.offerText}>Private one-on-one coaching sessions</Text>
                </View>
                <View style={styles.offerItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary.green} />
                  <Text style={styles.offerText}>Video analysis and technique breakdown</Text>
                </View>
                <View style={styles.offerItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary.green} />
                  <Text style={styles.offerText}>Strategy and game planning sessions</Text>
                </View>
                <View style={styles.offerItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary.green} />
                  <Text style={styles.offerText}>Mental game and tournament preparation</Text>
                </View>
                <View style={styles.offerItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary.green} />
                  <Text style={styles.offerText}>All skill levels welcome</Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Call to Action Section */}
          <View style={styles.section}>
            <Card style={styles.ctaCard} padding="lg" shadow="md">
              <View style={styles.ctaIconContainer}>
                <Ionicons name="tennisball" size={32} color={colors.primary.green} />
              </View>
              <Text style={styles.ctaTitle}>Ready to Elevate Your Game?</Text>
              <Text style={styles.ctaDescription}>
                Book a session with our nationally ranked coaches and take your tennis to the next level. Whether you're a beginner or advanced player, we're here to help you achieve your goals.
              </Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingTop: layout.spacing['3xl'], // 64px
    paddingHorizontal: layout.spacing.lg + layout.spacing.xs, // 24px
    paddingBottom: layout.spacing['2xl'], // 48px
    alignSelf: 'center',
    width: '100%',
  },
  // Header Section
  headerSection: {
    marginBottom: layout.spacing['2xl'], // 48px
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h1, // 32px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.h1 * typography.lineHeight.heading, // 32 * 1.3 = 41.6
    marginBottom: layout.spacing.md, // 16px
    textAlign: 'center',
  },
  titleAccent: {
    color: colors.primary.green,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.gray[500],
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
    textAlign: 'center',
    paddingHorizontal: layout.spacing.md,
  },
  // Section
  section: {
    marginBottom: layout.spacing['2xl'], // 48px
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['2xl'], // 24px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.heading, // 24 * 1.3 = 31.2
    marginBottom: layout.spacing.lg, // 24px
    textAlign: 'center',
  },
  // Mission Card
  missionCard: {
    backgroundColor: '#F8FAFC', // Very light subtle gray
    borderRadius: layout.borderRadius.xl, // 16px
    alignItems: 'center',
  },
  missionIconContainer: {
    marginBottom: layout.spacing.lg, // 24px
  },
  missionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl, // 20px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    marginBottom: layout.spacing.md, // 16px
    textAlign: 'center',
  },
  missionDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.gray[600],
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
    textAlign: 'center',
  },
  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -layout.spacing.sm, // Negative margin for spacing
  },
  featuresGridMobile: {
    flexDirection: 'column',
  },
  featureCardWrapper: {
    flex: 1,
    minWidth: '45%', // 2 columns on larger screens
    margin: layout.spacing.sm, // 8px margin
  },
  featureCardWrapperMobile: {
    minWidth: '100%', // Full width on mobile
  },
  featureCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: layout.borderRadius.medium, // 16px
    alignItems: 'center',
    height: '100%',
  },
  featureIconContainer: {
    marginBottom: layout.spacing.md, // 16px
  },
  featureTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg, // 18px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    marginBottom: layout.spacing.sm, // 8px
    textAlign: 'center',
  },
  featureDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small, // 14px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.gray[600],
    lineHeight: typography.fontSize.small * typography.lineHeight.body, // 14 * 1.5 = 21
    textAlign: 'center',
  },
  // Team Cards
  teamCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -layout.spacing.sm, // Negative margin for spacing
  },
  teamCardsContainerMobile: {
    flexDirection: 'column',
  },
  teamCardWrapper: {
    flex: 1,
    minWidth: '45%', // 2 columns on larger screens
    margin: layout.spacing.sm, // 8px margin
  },
  teamCardWrapperMobile: {
    minWidth: '100%', // Full width on mobile
  },
  coachCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: layout.borderRadius.xl, // 16px
    height: '100%',
  },
  coachCardContent: {
    alignItems: 'center',
  },
  coachIconContainer: {
    marginBottom: layout.spacing.lg, // 24px
  },
  coachIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for depth
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  coachName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl, // 20px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    marginBottom: layout.spacing.xs, // 4px
    textAlign: 'center',
  },
  coachRole: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.medium, // 500
    color: colors.primary.green,
    marginBottom: layout.spacing.md, // 16px
    textAlign: 'center',
  },
  coachDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small, // 14px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.gray[600],
    lineHeight: typography.fontSize.small * typography.lineHeight.body, // 14 * 1.5 = 21
    marginBottom: layout.spacing.lg, // 24px
    textAlign: 'center',
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -layout.spacing.xs, // Negative margin for spacing
  },
  certificationBadge: {
    backgroundColor: '#E8F5E9', // Light green background
    paddingHorizontal: layout.spacing.md, // 16px
    paddingVertical: layout.spacing.sm, // 8px
    borderRadius: layout.borderRadius.md, // 8px
    margin: layout.spacing.xs, // 4px
  },
  certificationText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.small, // 14px
    fontWeight: typography.fontWeight.medium, // 500
    color: colors.primary.green,
  },
  // Offer Card
  offerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: layout.borderRadius.xl, // 16px
  },
  offerList: {
    width: '100%',
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md, // 16px
  },
  offerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.darkText,
    marginLeft: layout.spacing.sm, // 8px
    flex: 1,
  },
  // CTA Card
  ctaCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: layout.borderRadius.xl, // 16px
    alignItems: 'center',
  },
  ctaIconContainer: {
    marginBottom: layout.spacing.md, // 16px
  },
  ctaTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl, // 20px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    marginBottom: layout.spacing.sm, // 8px
    textAlign: 'center',
  },
  ctaDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.gray[600],
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
    textAlign: 'center',
  },
});
