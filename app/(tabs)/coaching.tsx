import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { CoachingForm } from '@/components/forms';
import { colors } from '@/constants/colors';

export default function CoachingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CoachingForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
});
