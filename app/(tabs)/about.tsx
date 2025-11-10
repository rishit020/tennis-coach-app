import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export default function AboutScreen() {
  const coaches = [
    {
      id: 1,
      name: 'Sarah Johnson',
      credentials: 'USPTA Certified, Former WTA Player',
      bio: 'Sarah brings 15 years of professional tennis experience and has coached players from beginner to professional level.',
      specialties: ['Serve Technique', 'Mental Game', 'Tournament Preparation'],
      social: {
        instagram: '@sarahjtennis',
        twitter: '@sarahj_coach',
      },
    },
    {
      id: 2,
      name: 'Michael Chen',
      credentials: 'ITF Level 2 Coach, Former ATP Player',
      bio: 'Michael specializes in advanced technique and has helped numerous players achieve their college tennis goals.',
      specialties: ['Advanced Footwork', 'Strategy & Tactics', 'Physical Conditioning'],
      social: {
        instagram: '@mchen_tennis',
        linkedin: 'michael-chen-tennis',
      },
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      credentials: 'USTA High Performance Coach, Sports Psychology Certified',
      bio: 'Emma focuses on junior development and mental coaching, helping young players build confidence and resilience.',
      specialties: ['Junior Development', 'Mental Training', 'Parent Education'],
      social: {
        instagram: '@emmar_tennis',
        facebook: 'EmmaRodriguezTennis',
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Ionicons name="star" size={16} color={colors.neutral.white} />
            <Text style={styles.badgeText}> Elite Tennis Coaching</Text>
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            About <Text style={styles.titleAccent}>TennisPro Coaching</Text>
          </Text>
          <Text style={styles.subtitle}>
            We're passionate about helping tennis players of all levels improve their game through personalized coaching and expert analysis from nationally ranked players.
          </Text>
        </View>

        {/* Coach Cards */}
        <View style={styles.coachesSection}>
          {coaches.map((coach) => (
            <Card key={coach.id} style={styles.coachCard}>
              <View style={styles.coachHeader}>
                <View style={styles.coachAvatar}>
                  <Ionicons name="person" size={32} color={colors.primary.green} />
                </View>
                <View style={styles.coachInfo}>
                  <Text style={styles.coachName}>{coach.name}</Text>
                  <Text style={styles.coachCredentials}>{coach.credentials}</Text>
                </View>
              </View>
              
              <Text style={styles.coachBio}>{coach.bio}</Text>
              
              <View style={styles.specialtiesSection}>
                <Text style={styles.specialtiesTitle}>Specialties:</Text>
                <View style={styles.specialtiesList}>
                  {coach.specialties.map((specialty, index) => (
                    <View key={index} style={styles.specialtyTag}>
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.socialSection}>
                <Text style={styles.socialTitle}>Connect:</Text>
                <View style={styles.socialLinks}>
                  {coach.social.instagram && (
                    <View style={styles.socialLink}>
                      <Ionicons name="logo-instagram" size={16} color={colors.primary.green} />
                      <Text style={styles.socialText}>{coach.social.instagram}</Text>
                    </View>
                  )}
                  {coach.social.twitter && (
                    <View style={styles.socialLink}>
                      <Ionicons name="logo-twitter" size={16} color={colors.primary.green} />
                      <Text style={styles.socialText}>{coach.social.twitter}</Text>
                    </View>
                  )}
                  {coach.social.linkedin && (
                    <View style={styles.socialLink}>
                      <Ionicons name="logo-linkedin" size={16} color={colors.primary.green} />
                      <Text style={styles.socialText}>{coach.social.linkedin}</Text>
                    </View>
                  )}
                  {coach.social.facebook && (
                    <View style={styles.socialLink}>
                      <Ionicons name="logo-facebook" size={16} color={colors.primary.green} />
                      <Text style={styles.socialText}>{coach.social.facebook}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Mission Statement */}
        <Card style={styles.missionCard}>
          <View style={styles.missionIcon}>
            <Ionicons name="heart" size={32} color={colors.neutral.white} />
          </View>
          <Text style={styles.missionTitle}>Our Mission</Text>
          <Text style={styles.missionDescription}>
            To provide accessible, high-quality tennis coaching that helps players develop their skills, build confidence, and achieve their goals on and off the court.
          </Text>
        </Card>

        {/* Team Section */}
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>Meet Our Team</Text>
          <View style={styles.teamCards}>
            <View style={styles.teamCard}>
              <View style={styles.teamIcon}>
                <Ionicons name="medal" size={24} color={colors.neutral.white} />
              </View>
            </View>
            <View style={styles.teamCard}>
              <View style={styles.teamIcon}>
                <Ionicons name="trophy" size={24} color={colors.neutral.white} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  badgeContainer: {
    paddingHorizontal: layout.spacing.lg,
    paddingTop: 60,
    paddingBottom: layout.spacing.md,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.green,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.borderRadius.full,
  },
  badgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  header: {
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: layout.spacing.xl,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.md,
    textAlign: 'left',
  },
  titleAccent: {
    color: colors.primary.green,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[600],
    textAlign: 'left',
    lineHeight: 24,
  },
  coachesSection: {
    // Hidden - React Native doesn't support display: 'none'
    height: 0,
    overflow: 'hidden',
    opacity: 0,
  },
  coachCard: {
    marginBottom: layout.spacing.lg,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  coachAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layout.spacing.md,
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.xs,
  },
  coachCredentials: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.green,
    fontWeight: typography.fontWeight.medium,
  },
  coachBio: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[600],
    lineHeight: 22,
    marginBottom: layout.spacing.md,
  },
  specialtiesSection: {
    marginBottom: layout.spacing.md,
  },
  specialtiesTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.gray[700],
    marginBottom: layout.spacing.sm,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -layout.spacing.xs / 2,
  },
  specialtyTag: {
    backgroundColor: colors.primary.green + '20',
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.sm,
    margin: layout.spacing.xs / 2,
  },
  specialtyText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.green,
    fontWeight: typography.fontWeight.medium,
  },
  socialSection: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray[200],
    paddingTop: layout.spacing.md,
  },
  socialTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.gray[700],
    marginBottom: layout.spacing.sm,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -layout.spacing.md / 2,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: layout.spacing.md / 2,
  },
  socialText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.green,
    marginLeft: layout.spacing.xs,
  },
  missionCard: {
    marginHorizontal: layout.spacing.lg,
    marginBottom: layout.spacing.xl,
    alignItems: 'center',
    ...layout.shadows.md,
  },
  missionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacing.lg,
  },
  missionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  missionDescription: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[600],
    lineHeight: 22,
    textAlign: 'center',
  },
  teamSection: {
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.lg,
  },
  teamCards: {
    flexDirection: 'row',
    marginHorizontal: -layout.spacing.md / 2,
  },
  teamCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: layout.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: layout.spacing.md / 2,
    ...layout.shadows.md,
  },
  teamIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
