import React, { useRef } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { Card } from './ui';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function AnimatedCard({
  children,
  onPress,
  style,
  padding,
  shadow,
  disabled = false,
}: AnimatedCardProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const shadowOpacity = useRef(new Animated.Value(0.08)).current; // Match Card shadow.sm opacity
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    // Check for reduce motion preference
    if (Platform.OS !== 'web') {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    }
  }, []);

  const handlePressIn = () => {
    if (reduceMotion || disabled) return;
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.15, // Enhanced shadow on press
        duration: 150,
        useNativeDriver: false, // Shadow opacity doesn't support native driver
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (reduceMotion || disabled) return;
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.08, // Return to base shadow opacity
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled || !onPress}>
      <Animated.View
        style={[
          {
            transform: [{ translateY }],
          },
        ]}>
        <Animated.View
          style={[
            {
              // Apply shadow properties to the wrapper for animation
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: reduceMotion ? 0.08 : shadowOpacity,
              shadowRadius: 4,
              elevation: reduceMotion ? 3 : 4, // Static elevation for Android (can't interpolate)
            },
          ]}>
          <Card style={style} padding={padding} shadow={null}>
            {children}
          </Card>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

