import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export default function AboutScreen() {
  const coaches = [
    {
      id: 1,
      name: 'Rishit Sharma',
      credentials: 'Nationally Ranked USTA Player',
      bio: 'Rishit brings extensive tennis experience and has coached players from beginner to advanced level, helping them improve their game through personalized coaching and expert analysis.',
      specialties: ['Serve Technique', 'Mental Game', 'Tournament Preparation'],
      social: {
        instagram: '@rishit.sharma.115',
        linkedin: 'rishit-sharma-ai',
      },
    },
    {
      id: 2,
      name: 'Mihir Mohan',
      credentials: 'Elite Tennis Coach',
      bio: 'Mihir specializes in advanced technique and has helped numerous players achieve their tennis goals through focused coaching and strategic development.',
      specialties: ['Advanced Footwork', 'Strategy & Tactics', 'Physical Conditioning'],
      social: {
        instagram: '@',
        linkedin: '@',
      },
    },
  ];

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
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
  scrollContent: {
    paddingBottom: 120, // Extra padding to ensure mission card is fully visible
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
  },
  coachesSection: {
    paddingHorizontal: layout.spacing.lg,
    marginBottom: layout.spacing.lg,
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
    color: colors.neutral.gray[500],
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
    borderTopColor: colors.neutral.gray[300],
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
    alignSelf: 'center',
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
    color: colors.neutral.gray[500],
    lineHeight: 22,
    textAlign: 'center',
  },
});
