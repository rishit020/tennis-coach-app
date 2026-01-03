import { Card, Input, VideoPreview } from '@/components/ui';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { useKeyboardDismiss } from '@/hooks/use-keyboard-dismiss';
import { isCloudinaryConfigured, uploadVideoToCloudinary } from '@/utils/cloudinary';
import { sendUploadAdminEmail, sendUploadUserEmail } from '@/utils/email';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UploadFormData {
  playerName: string;
  email: string;
  phone: string;
  age: string;
  skillLevel: string;
  goals: string;
  howDidYouHear: string;
  notes: string;
  videoUri: string | null;
  videoMetadata?: {
    fileName?: string;
    fileSize?: number;
    duration?: number;
  };
  cloudinaryUrl?: string;
}

interface UploadFormProps {
  onSubmit?: (data: UploadFormData) => void;
}

const AGE_GROUPS = [
  { label: 'Under 10', value: 'under-10' },
  { label: '10-12', value: '10-12' },
  { label: '13-15', value: '13-15' },
  { label: '16-18', value: '16-18' },
  { label: 'Adult', value: 'adult' },
];

const SKILL_LEVELS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

const HOW_DID_YOU_HEAR_OPTIONS = [
  { label: 'Social Media', value: 'social-media' },
  { label: 'Friend/Family Referral', value: 'referral' },
  { label: 'Google Search', value: 'google' },
  { label: 'Tennis Club', value: 'tennis-club' },
  { label: 'Other', value: 'other' },
];

export function UploadForm({ onSubmit }: UploadFormProps) {
  const [formData, setFormData] = useState<UploadFormData>({
    playerName: '',
    email: '',
    phone: '',
    age: '',
    skillLevel: '',
    goals: '',
    howDidYouHear: '',
    notes: '',
    videoUri: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UploadFormData, string>>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const dismissKeyboard = useKeyboardDismiss();
  const insets = useSafeAreaInsets();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UploadFormData, string>> = {};

    if (!formData.playerName.trim()) {
      newErrors.playerName = 'Player name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.age) {
      newErrors.age = 'Age or age group is required';
    }

    if (!formData.skillLevel) {
      newErrors.skillLevel = 'Skill level is required';
    }

    if (!formData.videoUri) {
      newErrors.videoUri = 'Please select or record a video';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecordVideo = async () => {
    try {
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to record videos.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch camera for video recording
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 300, // 5 minutes max
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setFormData(prev => ({
          ...prev,
          videoUri: asset.uri,
          videoMetadata: {
            fileName: asset.fileName || 'recorded-video.mp4',
            fileSize: asset.fileSize,
            duration: asset.duration,
          },
        }));
        setErrors(prev => ({ ...prev, videoUri: undefined }));
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to record video. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleChooseFromPhotos = async () => {
    try {
      // Request media library permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to select videos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 300, // 5 minutes max
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setFormData(prev => ({
          ...prev,
          videoUri: asset.uri,
          videoMetadata: {
            fileName: asset.fileName || 'selected-video.mp4',
            fileSize: asset.fileSize,
            duration: asset.duration,
          },
        }));
        setErrors(prev => ({ ...prev, videoUri: undefined }));
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to select video. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRemoveVideo = () => {
    setFormData(prev => ({
      ...prev,
      videoUri: null,
      videoMetadata: undefined,
      cloudinaryUrl: undefined,
    }));
  };


  const simulateProgress = (startProgress: number, endProgress: number, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(
          startProgress + ((endProgress - startProgress) * (elapsed / duration)),
          endProgress
        );
        const roundedProgress = Math.max(1, Math.min(100, Math.round(progress)));
        setUploadProgress(roundedProgress);
        
        if (progress >= endProgress) {
          clearInterval(progressInterval);
          setUploadProgress(100);
          resolve();
        }
      }, 50); // Update every 50ms for smooth animation
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!formData.videoUri) {
      setErrors(prev => ({ ...prev, videoUri: 'Please select or record a video' }));
      return;
    }

    try {
      setIsUploading(true);
      setShowSuccess(false);
      setUploadProgress(1); // Start at 1%

      // Upload to Cloudinary if configured, otherwise use local URI
      let cloudinaryUrl = formData.cloudinaryUrl;
      let finalProgress = 1;
      
      if (!cloudinaryUrl && isCloudinaryConfigured() && formData.videoUri) {
        try {
          const uploadResult = await uploadVideoToCloudinary(
            formData.videoUri,
            (progress) => {
              // Ensure progress starts at 1% minimum and updates smoothly
              finalProgress = Math.max(1, Math.min(99, progress.percentage));
              setUploadProgress(finalProgress);
            }
          );
          cloudinaryUrl = uploadResult.secureUrl;
          
          // Complete progress to 100%
          if (finalProgress < 100) {
            await simulateProgress(finalProgress, 100, 300);
          } else {
            setUploadProgress(100);
          }
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          Alert.alert(
            'Upload Error',
            'Failed to upload video to Cloudinary. The form will be submitted with local video reference.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Continue Anyway',
                onPress: async () => {
                  // Simulate progress to 100% before submitting
                  await simulateProgress(uploadProgress, 100, 500);
                  await submitForm(cloudinaryUrl);
                },
              },
            ]
          );
          setIsUploading(false);
          setUploadProgress(0);
          return;
        }
      } else {
        // No Cloudinary, simulate progress from 1% to 100%
        await simulateProgress(1, 100, 2000); // 2 seconds for smooth progress
      }

      // Ensure we're at 100% before showing success
      if (uploadProgress < 100) {
        setUploadProgress(100);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Show success message
      setShowSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Show success for 1.5 seconds

      await submitForm(cloudinaryUrl);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setShowSuccess(false);
      Alert.alert(
        'Error',
        'An error occurred while submitting the form. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const submitForm = async (cloudinaryUrl?: string) => {
    const finalFormData = {
      ...formData,
      cloudinaryUrl: cloudinaryUrl || formData.cloudinaryUrl,
    };

    // Prepare email data
    const emailData = {
      player_name: finalFormData.playerName,
      email: finalFormData.email,
      phone: finalFormData.phone || undefined,
      age: finalFormData.age,
      skill_level: finalFormData.skillLevel,
      goals: finalFormData.goals || undefined,
      how_did_you_hear: finalFormData.howDidYouHear || undefined,
      notes: finalFormData.notes || undefined,
      video_url: cloudinaryUrl || finalFormData.videoUri || '',
      video_file_name: finalFormData.videoMetadata?.fileName,
      video_file_size: finalFormData.videoMetadata?.fileSize 
        ? `${(finalFormData.videoMetadata.fileSize / (1024 * 1024)).toFixed(2)} MB`
        : undefined,
      video_duration: finalFormData.videoMetadata?.duration 
        ? formatDuration(finalFormData.videoMetadata.duration)
        : undefined,
    };

    // Send emails
    try {
      // Send admin notification email
      await sendUploadAdminEmail(emailData);
      
      // Send user confirmation email
      await sendUploadUserEmail(emailData);
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't block submission if email fails, but show a warning
      Alert.alert(
        'Submission Successful',
        'Your video has been submitted, but there was an issue sending the confirmation email. We\'ll still review your submission.',
        [{ text: 'OK' }]
      );
    }

    if (onSubmit) {
      onSubmit(finalFormData);
    } else {
      Alert.alert(
        'Success',
        'Your video has been submitted for review! You should receive a confirmation email shortly.',
        [{ text: 'OK' }]
      );
    }

    // Reset form after successful submission
    setFormData({
      playerName: '',
      email: '',
      phone: '',
      age: '',
      skillLevel: '',
      goals: '',
      howDidYouHear: '',
      notes: '',
      videoUri: null,
    });
    setErrors({});

    setIsUploading(false);
    setUploadProgress(0);
    setShowSuccess(false);
  };

  const bottomPadding = 120 + Math.max(insets.bottom, 12);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={dismissKeyboard}
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.content}>
            {/* Header / Hero */}
            <View style={styles.header}>
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Ionicons name="videocam" size={16} color={colors.neutral.white} />
                  <Text style={styles.badgeText}> Video Analysis</Text>
                </View>
              </View>
              <Text style={styles.title}>
                Upload <Text style={styles.titleAccent}>Your Video</Text>
              </Text>
              <Text style={styles.subtitle}>
                Share your tennis video for expert analysis from nationally ranked USTA players
              </Text>
            </View>

            {/* Form Card */}
            <Card style={[styles.formCard, styles.formCardPadding]} padding={null} shadow="md">
              <Text style={styles.sectionTitle}>Player Information</Text>

              {/* Player Name */}
              <Input
                label="Name of Player"
                value={formData.playerName}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, playerName: text }));
                  setErrors(prev => ({ ...prev, playerName: undefined }));
                }}
                error={errors.playerName}
                required
                placeholder="Enter player name"
                style={styles.input}
              />

              {/* Email */}
              <Input
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, email: text }));
                  setErrors(prev => ({ ...prev, email: undefined }));
                }}
                error={errors.email}
                required
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />

              {/* Phone Number */}
              <Input
                label="Phone Number (Optional)"
                value={formData.phone}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, phone: text }));
                }}
                placeholder="(555) 123-4567"
                keyboardType="phone-pad"
                style={styles.input}
              />

              {/* Age or Age Group */}
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>
                  Age or Age Group <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.pickerOptions}>
                  {AGE_GROUPS.map((group) => (
                    <TouchableOpacity
                      key={group.value}
                      style={[
                        styles.pickerOption,
                        formData.age === group.value && styles.pickerOptionSelected,
                      ]}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, age: group.value }));
                        setErrors(prev => ({ ...prev, age: undefined }));
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          formData.age === group.value && styles.pickerOptionTextSelected,
                        ]}
                      >
                        {group.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
              </View>

              {/* Skill Level */}
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>
                  Skill Level <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.pickerOptions}>
                  {SKILL_LEVELS.map((level) => (
                    <TouchableOpacity
                      key={level.value}
                      style={[
                        styles.pickerOption,
                        formData.skillLevel === level.value && styles.pickerOptionSelected,
                      ]}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, skillLevel: level.value }));
                        setErrors(prev => ({ ...prev, skillLevel: undefined }));
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          formData.skillLevel === level.value && styles.pickerOptionTextSelected,
                        ]}
                      >
                        {level.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.skillLevel && <Text style={styles.errorText}>{errors.skillLevel}</Text>}
              </View>

              {/* Goals/Objectives */}
              <Input
                label="Goals & Objectives (Optional)"
                value={formData.goals}
                onChangeText={(text) => setFormData(prev => ({ ...prev, goals: text }))}
                multiline
                numberOfLines={3}
                placeholder="What are your main goals for improvement? (e.g., improve serve, better footwork, etc.)"
                style={styles.input}
              />

              {/* How Did You Hear About Us */}
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>
                  How did you hear about us? (Optional)
                </Text>
                <View style={styles.pickerOptions}>
                  {HOW_DID_YOU_HEAR_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.pickerOption,
                        formData.howDidYouHear === option.value && styles.pickerOptionSelected,
                      ]}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, howDidYouHear: option.value }));
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          formData.howDidYouHear === option.value && styles.pickerOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Optional Notes */}
              <Input
                label="Additional Notes (Optional)"
                value={formData.notes}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                multiline
                numberOfLines={4}
                placeholder="Add any additional context or specific areas you'd like feedback on..."
                style={styles.input}
              />
            </Card>

            {/* Video Selection Card */}
            <Card style={[styles.videoCard, styles.formCardPadding]} padding={null} shadow="md">
              <Text style={styles.sectionTitle}>Choose or Record Video</Text>
              
              {!formData.videoUri ? (
                <View style={styles.videoSelectorArea}>
                  <View style={styles.videoSelectorPlaceholder}>
                    <Ionicons name="videocam-outline" size={48} color={colors.neutral.gray[600]} />
                    <Text style={styles.videoSelectorText}>Record or select a video to get started</Text>
                  </View>
                  
                  <View style={styles.videoActionButtons}>
                    <TouchableOpacity
                      style={[styles.videoActionButton, styles.recordButton]}
                      onPress={handleRecordVideo}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="camera-outline" size={24} color={colors.neutral.white} />
                      <Text style={styles.videoActionButtonText}>Record Video</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.videoActionButton, styles.chooseButton]}
                      onPress={handleChooseFromPhotos}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="images-outline" size={24} color={colors.neutral.white} />
                      <Text style={styles.videoActionButtonText}>Choose from Photos</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.videoPreviewArea}>
                  <VideoPreview
                    uri={formData.videoUri}
                    onRemove={handleRemoveVideo}
                  />
                  
                  {formData.videoMetadata && (
                    <View style={styles.videoInfo}>
                      {formData.videoMetadata.fileName && (
                        <View style={styles.videoInfoRow}>
                          <Ionicons name="document-text-outline" size={16} color={colors.neutral.gray[600]} />
                          <Text style={styles.videoInfoText}>{formData.videoMetadata.fileName}</Text>
                        </View>
                      )}
                      {formData.videoMetadata.fileSize && (
                        <View style={styles.videoInfoRow}>
                          <Ionicons name="folder-outline" size={16} color={colors.neutral.gray[600]} />
                          <Text style={styles.videoInfoText}>
                            {(formData.videoMetadata.fileSize / (1024 * 1024)).toFixed(2)} MB
                          </Text>
                        </View>
                      )}
                      {formData.videoMetadata.duration && (
                        <View style={styles.videoInfoRow}>
                          <Ionicons name="time-outline" size={16} color={colors.neutral.gray[600]} />
                          <Text style={styles.videoInfoText}>
                            {formatDuration(formData.videoMetadata.duration)}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}
              
              {errors.videoUri && (
                <Text style={styles.errorText}>{errors.videoUri}</Text>
              )}
            </Card>

            {/* Progress Bar Section */}
            {isUploading && (
              <View style={styles.progressSection}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${uploadProgress}%` }]} />
                </View>
                <View style={styles.progressTextContainer}>
                  {showSuccess ? (
                    <>
                      <Ionicons name="checkmark-circle" size={16} color={colors.semantic.success} />
                      <Text style={styles.successText}> Success! Submitting...</Text>
                    </>
                  ) : (
                    <Text style={styles.progressText}>Uploading... {uploadProgress}%</Text>
                  )}
                </View>
              </View>
            )}

            {/* Submit Buttons */}
            <View style={styles.submitSection}>
              <TouchableOpacity
                style={[styles.submitButton, isUploading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    {!showSuccess && <ActivityIndicator size="small" color={colors.neutral.white} />}
                    {showSuccess && <Ionicons name="checkmark-circle" size={20} color={colors.neutral.white} />}
                    <Text style={styles.submitButtonText}>
                      {showSuccess ? 'Submitting...' : `Uploading... ${uploadProgress}%`}
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={20} color={colors.neutral.white} />
                    <Text style={styles.submitButtonText}>Upload for Review</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

    </>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: layout.spacing.lg,
  },
  header: {
    marginBottom: layout.spacing.xl,
    alignItems: 'center',
  },
  badgeContainer: {
    marginBottom: layout.spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.green,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderRadius: layout.borderRadius.full,
  },
  badgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  titleAccent: {
    color: colors.primary.green,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[500],
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: layout.spacing.md,
  },
  formCard: {
    marginBottom: layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.lg,
  },
  input: {
    marginBottom: 24, // 24px vertical gap between inputs
  },
  formCardPadding: {
    padding: 40, // 40px internal padding for breathing room
  },
  pickerContainer: {
    marginBottom: 24, // 24px vertical gap between picker groups
  },
  label: {
    fontSize: typography.fontSize.xs, // 12px
    fontWeight: typography.fontWeight.semibold, // Semi-bold
    color: colors.neutral.gray[900], // High contrast
    marginBottom: layout.spacing.sm,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5, // Generous letter-spacing
  },
  required: {
    color: colors.semantic.error,
  },
  pickerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -layout.spacing.xs / 2,
  },
  pickerOption: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm + 2,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral.gray[300],
    backgroundColor: colors.neutral.white,
    margin: layout.spacing.xs / 2,
    marginBottom: layout.spacing.sm,
  },
  pickerOptionSelected: {
    backgroundColor: colors.primary.green,
    borderColor: colors.primary.green,
  },
  pickerOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[900],
  },
  pickerOptionTextSelected: {
    color: colors.neutral.white,
  },
  checkboxContainer: {
    marginBottom: layout.spacing.md,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: layout.spacing.md,
  },
  checkboxLabelContainer: {
    flex: 1,
    marginLeft: layout.spacing.sm,
  },
  checkboxHelperText: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral.gray[500],
    marginTop: layout.spacing.xs / 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.neutral.gray[300],
    marginRight: layout.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary.green,
    borderColor: colors.primary.green,
  },
  checkboxLabel: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[900],
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.semantic.error,
    marginTop: layout.spacing.xs,
  },
  videoCard: {
    marginBottom: layout.spacing.lg,
  },
  videoSelectorArea: {
    alignItems: 'center',
  },
  videoSelectorPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12, // Matching input border radius
    borderWidth: 1.5, // Matching input border width
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.55)', // Matching input border color
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Glass-like transparent background matching inputs
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacing.lg,
  },
  videoSelectorText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[700], // Darker for better contrast on glass background
    marginTop: layout.spacing.sm,
    textAlign: 'center',
  },
  videoActionButtons: {
    width: '100%',
    marginBottom: layout.spacing.md,
  },
  videoActionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: layout.spacing.lg,
    paddingHorizontal: layout.spacing.xl,
    borderRadius: layout.borderRadius.button,
    marginBottom: layout.spacing.md,
    ...layout.shadows.md,
  },
  recordButton: {
    backgroundColor: colors.primary.green,
  },
  chooseButton: {
    backgroundColor: colors.neutral.gray[700],
  },
  videoActionButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
    marginLeft: layout.spacing.sm,
    letterSpacing: 0.3,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  videoPreviewArea: {
    alignItems: 'center',
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: layout.borderRadius.lg,
    backgroundColor: colors.neutral.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral.gray[300],
  },
  videoThumbnailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray[600],
    marginTop: layout.spacing.xs,
  },
  videoInfo: {
    width: '100%',
    backgroundColor: colors.neutral.gray[100],
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  videoInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  videoInfoText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray[700],
    marginLeft: layout.spacing.sm,
  },
  removeVideoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
  },
  removeVideoText: {
    fontSize: typography.fontSize.sm,
    color: colors.semantic.error,
    marginLeft: layout.spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  progressSection: {
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.md,
    paddingHorizontal: layout.spacing.lg,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.neutral.gray[300],
    borderRadius: layout.borderRadius.full,
    overflow: 'hidden',
    marginBottom: layout.spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary.green,
    borderRadius: layout.borderRadius.full,
    transition: 'width 0.3s ease',
  },
  progressTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray[700],
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
  },
  successText: {
    fontSize: typography.fontSize.sm,
    color: colors.semantic.success,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: layout.spacing.xs,
  },
  submitSection: {
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.xl,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.green,
    paddingVertical: layout.spacing.md + 4,
    paddingHorizontal: layout.spacing.xl,
    borderRadius: layout.borderRadius.full,
    marginBottom: layout.spacing.md,
    ...layout.shadows.md,
  },
  submitButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    marginLeft: layout.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.neutral.white,
    borderRadius: layout.borderRadius.xl,
    padding: layout.spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...layout.shadows.lg,
  },
  modalIcon: {
    marginBottom: layout.spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.md,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[600],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: layout.spacing.xl,
  },
  modalButton: {
    backgroundColor: colors.primary.green,
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.xl,
    borderRadius: layout.borderRadius.full,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
});
