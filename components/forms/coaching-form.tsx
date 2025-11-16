import { Button, Card, Input } from '@/components/ui';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { useKeyboardDismiss } from '@/hooks/use-keyboard-dismiss';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Alert, Animated, Dimensions, FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CoachingFormData {
  fullName: string;
  phone: string;
  email: string;
  sessionType: string;
  goals: string;
}

interface CoachingFormProps {
  onSubmit?: (data: CoachingFormData) => void;
}

const FEATURES = [
  'Personalized technique analysis',
  'Strategy and game planning',
  'Video analysis included',
  'Flexible scheduling',
  'All skill levels welcome',
];

const COACHES = [
  {
    id: '1',
    name: 'Rishit Sharma',
    info: '15yo USTA Top 50 • UTR 10.2',
  },
  {
    id: '2',
    name: 'Mihir Mohan',
    info: '16yo USTA Top 100 • UTR 9.8',
  },
];

interface ArrowButtonProps {
  onPress: () => void;
  direction: 'left' | 'right';
  opacity: Animated.Value;
  reduceMotion: boolean;
  accessibilityLabel: string;
}

function ArrowButton({ onPress, direction, opacity, reduceMotion, accessibilityLabel }: ArrowButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    if (reduceMotion) return;
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    if (reduceMotion) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handleMouseEnter = () => {
    if (Platform.OS === 'web') {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (Platform.OS === 'web') {
      setIsHovered(false);
    }
  };

  const iconName = direction === 'left' ? 'chevron-back' : 'chevron-forward';
  const arrowStyle = direction === 'left' ? styles.arrowLeft : styles.arrowRight;

  const borderColor = isHovered 
    ? 'rgba(255, 255, 255, 0.5)' // Brighter border on hover
    : isPressed 
    ? 'rgba(255, 255, 255, 0.45)' // Medium border when pressed
    : 'rgba(255, 255, 255, 0.4)'; // Default subtle border

  return (
    <Animated.View
      style={[
        styles.arrowButton,
        arrowStyle,
        { opacity },
        { transform: [{ scale: scaleAnim }] },
        { borderColor },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={StyleSheet.absoluteFill}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityHint={`Navigate to the ${direction === 'left' ? 'previous' : 'next'} coach profile`}
        // @ts-ignore - web-only props
        onMouseEnter={handleMouseEnter}
        // @ts-ignore - web-only props
        onMouseLeave={handleMouseLeave}
      >
         {Platform.OS === 'web' ? (
           <View style={[StyleSheet.absoluteFill, styles.arrowBlurContainer]}>
             <View style={[
               styles.arrowOverlay,
               isHovered && styles.arrowOverlayHovered,
               isPressed && styles.arrowOverlayPressed
             ]} />
             {/* Subtle gradient overlay for glass effect */}
             <LinearGradient
               colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
               start={{ x: 0, y: 0 }}
               end={{ x: 0, y: 1 }}
               style={StyleSheet.absoluteFill}
             />
           </View>
         ) : (
           <BlurView intensity={16} tint="light" style={StyleSheet.absoluteFill}>
             <View style={[
               styles.arrowOverlay,
               isHovered && styles.arrowOverlayHovered,
               isPressed && styles.arrowOverlayPressed
             ]} />
             {/* Subtle gradient overlay for glass effect */}
             <LinearGradient
               colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
               start={{ x: 0, y: 0 }}
               end={{ x: 0, y: 1 }}
               style={StyleSheet.absoluteFill}
             />
           </BlurView>
         )}
        <View style={styles.arrowIconContainer}>
          <Ionicons name={iconName} size={24} color="rgba(26, 26, 26, 0.8)" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface CoachCardProps {
  cardWidth: number;
  item: typeof COACHES[0];
  reduceMotion: boolean;
  isActive: boolean;
  scrollX: Animated.Value;
  index: number;
}

function CoachCard({ cardWidth, item, reduceMotion, isActive, scrollX, index }: CoachCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const shadowOpacity = React.useRef(new Animated.Value(0.12)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;
  
  // Subtle parallax effect based on scroll position
  const inputRange = [(index - 1) * cardWidth, index * cardWidth, (index + 1) * cardWidth];
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-8, 0, 8], // Very subtle horizontal parallax
    extrapolate: 'clamp',
  });
  
  // Subtle scale interpolation for smoother transitions
  const scaleInterpolate = scrollX.interpolate({
    inputRange,
    outputRange: [0.98, 1.02, 0.98], // Scale up when centered
    extrapolate: 'clamp',
  });
  
  // Use interpolated scale for smoother scroll-based animation
  const animatedScale = reduceMotion ? scaleAnim : scaleInterpolate;
  
  // Animate scale based on active state (fallback for when scrollX isn't available)
  React.useEffect(() => {
    if (reduceMotion) return;
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.02 : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  }, [isActive, reduceMotion, scaleAnim]);
  
  // Animate opacity for inactive cards
  React.useEffect(() => {
    if (reduceMotion) return;
    Animated.timing(opacityAnim, {
      toValue: isActive ? 1 : 0.85,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isActive, reduceMotion, opacityAnim]);

  const handlePressIn = () => {
    if (reduceMotion) return;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.03,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.15,
        duration: 140,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (reduceMotion) return;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.12,
        duration: 140,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      accessibilityLabel={`Coach profile: ${item.name}, ${item.info}`}
      accessibilityRole="button"
      accessibilityHint="View coach profile details"
    >
      <Animated.View
        style={[
          {
            transform: [
              { scale: animatedScale },
              { translateX: reduceMotion ? 0 : translateX },
            ],
            opacity: reduceMotion ? 1 : opacityAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.coachCardWrapper,
            { width: cardWidth },
            {
              shadowOpacity: reduceMotion ? 0.12 : shadowOpacity,
            },
          ]}
        >
          <View style={styles.coachCardInner}>
            <View style={styles.coachCardContent}>
              <View style={styles.coachPhotoPlaceholder} accessibilityLabel={`${item.name} profile photo`}>
                <View style={styles.avatarInnerHighlight} />
                <Ionicons name="person-circle-outline" size={64} color={colors.neutral.gray[300]} />
              </View>
              <View style={styles.divider} />
              <Text style={styles.coachName}>{item.name}</Text>
              <Text style={styles.coachInfo}>{item.info}</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function CoachingForm({ onSubmit }: CoachingFormProps) {
  const [formData, setFormData] = useState<CoachingFormData>({
    fullName: '',
    phone: '',
    email: '',
    sessionType: '',
    goals: '',
  });
  const [errors, setErrors] = useState<Partial<CoachingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<Animated.FlatList<any>>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const fullNameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const goalsInputRef = useRef<TextInput>(null);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});
  const inputLayouts = useRef<{ [key: string]: { y: number; height: number } }>({});
  const leftArrowOpacity = useRef(new Animated.Value(1)).current; // Always visible with looping
  const rightArrowOpacity = useRef(new Animated.Value(1)).current; // Always visible with looping
  const scrollX = useRef(new Animated.Value(0)).current; // Track scroll position for animations
  const dismissKeyboard = useKeyboardDismiss();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    }
  }, []);

  // Handle keyboard show/hide
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // Scroll to input when focused
  const handleInputFocus = (inputName: string, event: any) => {
    setTimeout(() => {
      const layout = inputLayouts.current[inputName];
      if (layout && scrollViewRef.current) {
        const screenHeight = Dimensions.get('window').height;
        const inputBottom = layout.y + layout.height;
        const keyboardTop = screenHeight - keyboardHeight;
        const offset = 20; // Extra spacing above input
        
        // If input would be hidden by keyboard, scroll to show it
        if (inputBottom > keyboardTop - offset) {
          const scrollOffset = layout.y - (screenHeight - keyboardHeight - layout.height - offset);
          scrollViewRef.current.scrollTo({
            y: Math.max(0, scrollOffset),
            animated: true,
          });
        }
      }
    }, Platform.OS === 'ios' ? 250 : 100);
  };

  useEffect(() => {
    if (reduceMotion) return;
    // Always show arrows with looping scroll
    Animated.timing(leftArrowOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, leftArrowOpacity]);

  useEffect(() => {
    if (reduceMotion) return;
    // Always show arrows with looping scroll
    Animated.timing(rightArrowOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, rightArrowOpacity]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CoachingFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Session Booked!',
        'Your coaching session has been booked successfully. We\'ll contact you soon to confirm the details.',
        [{ text: 'OK' }]
      );
      
      // Reset form
      setFormData({ fullName: '', phone: '', email: '', sessionType: '', goals: '' });
      setErrors({});
      
      onSubmit?.(formData);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate bottom padding for nav bar clearance and keyboard
  const baseBottomPadding = 70 + layout.spacing.lg + Math.max(insets.bottom, 12);
  const bottomPadding = keyboardHeight > 0 
    ? baseBottomPadding + keyboardHeight + layout.spacing.xl 
    : baseBottomPadding;

  const screenWidth = Dimensions.get('window').width;
  const horizontalPadding = layout.spacing.lg + layout.spacing.xs; // Match content padding
  const availableWidth = screenWidth - (horizontalPadding * 2);
  const cardWidth = availableWidth; // Full width to show only one card at a time
  const cardSpacing = 0; // No spacing when showing one card
  const snapInterval = cardWidth;


  const scrollToNext = () => {
    // RIGHT arrow: current card slides RIGHT, new card comes from LEFT
    // Always go to the other card (with only 2 cards, next is always the other one)
    const nextIndex = currentCoachIndex === 0 ? 1 : 0;
    const offset = nextIndex * snapInterval;
    flatListRef.current?.scrollToOffset({ offset, animated: true });
    setCurrentCoachIndex(nextIndex);
  };

  const scrollToPrev = () => {
    // LEFT arrow: current card slides LEFT, new card comes from RIGHT
    // Always go to the other card (with only 2 cards, prev is always the other one)
    const prevIndex = currentCoachIndex === 0 ? 1 : 0;
    const offset = prevIndex * snapInterval;
    flatListRef.current?.scrollToOffset({ offset, animated: true });
    setCurrentCoachIndex(prevIndex);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      enabled={Platform.OS === 'ios'}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        onScrollBeginDrag={dismissKeyboard}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Private Tennis Coaching</Text>
            <Text style={styles.headerDescription}>
              Book a personalized coaching session with our nationally ranked USTA players. Improve your technique, strategy, and overall game.
            </Text>
          </View>

          {/* Coaching Details Card */}
          <Card style={styles.detailsCard} padding="lg" shadow="md">
            <View style={styles.detailsContent}>
              {/* Trophy Icon */}
              <View style={styles.trophyContainer}>
                <Ionicons name="trophy" size={layout.iconSize['2xl']} color={colors.primary.green} />
              </View>

              {/* Private Coaching Title */}
              <Text style={styles.coachingTitle}>Private Coaching</Text>

              {/* Price */}
              <Text style={styles.price}>$60/hour</Text>

              {/* Features List */}
              <View style={styles.featuresList}>
                {FEATURES.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={layout.iconSize.md} color={colors.primary.green} style={styles.checkmark} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>

          {/* Coach Spotlight Section */}
          <View style={styles.spotlightSection}>
            <Text style={styles.spotlightTitle}>Coach Spotlight</Text>
            <View style={styles.spotlightContainer}>
              {/* Subtle background gradient panel */}
              <LinearGradient
                colors={['rgba(245, 246, 250, 0.4)', 'rgba(245, 246, 250, 0.2)', 'rgba(245, 246, 250, 0.4)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.spotlightBackground}
              />
              {/* Left Arrow */}
              <ArrowButton
                onPress={scrollToPrev}
                direction="left"
                opacity={leftArrowOpacity}
                reduceMotion={reduceMotion}
                accessibilityLabel="Previous coach"
              />

              <Animated.FlatList
                ref={flatListRef}
                data={COACHES}
                renderItem={({ item, index }) => {
                  const screenWidth = Dimensions.get('window').width;
                  const horizontalPadding = layout.spacing.lg + layout.spacing.xs;
                  const availableWidth = screenWidth - (horizontalPadding * 2);
                  const cardWidth = availableWidth; // Full width to show only one card
                  const isActive = index === currentCoachIndex;
                  return (
                    <CoachCard
                      cardWidth={cardWidth}
                      item={item}
                      reduceMotion={reduceMotion}
                      isActive={isActive}
                      scrollX={scrollX}
                      index={index}
                    />
                  );
                }}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.spotlightScrollContent}
                snapToInterval={snapInterval}
                decelerationRate={0.88} // Smoother deceleration
                snapToAlignment="center"
                pagingEnabled={false}
                disableIntervalMomentum={false}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false } // scrollX used for interpolation
                )}
                scrollEventThrottle={16} // Smooth scroll tracking
                accessibilityLabel="Coach spotlight carousel"
                accessibilityHint="Swipe horizontally to browse coach profiles"
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
                  const clampedIndex = Math.max(0, Math.min(index, COACHES.length - 1));
                  setCurrentCoachIndex(clampedIndex);
                }}
              />

              {/* Right Arrow */}
              <ArrowButton
                onPress={scrollToNext}
                direction="right"
                opacity={rightArrowOpacity}
                reduceMotion={reduceMotion}
                accessibilityLabel="Next coach"
              />
            </View>
          </View>

          {/* Booking Section */}
          <View style={styles.bookingSection}>
            <View style={styles.bookingHeader}>
              <Text style={styles.bookingTitle}>Book Your Session</Text>
              <Text style={styles.bookingSubtitle}>Fill in your details to get started</Text>
            </View>

            <Card style={styles.bookingCard} padding="lg" shadow="md">
              <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.formContainer}>
                {/* Name and Phone (Side by Side) */}
                <View style={styles.namePhoneRow}>
                  <View style={styles.nameInput}>
                    <View
                      onLayout={(e) => {
                        const { y, height } = e.nativeEvent.layout;
                        // Get absolute position relative to ScrollView
                        e.target.measure((x, y, width, height, pageX, pageY) => {
                          inputLayouts.current.fullName = { y: pageY, height };
                        });
                      }}
                    >
                      <Input
                        ref={(ref) => {
                          inputRefs.current.fullName = ref;
                        }}
                        label=""
                        value={formData.fullName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                        error={errors.fullName}
                        required
                        placeholder="Full Name *"
                        style={styles.inputText}
                        onFocus={(e) => handleInputFocus('fullName', e)}
                      />
                    </View>
                  </View>
                  <View style={styles.phoneInput}>
                    <View
                      onLayout={(e) => {
                        e.target.measure((x, y, width, height, pageX, pageY) => {
                          inputLayouts.current.phone = { y: pageY, height };
                        });
                      }}
                    >
                      <Input
                        ref={(ref) => {
                          inputRefs.current.phone = ref;
                        }}
                        label=""
                        value={formData.phone}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                        error={errors.phone}
                        required
                        placeholder="Phone Numb..."
                        keyboardType="phone-pad"
                        style={styles.inputText}
                        onFocus={(e) => handleInputFocus('phone', e)}
                      />
                    </View>
                  </View>
                </View>

                {/* Email */}
                <View
                  onLayout={(e) => {
                    e.target.measure((x, y, width, height, pageX, pageY) => {
                      inputLayouts.current.email = { y: pageY, height };
                    });
                  }}
                >
                  <Input
                    ref={(ref) => {
                      inputRefs.current.email = ref;
                    }}
                    label=""
                    value={formData.email}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                    error={errors.email}
                    required
                    placeholder="Email Address *"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.inputText}
                    onFocus={(e) => handleInputFocus('email', e)}
                  />
                </View>

                {/* Goals Text Area */}
                <View
                  onLayout={(e) => {
                    e.target.measure((x, y, width, height, pageX, pageY) => {
                      inputLayouts.current.goals = { y: pageY, height };
                    });
                  }}
                >
                  <Input
                    ref={(ref) => {
                      inputRefs.current.goals = ref;
                    }}
                    label=""
                    value={formData.goals}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, goals: text }))}
                    multiline
                    numberOfLines={4}
                    placeholder="What are your goals for this session?"
                    style={[styles.inputText, styles.goalsInput]}
                    onFocus={(e) => handleInputFocus('goals', e)}
                  />
                </View>

                {/* Book Session Button */}
                <TouchableOpacity
                  style={styles.bookSessionButton}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark" size={layout.iconSize.sm} color={colors.neutral.white} style={styles.buttonIcon} />
                  <Text style={styles.bookSessionButtonText}>Book Session ($60/hour)</Text>
                </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Card>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingTop: layout.spacing['3xl'], // 64px - consistent with Home screen
    paddingHorizontal: layout.spacing.lg + layout.spacing.xs, // 24px - premium horizontal margin
  },
  // Header Section
  headerSection: {
    marginBottom: layout.spacing.xl, // 32px spacing
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h1, // 32px - large, bold
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.h1 * typography.lineHeight.heading, // 32 * 1.3 = 41.6
    textAlign: 'center',
    marginBottom: layout.spacing.md, // 16px spacing
  },
  headerDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
    textAlign: 'center',
    maxWidth: layout.spacing.xxl * 4, // Optimal reading width
  },
  // Coaching Details Card
  detailsCard: {
    backgroundColor: colors.neutral.background, // Light gray background
    borderRadius: layout.borderRadius.medium, // 16px rounded corners
    marginBottom: layout.spacing.xl, // 32px spacing
  },
  detailsContent: {
    alignItems: 'center',
  },
  trophyContainer: {
    marginBottom: layout.spacing.md, // 16px spacing below icon
  },
  coachingTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h2, // 22px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.h2 * typography.lineHeight.heading, // 22 * 1.3 = 28.6
    marginBottom: layout.spacing.sm, // 8px spacing
    textAlign: 'center',
  },
  price: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['3xl'], // 30px - larger, bold green
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.primary.green,
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.heading, // 30 * 1.3 = 39
    marginBottom: layout.spacing.lg, // 24px spacing before features
    textAlign: 'center',
  },
  featuresList: {
    width: '100%',
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.md, // 16px spacing between features
    width: '100%',
  },
  checkmark: {
    marginRight: layout.spacing.sm, // 8px spacing between icon and text
  },
  featureText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
    flex: 1,
  },
  // Booking Section
  bookingSection: {
    marginTop: layout.spacing.xl, // 32px spacing from details card
  },
  bookingHeader: {
    marginBottom: layout.spacing.xl, // 32px spacing before form fields for better breathing room
  },
  bookingTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['4xl'], // 36px - increased for stronger hierarchy
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize['4xl'] * typography.lineHeight.heading, // 36 * 1.3 = 46.8
    marginBottom: layout.spacing.sm, // 8px spacing between title and subtitle
  },
  bookingSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.mutedGray, // Subtle gray color matching app's tone
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
  },
  bookingCard: {
    backgroundColor: colors.neutral.background, // Light gray background - matching Private Coaching card
    borderRadius: layout.borderRadius.medium, // 16px rounded corners - matching Private Coaching card
  },
  formContainer: {
    width: '100%',
  },
  namePhoneRow: {
    flexDirection: 'row',
    marginHorizontal: -layout.spacing.xs, // Negative margin for side-by-side inputs
    // marginBottom handled by Input components - standardized spacing
  },
  nameInput: {
    flex: 1,
    marginHorizontal: layout.spacing.xs, // 4px spacing between inputs - symmetrical
  },
  phoneInput: {
    flex: 1,
    marginHorizontal: layout.spacing.xs, // 4px spacing between inputs - symmetrical
  },
  inputText: {
    fontSize: typography.fontSize.small, // 14px - slightly reduced for placeholder readability
  },
  goalsInput: {
    minHeight: 100,
    // marginBottom handled by Input component - standardized spacing
  },
  bookSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.green,
    width: '100%', // Match input field width
    height: layout.buttonHeight.lg, // 52px height
    paddingHorizontal: layout.spacing.xl, // 32px horizontal padding
    borderRadius: layout.borderRadius.pill, // Full pill shape
    ...layout.shadows.md, // Medium shadow
    // marginTop removed - spacing handled by last Input component's marginBottom
  },
  buttonIcon: {
    marginRight: layout.spacing.sm, // 8px spacing between icon and text
  },
  bookSessionButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg, // 18px - increased for premium feel
    fontWeight: typography.fontWeight.bold, // 700 - bold for strong CTA presence
    color: colors.neutral.white,
    lineHeight: typography.fontSize.lg * typography.lineHeight.body, // 18 * 1.5 = 27
  },
  errorText: {
    fontSize: typography.fontSize.small,
    color: colors.semantic.error,
    marginTop: layout.spacing.xs,
  },
  // Coach Spotlight Section
  spotlightSection: {
    marginTop: layout.spacing.xl, // 32px spacing from details card
    marginBottom: layout.spacing.xl, // 32px spacing before booking section
  },
  spotlightTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h2, // 22px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.h2 * typography.lineHeight.heading, // 22 * 1.3 = 28.6
    marginBottom: layout.spacing.xl, // 32px spacing before cards for better balance
  },
  spotlightContainer: {
    position: 'relative',
    borderRadius: layout.borderRadius.lg, // 12px rounded corners
    overflow: 'hidden',
    paddingTop: layout.spacing.lg, // 24px spacing above card
    paddingBottom: layout.spacing.lg, // 24px spacing below card
    marginTop: layout.spacing.md, // 16px additional spacing from title
  },
  spotlightBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: layout.borderRadius.lg, // Match container border radius
  },
  spotlightScrollContent: {
    paddingHorizontal: 0, // No padding - cards are full width and centered
    paddingTop: 0, // No top padding - handled by container
  },
  coachCardWrapper: {
    marginRight: 0, // No margin - showing one card at a time
    // Shadow applied to wrapper so it appears behind the card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5, // Medium shadow - exactly matching Private Coaching card (shadowOpacity is animated)
  },
  coachCardInner: {
    backgroundColor: colors.neutral.background, // Light gray background - matching Private Coaching card
    borderRadius: layout.borderRadius.medium, // 16px - matching Private Coaching card
    overflow: 'hidden', // Clip content to rounded corners
  },
  coachCardContent: {
    padding: layout.spacing.xl, // 32px padding - matching Card padding="lg"
    alignItems: 'center',
    position: 'relative',
  },
  coachPhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40, // Perfect circle
    backgroundColor: colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacing.lg, // 24px spacing below photo for premium feel
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)', // Glass-style border
    position: 'relative',
    overflow: 'hidden',
  },
  avatarInnerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Soft inner highlight for depth
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)', // Very subtle divider line
    marginBottom: layout.spacing.lg, // 24px spacing below divider
    alignSelf: 'center',
  },
  coachName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['2xl'], // 24px - larger and more prominent
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.heading, // 24 * 1.3 = 31.2
    marginBottom: layout.spacing.sm, // 8px spacing between name and subtitle
    textAlign: 'center',
  },
  coachInfo: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm, // 14px - smaller than before
    fontWeight: typography.fontWeight.normal, // 400 - lighter weight
    color: colors.neutral.mutedGray,
    lineHeight: typography.fontSize.sm * typography.lineHeight.body, // 14 * 1.5 = 21
    textAlign: 'center',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -24, // Half of button height to center vertically
    width: 48,
    height: 48,
    borderRadius: 24, // Perfect circle
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)', // Subtle glass border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.15,
    elevation: 6,
  },
  arrowIconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  arrowBlurContainer: Platform.select({
    web: {
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    } as any,
    default: {},
  }),
  arrowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Glassmorphism background
  },
  arrowOverlayHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)', // Slightly darker on hover
  },
  arrowOverlayPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Darker when pressed
  },
  arrowLeft: {
    left: -12, // Positioned closer to card edge for better visual connection
  },
  arrowRight: {
    right: -12, // Positioned closer to card edge for better visual connection
  },
});
