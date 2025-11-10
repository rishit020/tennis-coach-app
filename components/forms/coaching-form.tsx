import { Button, Card, Input } from '@/components/ui';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { useKeyboardDismiss } from '@/hooks/use-keyboard-dismiss';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

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

const SESSION_TYPES = [
  { label: 'Technique Focus', value: 'technique' },
  { label: 'Strategy', value: 'strategy' },
  { label: 'Match Play', value: 'match' },
  { label: 'Fitness', value: 'fitness' },
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

    if (!formData.sessionType) {
      newErrors.sessionType = 'Please select a session type';
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

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={dismissKeyboard}
    >
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.headerTitle}>Book Your Session</Text>

        {/* Booking Form */}
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <Card style={styles.bookingCard}>
            {/* Preferred Session Type */}
            <Text style={styles.sessionTypeLabel}>Preferred Session Type</Text>
            <View style={styles.sessionTypeOptions}>
              {SESSION_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.sessionTypeOption,
                    formData.sessionType === type.value && styles.sessionTypeOptionSelected,
                  ]}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, sessionType: type.value }));
                    setErrors(prev => ({ ...prev, sessionType: undefined }));
                  }}
                >
                  <Text
                    style={[
                      styles.sessionTypeOptionText,
                      formData.sessionType === type.value && styles.sessionTypeOptionTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.sessionType && (
              <Text style={styles.errorText}>{errors.sessionType}</Text>
            )}

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
            />

            {/* Goals Text Area */}
            <Input
              label=""
              value={formData.goals}
              onChangeText={(text) => setFormData(prev => ({ ...prev, goals: text }))}
              multiline
              numberOfLines={4}
              placeholder="What are your goals for this session?"
              style={styles.goalsInput}
            />

            {/* Book Session Button */}
            <TouchableOpacity
              style={styles.bookSessionButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark" size={20} color={colors.neutral.white} style={{ marginRight: layout.spacing.sm }} />
              <Text style={styles.bookSessionButtonText}>Book Session ($60/hour)</Text>
            </TouchableOpacity>
          </Card>
        </TouchableWithoutFeedback>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: layout.spacing.xl,
  },
  headerTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    textAlign: 'center',
    marginBottom: layout.spacing.xl,
  },
  bookingCard: {
    borderRadius: layout.borderRadius.card,
    ...layout.shadows.md,
  },
  sessionTypeLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.md,
  },
  sessionTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -layout.spacing.sm / 2,
    marginBottom: layout.spacing.lg,
  },
  sessionTypeOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral.gray[300],
    backgroundColor: colors.neutral.white,
    margin: layout.spacing.sm / 2,
    marginBottom: layout.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionTypeOptionSelected: {
    backgroundColor: colors.primary.green,
    borderColor: colors.primary.green,
  },
  sessionTypeOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[900],
  },
  sessionTypeOptionTextSelected: {
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.bold,
  },
  namePhoneRow: {
    flexDirection: 'row',
    marginBottom: layout.spacing.md,
    marginHorizontal: -layout.spacing.xs,
  },
  nameInput: {
    flex: 1,
    marginHorizontal: layout.spacing.xs,
  },
  phoneInput: {
    flex: 1,
    marginHorizontal: layout.spacing.xs,
  },
  goalsInput: {
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.lg,
    minHeight: 100,
  },
  bookSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.green,
    paddingVertical: layout.spacing.md + 4,
    paddingHorizontal: layout.spacing.xl,
    borderRadius: layout.borderRadius.full,
    marginTop: layout.spacing.md,
    ...layout.shadows.sm,
  },
  bookSessionButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.semantic.error,
    marginTop: layout.spacing.xs,
  },
});
