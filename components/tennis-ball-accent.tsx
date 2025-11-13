import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

interface TennisBallAccentProps {
  size?: number;
  opacity?: number;
}

export function TennisBallAccent({ size = 200, opacity = 0.06 }: TennisBallAccentProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Ionicons 
        name="tennisball-outline" 
        size={size} 
        color={colors.neutral.gray[400]} 
        style={{ opacity }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

