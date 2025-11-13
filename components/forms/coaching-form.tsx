import { Button, Card, Input } from '@/components/ui';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { useKeyboardDismiss } from '@/hooks/use-keyboard-dismiss';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Dimensions, FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
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
  const dismissKeyboard = useKeyboardDismiss();
  const insets = useSafeAreaInsets();

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

  // Calculate bottom padding for nav bar clearance
  const bottomPadding = 70 + layout.spacing.lg + Math.max(insets.bottom, 12);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        keyboardShouldPersistTaps="handled"
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
              <FlatList
                data={[]}
                renderItem={() => null}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.spotlightScrollContent}
                snapToInterval={Dimensions.get('window').width * 0.85 + layout.spacing.md}
                decelerationRate="fast"
                snapToAlignment="center"
              />
            </View>
          </View>

          {/* Booking Section */}
          <View style={styles.bookingSection}>
            <Text style={styles.bookingTitle}>Book Your Session</Text>

            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <View>
                {/* Name and Phone (Side by Side) */}
                <View style={styles.namePhoneRow}>
                  <View style={styles.nameInput}>
                    <Input
                      label=""
                      value={formData.fullName}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                      error={errors.fullName}
                      required
                      placeholder="Full Name *"
                      style={styles.inputField}
                    />
                  </View>
                  <View style={styles.phoneInput}>
                    <Input
                      label=""
                      value={formData.phone}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                      error={errors.phone}
                      required
                      placeholder="Phone Numb..."
                      keyboardType="phone-pad"
                      style={styles.inputField}
                    />
                  </View>
                </View>

                {/* Email */}
                <Input
                  label=""
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  error={errors.email}
                  required
                  placeholder="Email Address *"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.inputField}
                />

                {/* Goals Text Area */}
                <Input
                  label=""
                  value={formData.goals}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, goals: text }))}
                  multiline
                  numberOfLines={4}
                  placeholder="What are your goals for this session?"
                  style={[styles.inputField, styles.goalsInput]}
                />

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
  bookingTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h2, // 22px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.h2 * typography.lineHeight.heading, // 22 * 1.3 = 28.6
    marginBottom: layout.spacing.lg, // 24px spacing before inputs
  },
  namePhoneRow: {
    flexDirection: 'row',
    marginBottom: layout.spacing.md, // 16px spacing
    marginHorizontal: -layout.spacing.xs, // Negative margin for side-by-side inputs
  },
  nameInput: {
    flex: 1,
    marginHorizontal: layout.spacing.xs, // 4px spacing between inputs
  },
  phoneInput: {
    flex: 1,
    marginHorizontal: layout.spacing.xs, // 4px spacing between inputs
  },
  inputField: {
    marginBottom: layout.spacing.md, // 16px spacing between inputs
  },
  goalsInput: {
    minHeight: 100,
    marginBottom: layout.spacing.lg, // 24px spacing before button
  },
  bookSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.green,
    height: layout.buttonHeight.lg, // 52px height
    paddingHorizontal: layout.spacing.xl, // 32px horizontal padding
    borderRadius: layout.borderRadius.pill, // Full pill shape
    ...layout.shadows.md, // Medium shadow
    marginTop: layout.spacing.md, // 16px spacing above button
  },
  buttonIcon: {
    marginRight: layout.spacing.sm, // 8px spacing between icon and text
  },
  bookSessionButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.white,
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
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
    marginBottom: layout.spacing.lg, // 24px spacing before cards
  },
  spotlightContainer: {
    position: 'relative',
  },
  spotlightScrollContent: {
    paddingHorizontal: layout.spacing.md, // 16px horizontal padding
  },
});
