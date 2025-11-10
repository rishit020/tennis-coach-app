import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { UploadForm } from '@/components/forms';
import { colors } from '@/constants/colors';

export default function UploadScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <UploadForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
});
