import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CoachingForm } from '@/components/forms';
import { colors } from '@/constants/colors';

export default function CoachingScreen() {
  return (
    <View style={styles.container}>
      <CoachingForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white, // White background to match image
  },
});
