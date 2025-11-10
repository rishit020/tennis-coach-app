import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { ContactForm } from '@/components/forms';
import { colors } from '@/constants/colors';

export default function ContactScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ContactForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
});
