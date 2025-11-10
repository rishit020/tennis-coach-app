import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/ui';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export default function HomeScreen() {
  const handleBookLesson = () => {
    router.push('/(tabs)/coaching');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoText}>
            Upload your tennis videos and receive detailed feedback within 24 hours.
          </Text>
        </Card>

        {/* Feature Cards */}
        <TouchableOpacity onPress={handleBookLesson} activeOpacity={0.8}>
          <Card style={styles.featureCard}>
            <View style={styles.featureContent}>
              <View style={styles.featureIcon}>
                <Ionicons name="people" size={28} color={colors.neutral.white} />
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
                <Ionicons name="star" size={28} color={colors.neutral.white} />
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
        <TouchableOpacity style={styles.bookButton} onPress={handleBookLesson} activeOpacity={0.8}>
          <Ionicons name="videocam" size={20} color={colors.neutral.white} style={{ marginRight: layout.spacing.sm }} />
          <Text style={styles.bookButtonText}>Book a Lesson</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: layout.spacing.xl,
  },
  infoCard: {
    marginBottom: layout.spacing.lg,
    borderRadius: layout.borderRadius.card,
    alignItems: 'center',
    ...layout.shadows.md,
  },
  infoText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[900],
    textAlign: 'center',
    lineHeight: 22,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layout.spacing.lg,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: layout.spacing.xl,
    marginBottom: layout.spacing.xl,
    paddingHorizontal: layout.spacing.md,
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
    marginTop: layout.spacing.md,
    ...layout.shadows.sm,
  },
  bookButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
});
