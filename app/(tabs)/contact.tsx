import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContactForm } from '@/components/forms';

export default function ContactScreen() {
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
        <ContactForm />
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
});
