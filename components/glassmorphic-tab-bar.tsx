import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';

interface TabIconProps {
  icon: React.ReactNode;
  label: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function TabIcon({ icon, label, isFocused, onPress, onLongPress }: TabIconProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check for reduce motion preference
    if (Platform.OS !== 'web') {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    }
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    
    Animated.timing(scaleAnim, {
      toValue: isFocused ? 1.15 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isFocused, reduceMotion]);

  const handlePress = () => {
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!reduceMotion) {
      // Bounce animation on press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: isFocused ? 1.15 : 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.tabButton}
      activeOpacity={1}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
        {icon}
      </Animated.View>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, isFocused && styles.labelActive]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function GlassmorphicTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPadding }]}>
      <View style={styles.container}>
        {Platform.OS === 'web' ? (
          <View style={[StyleSheet.absoluteFill, styles.webBlurContainer]}>
            {/* Semi-transparent white overlay */}
            <View style={styles.overlay} />
            
            {/* Inner highlight gradient */}
            <LinearGradient
              colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ) : (
          <BlurView intensity={25} tint="light" style={StyleSheet.absoluteFill}>
            {/* Semi-transparent white overlay */}
            <View style={styles.overlay} />
            
            {/* Inner highlight gradient */}
            <LinearGradient
              colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </BlurView>
        )}

        {/* Tab buttons */}
        <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const icon = options.tabBarIcon
            ? options.tabBarIcon({
                focused: isFocused,
                color: isFocused ? colors.primary.green : colors.neutral.gray[600],
                size: 26,
              })
            : null;

          return (
            <TabIcon
              key={route.key}
              icon={icon}
              label={typeof label === 'string' ? label : route.name}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16, // Horizontal margins for pill shape
  },
  container: {
    width: '100%',
    maxWidth: 600, // Max width for larger screens
    height: 70, // Taller to accommodate icons and labels
    borderRadius: 35, // Rounded pill shape (half of height)
    overflow: 'hidden',
    // Soft shadow for floating appearance
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  webBlurContainer: Platform.select({
    web: {
      backdropFilter: 'blur(25px)',
      WebkitBackdropFilter: 'blur(25px)',
    } as any,
    default: {},
  }),
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    minHeight: 70,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: colors.neutral.gray[600],
    fontWeight: '500',
  },
  labelActive: {
    color: colors.primary.green,
    fontWeight: '600',
  },
});

