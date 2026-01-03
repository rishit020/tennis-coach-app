import { Card, Input } from '@/components/ui';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { useKeyboardDismiss } from '@/hooks/use-keyboard-dismiss';
import { sendContactAdminEmail } from '@/utils/email';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Alert, Animated, Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ContactFormData {
  firstName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
}

interface SubmitButtonProps {
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
  reduceMotion: boolean;
}

function SubmitButton({ onPress, disabled, loading, reduceMotion }: SubmitButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const shadowOpacity = React.useRef(new Animated.Value(0.25)).current; // Start with 0.25 for green shadow

  const handlePressIn = () => {
    if (reduceMotion || disabled || loading) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.35, // Slightly brighter on press
        duration: 140,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (reduceMotion || disabled || loading) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0.25, // Back to default green shadow
        duration: 140,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.submitButton,
          {
            shadowOpacity: reduceMotion ? 0.25 : shadowOpacity,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
        >
          <View style={styles.submitButtonContent}>
            {loading ? (
              <Text style={styles.submitButtonText}>Sending...</Text>
            ) : (
              <>
                <Ionicons name="send" size={layout.iconSize.sm} color={colors.neutral.white} style={styles.buttonIcon} />
                <Text style={styles.submitButtonText}>Send Message</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const SUBJECT_CATEGORIES = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'booking', label: 'Book a Session' },
  { value: 'video', label: 'Video Analysis Request' },
  { value: 'pricing', label: 'Pricing Information' },
  { value: 'other', label: 'Other' },
];

interface ContactInfoItemProps {
  icon: string;
  title: string;
  info: string;
  subtext?: string;
  onPress?: () => void;
}

function ContactInfoItem({ icon, title, info, subtext, isLast, onPress }: ContactInfoItemProps & { isLast?: boolean }) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    }
  }, []);

  const handlePressIn = () => {
    if (reduceMotion || !onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePressOut = () => {
    if (reduceMotion || !onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const content = (
    <View style={[styles.contactItem, isLast && styles.contactItemLast]}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon as any} size={24} color={colors.neutral.white} />
        </View>
      </View>
      <View style={styles.contactTextContainer}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactInfo}>{info}</Text>
        {subtext && <Text style={styles.contactSubtext}>{subtext}</Text>}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          {content}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return content;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    }
  }, []);

  React.useEffect(() => {
    if (reduceMotion) return;
    Animated.spring(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      useNativeDriver: true,
      tension: 200,
      friction: 20,
    }).start();
  }, [isOpen, reduceMotion]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestionText}>{question}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-forward" size={20} color={colors.primary.green} />
        </Animated.View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const dismissKeyboard = useKeyboardDismiss();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    }
  }, []);

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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Prepare email data
      const emailData = {
        first_name: formData.firstName,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
      };

      // Send admin notification email
      try {
        await sendContactAdminEmail(emailData);
      } catch (emailError) {
        console.error('Email error:', emailError);
        Alert.alert(
          'Error',
          'Failed to send your message. Please try again or contact us directly.',
          [{ text: 'OK' }]
        );
        setIsSubmitting(false);
        return;
      }
      
      Alert.alert(
        'Message Sent!',
        'Thank you for your message. We\'ll get back to you soon.',
        [{ text: 'OK' }]
      );
      
      // Reset form
      setFormData({ firstName: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
      
      onSubmit?.(formData);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:9193378859');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:rishit020@gmail.com');
  };

  const handleLocationPress = () => {
    const address = '3870 Cary Glen Blvd, Cary, NC 27519';
    const encodedAddress = encodeURIComponent(address);
    const url = Platform.select({
      ios: `maps:0?q=${encodedAddress}`,
      android: `geo:0?q=${encodedAddress}`,
      default: `https://maps.google.com/?q=${encodedAddress}`,
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  // Calculate bottom padding for nav bar clearance and keyboard
  const baseBottomPadding = 70 + layout.spacing.lg + Math.max(insets.bottom, 12);
  const bottomPadding = keyboardHeight > 0 
    ? baseBottomPadding + keyboardHeight + layout.spacing.xl 
    : baseBottomPadding;

  const screenWidth = Dimensions.get('window').width;
  const maxCardWidth = 768; // Max width for desktop (max-w-2xl)

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
          <View style={[styles.headerSection, { maxWidth: maxCardWidth }]}>
            <Text style={styles.headerTitle}>Contact Us</Text>
            <Text style={styles.headerSubtitle}>
              Have questions about our coaching services? We'd love to hear from you.
            </Text>
          </View>

          {/* Get In Touch Section */}
          <View style={[styles.sectionWrapper, { maxWidth: maxCardWidth }]}>
            <Text style={styles.sectionTitle}>Get In Touch</Text>
            <View style={styles.contactCard}>
              {Platform.OS === 'web' ? (
                <View style={[StyleSheet.absoluteFill, styles.webBlurContainer]}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              ) : (
                <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                </BlurView>
              )}
              <View style={styles.contactCardContent}>
                <ContactInfoItem
                  icon="call"
                  title="Phone"
                  info="919-337-8859"
                  subtext="Available 24/7"
                  onPress={handlePhonePress}
                />
                <ContactInfoItem
                  icon="mail"
                  title="Email"
                  info="rishit020@gmail.com"
                  subtext="We'll respond within 24 hours"
                  onPress={handleEmailPress}
                />
                <ContactInfoItem
                  icon="location"
                  title="Location"
                  info="3870 Cary Glen Blvd, Cary, NC 27519"
                  isLast={true}
                  onPress={handleLocationPress}
                />
              </View>
            </View>
          </View>

          {/* Business Hours Section */}
          <View style={[styles.sectionWrapper, { maxWidth: maxCardWidth }]}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            <Card style={styles.businessHoursCard} padding="lg" shadow="md">
              <View style={styles.businessHoursIconContainer}>
                <View style={styles.businessHoursIcon}>
                  <Ionicons name="time" size={28} color={colors.neutral.white} />
                </View>
              </View>
              <Text style={styles.businessHoursTitle}>We're Here for You</Text>
              <View style={styles.businessHoursList}>
                <View style={styles.businessHoursItem}>
                  <View style={styles.hours24Container}>
                    <Text style={styles.hours24Text}>24/7</Text>
                  </View>
                  <Text style={styles.businessHoursTime}>Available Anytime</Text>
                </View>
                <View style={styles.businessHoursItem}>
                  <Text style={styles.businessHoursNote}>
                    Available for coaching sessions, consultations, and inquiries around the clock
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* What Happens Next Section */}
          <View style={[styles.sectionWrapper, { maxWidth: maxCardWidth }]}>
            <Text style={styles.sectionTitle}>What Happens Next</Text>
            <Card style={styles.processCard} padding="lg" shadow="md">
              <View style={styles.processSteps}>
                <View style={styles.processStep}>
                  <View style={styles.processStepNumber}>
                    <Text style={styles.processStepNumberText}>1</Text>
                  </View>
                  <View style={styles.processStepContent}>
                    <Text style={styles.processStepTitle}>Submit Your Message</Text>
                    <Text style={styles.processStepDescription}>
                      Fill out the form below with your inquiry or request
                    </Text>
                  </View>
                </View>
                <View style={styles.processStep}>
                  <View style={styles.processStepNumber}>
                    <Text style={styles.processStepNumberText}>2</Text>
                  </View>
                  <View style={styles.processStepContent}>
                    <Text style={styles.processStepTitle}>We'll Review & Respond</Text>
                    <Text style={styles.processStepDescription}>
                      Our team will review your message and respond within 24 hours
                    </Text>
                  </View>
                </View>
                <View style={styles.processStep}>
                  <View style={styles.processStepNumber}>
                    <Text style={styles.processStepNumberText}>3</Text>
                  </View>
                  <View style={styles.processStepContent}>
                    <Text style={styles.processStepTitle}>Schedule Your Session</Text>
                    <Text style={styles.processStepDescription}>
                      We'll work with you to schedule a coaching session or consultation
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>

          {/* Send Us a Message Section */}
          <View style={[styles.sectionWrapper, { maxWidth: maxCardWidth }]}>
            <Text style={styles.sectionTitle}>Send Us a Message</Text>
            <View style={styles.formCardWrapper}>
              <Card style={styles.formCard} padding={null} shadow={null}>
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                  <View style={styles.formContainer}>
                    {/* First Name and Email Row */}
                    <View style={styles.nameEmailRow}>
                      <View style={styles.firstNameInput}>
                        <Input
                          label=""
                          value={formData.firstName}
                          onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                          error={errors.firstName}
                          required
                          placeholder="First Name *"
                        />
                      </View>
                      <View style={styles.emailInput}>
                        <Input
                          label=""
                          value={formData.email}
                          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                          error={errors.email}
                          required
                          placeholder="Email *"
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    {/* Phone Number (Optional) */}
                    <Input
                      label=""
                      value={formData.phone}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                      error={errors.phone}
                      placeholder="Phone Number"
                      keyboardType="phone-pad"
                    />

                    {/* Subject Category Dropdown */}
                    <View style={styles.subjectContainer}>
                      <Text style={styles.subjectLabel}>
                        Subject Category <Text style={styles.required}>*</Text>
                      </Text>
                      <View style={styles.subjectOptions}>
                        {SUBJECT_CATEGORIES.map((category) => (
                          <TouchableOpacity
                            key={category.value}
                            style={[
                              styles.subjectOption,
                              formData.subject === category.value && styles.subjectOptionSelected,
                            ]}
                            onPress={() => {
                              setFormData(prev => ({ ...prev, subject: category.value }));
                              setErrors(prev => ({ ...prev, subject: undefined }));
                            }}
                          >
                            <Text
                              style={[
                                styles.subjectOptionText,
                                formData.subject === category.value && styles.subjectOptionTextSelected,
                              ]}
                            >
                              {category.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      {errors.subject && (
                        <Text style={styles.errorText}>{errors.subject}</Text>
                      )}
                    </View>

                    {/* Message Textarea */}
                    <Input
                      label=""
                      value={formData.message}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
                      error={errors.message}
                      required
                      multiline
                      numberOfLines={6}
                      placeholder="Message *"
                      style={styles.messageInput}
                    />

                    <SubmitButton
                      onPress={handleSubmit}
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      reduceMotion={reduceMotion}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Card>
            </View>
          </View>

          {/* FAQ Section */}
          <View style={[styles.sectionWrapper, { maxWidth: maxCardWidth }]}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <Card style={styles.faqCard} padding="lg" shadow="md">
              <FAQItem
                question="How quickly will I receive a response?"
                answer="We typically respond to all inquiries within 24 hours. We're available 24/7, so feel free to reach out anytime. For urgent matters, please call us directly at 919-337-8859."
              />
              <FAQItem
                question="What types of coaching sessions do you offer?"
                answer="We offer private one-on-one coaching sessions, video analysis, strategy and game planning, and mental game preparation. All skill levels are welcome, from beginners to advanced players."
              />
              <FAQItem
                question="How do I book a coaching session?"
                answer="You can book a session by filling out the contact form above and selecting 'Book a Session' as your subject category, or by calling us directly at 919-337-8859. We'll work with you to find a time that fits your schedule."
              />
              <FAQItem
                question="What should I bring to my first session?"
                answer="For your first session, please bring your tennis racket, appropriate athletic wear, water, and any questions you have about your game. We'll assess your current skill level and create a personalized coaching plan."
              />
              <FAQItem
                question="Do you offer video analysis services?"
                answer="Yes! We offer professional video analysis where you can upload videos of your technique, and our nationally ranked coaches will provide detailed feedback and improvement recommendations."
              />
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
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingTop: layout.spacing['3xl'], // 64px - consistent with other screens
    paddingHorizontal: layout.spacing.lg + layout.spacing.xs, // 24px - premium horizontal margin
    alignItems: 'center', // Center on larger screens
  },
  // Header Section
  headerSection: {
    marginBottom: layout.spacing['2xl'], // 48px spacing before sections
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h1, // 32px - bold, clean typography
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.h1 * typography.lineHeight.heading, // 32 * 1.3 = 41.6
    marginBottom: layout.spacing.md, // 16px spacing between title and subtitle
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.gray[500], // Subtle gray (#6B7280 equivalent)
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
    textAlign: 'center',
    paddingHorizontal: layout.spacing.md,
  },
  // Section Wrapper
  sectionWrapper: {
    width: '100%',
    marginBottom: layout.spacing['2xl'] + layout.spacing.md, // 48-60px spacing between sections
    alignSelf: 'center',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['2xl'], // 24px - text-xl to 2xl
    fontWeight: typography.fontWeight.semibold, // 600 - medium weight
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.heading, // 24 * 1.3 = 31.2
    marginBottom: layout.spacing.lg, // 24px spacing above card
    textAlign: 'center', // Center the section titles
  },
  // Contact Info Card
  contactCard: {
    backgroundColor: 'transparent',
    borderRadius: layout.borderRadius['2xl'], // Rounded-2xl (24px)
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    // Apple-style large soft shadow (0 10px 40px rgba(0,0,0,0.06))
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 10,
  },
  webBlurContainer: Platform.select({
    web: {
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    } as any,
    default: {},
  }),
  contactCardContent: {
    position: 'relative',
    zIndex: 1,
    paddingTop: layout.spacing.lg + layout.spacing.sm, // 28px top padding
    paddingBottom: layout.spacing.lg + layout.spacing.sm, // 28px bottom padding
    paddingHorizontal: layout.spacing.lg + layout.spacing.sm, // 28px side padding
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: layout.spacing.lg + layout.spacing.xs, // 20-24px spacing between items
  },
  contactItemLast: {
    marginBottom: 0, // No margin on last item
  },
  iconContainer: {
    marginRight: layout.spacing.md, // 16px spacing between icon and text
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28, // Perfect circle
    backgroundColor: colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
    // Slight shadow behind green circle for depth
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  contactTextContainer: {
    flex: 1,
    paddingTop: layout.spacing.xs, // Slight top padding for alignment
  },
  contactTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg, // 18px - bold title
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.lg * typography.lineHeight.heading, // 18 * 1.3 = 23.4
    marginBottom: layout.spacing.xs, // 4px spacing
  },
  contactInfo: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body, // 16px - medium info text
    fontWeight: typography.fontWeight.medium, // 500
    color: colors.neutral.darkText,
    lineHeight: typography.fontSize.body * typography.lineHeight.body, // 16 * 1.5 = 24
    marginBottom: layout.spacing.xs / 2, // 2px spacing
  },
  contactSubtext: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small, // 14px - subtle gray subtext
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.gray[500], // Subtle gray
    lineHeight: typography.fontSize.small * typography.lineHeight.body, // 14 * 1.5 = 21
  },
  // Form Card
  formCardWrapper: {
    width: '100%',
  },
  formCard: {
    backgroundColor: '#F8FAFC', // Very light subtle gray background - matching coaching screen
    borderRadius: layout.borderRadius.xl, // Rounded-xl (16px) - matching coaching screen
    paddingTop: layout.spacing.xl, // 32px top padding - matching coaching screen
    paddingBottom: layout.spacing.xl, // 32px bottom padding - matching coaching screen
    paddingHorizontal: layout.spacing.lg, // 24px side padding - matching coaching screen
    // Premium soft shadow - matching coaching screen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  formContainer: {
    width: '100%',
  },
  nameEmailRow: {
    flexDirection: 'row',
    marginHorizontal: -layout.spacing.xs, // Negative margin for side-by-side inputs
    marginBottom: layout.spacing.md, // 16px spacing between rows
  },
  firstNameInput: {
    flex: 1,
    marginHorizontal: layout.spacing.xs, // 4px spacing between inputs
  },
  emailInput: {
    flex: 1,
    marginHorizontal: layout.spacing.xs, // 4px spacing between inputs
  },
  messageInput: {
    minHeight: 150, // 150-180px height for textarea
    maxHeight: 180,
  },
  submitButton: {
    backgroundColor: colors.primary.green,
    width: '100%', // Full-width
    borderRadius: layout.borderRadius.full, // Rounded-full (pill shape)
    marginTop: layout.spacing.md, // 16px spacing from last input
    minHeight: layout.buttonHeight.lg + 8, // Tall height (py-4 equivalent)
    // Lifted 3D shadow (0 6px 20px rgba(0,128,0,0.25))
    shadowColor: '#008000', // Green shadow color
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 20,
    elevation: 10,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.spacing.md + 4, // py-4 equivalent (~20px)
    paddingHorizontal: layout.spacing.xl, // 32px horizontal padding
  },
  buttonIcon: {
    marginRight: layout.spacing.sm, // 8px spacing between icon and text
  },
  submitButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg, // 18px - increased for hierarchy
    fontWeight: typography.fontWeight.semibold, // 600 - semibold
    color: colors.neutral.white,
    lineHeight: typography.fontSize.lg * typography.lineHeight.body, // 18 * 1.5 = 27
  },
  // Subject Category Dropdown
  subjectContainer: {
    marginBottom: layout.spacing.md,
  },
  subjectLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.small, // 14px
    fontWeight: typography.fontWeight.medium, // 500
    color: colors.neutral.darkText,
    marginBottom: layout.spacing.sm, // 8px
  },
  required: {
    color: colors.semantic.error,
  },
  subjectOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -layout.spacing.xs, // Negative margin for spacing
  },
  subjectOption: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray[300],
    borderRadius: layout.borderRadius.md, // 8px
    paddingVertical: layout.spacing.sm + 2, // 10px
    paddingHorizontal: layout.spacing.md, // 16px
    margin: layout.spacing.xs, // 4px
    minWidth: '45%',
    flex: 1,
  },
  subjectOptionSelected: {
    backgroundColor: colors.primary.green,
    borderColor: colors.primary.green,
  },
  subjectOptionText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.small, // 14px
    fontWeight: typography.fontWeight.medium, // 500
    color: colors.neutral.darkText,
    textAlign: 'center',
  },
  subjectOptionTextSelected: {
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semibold, // 600
  },
  errorText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small, // 14px
    color: colors.semantic.error,
    marginTop: layout.spacing.xs, // 4px
    marginLeft: layout.spacing.xs, // 4px
  },
  // Business Hours Card
  businessHoursCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: layout.borderRadius.xl, // 16px
    alignItems: 'center',
  },
  businessHoursIconContainer: {
    marginBottom: layout.spacing.md, // 16px
    alignItems: 'center',
    alignSelf: 'center',
  },
  businessHoursIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  businessHoursTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl, // 20px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    marginBottom: layout.spacing.lg, // 24px
    textAlign: 'center',
  },
  businessHoursList: {
    width: '100%',
  },
  businessHoursItem: {
    marginBottom: layout.spacing.md, // 16px
    alignItems: 'center',
  },
  hours24Container: {
    marginBottom: layout.spacing.sm, // 8px
  },
  hours24Text: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize['2xl'] + 4, // 28px - prominent display
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.primary.green,
    letterSpacing: 1, // Slight letter spacing for modern look
  },
  businessHoursTime: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.medium, // 500
    color: colors.neutral.gray[700],
  },
  businessHoursNote: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small, // 14px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.gray[700],
    lineHeight: typography.fontSize.small * typography.lineHeight.body, // 14 * 1.5 = 21
    textAlign: 'center',
    marginTop: layout.spacing.sm, // 8px
  },
  // Process Card
  processCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: layout.borderRadius.xl, // 16px
  },
  processSteps: {
    width: '100%',
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: layout.spacing.xl, // 32px
  },
  processStepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layout.spacing.md, // 16px
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  processStepNumberText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg, // 18px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.white,
  },
  processStepContent: {
    flex: 1,
    paddingTop: layout.spacing.xs, // 4px
  },
  processStepTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.bold, // 700
    color: colors.neutral.darkText,
    marginBottom: layout.spacing.xs, // 4px
  },
  processStepDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small, // 14px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.gray[700],
    lineHeight: typography.fontSize.small * typography.lineHeight.body, // 14 * 1.5 = 21
  },
  // FAQ Card
  faqCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: layout.borderRadius.xl, // 16px
  },
  faqItem: {
    marginBottom: layout.spacing.md, // 16px
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray[300],
    paddingBottom: layout.spacing.md, // 16px
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: layout.spacing.xs, // 4px
  },
  faqQuestionText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.body, // 16px
    fontWeight: typography.fontWeight.semibold, // 600
    color: colors.neutral.darkText,
    flex: 1,
    marginRight: layout.spacing.sm, // 8px
  },
  faqAnswer: {
    marginTop: layout.spacing.sm, // 8px
    paddingTop: layout.spacing.sm, // 8px
  },
  faqAnswerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.small, // 14px
    fontWeight: typography.fontWeight.normal, // 400
    color: colors.neutral.gray[700],
    lineHeight: typography.fontSize.small * typography.lineHeight.body, // 14 * 1.5 = 21
  },
});
