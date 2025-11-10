import { Button, Card, Input, VideoPreview } from '@/components/ui';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { useKeyboardDismiss } from '@/hooks/use-keyboard-dismiss';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface UploadFormData {
  yearsPlaying: string;
  skillLevel: string;
  shortNote: string;
  detailedNote: string;
  shotType: string;
  consent: boolean;
  videoUri: string | null;
}

interface UploadFormProps {
  onSubmit?: (data: UploadFormData) => void;
}

const SKILL_LEVELS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

const SHOT_TYPES = [
  { label: 'Forehand', value: 'forehand' },
  { label: 'Backhand', value: 'backhand' },
  { label: 'Serve', value: 'serve' },
  { label: 'Volley', value: 'volley' },
  { label: 'Overhead', value: 'overhead' },
  { label: 'General Play', value: 'general' },
];

export function UploadForm({ onSubmit }: UploadFormProps) {
  const [formData, setFormData] = useState<UploadFormData>({
    yearsPlaying: '',
    skillLevel: '',
    shortNote: '',
    detailedNote: '',
    shotType: '',
    consent: false,
    videoUri: null,
  });
  const [errors, setErrors] = useState<Partial<UploadFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dismissKeyboard = useKeyboardDismiss();

  const validateForm = (): boolean => {
    const newErrors: Partial<UploadFormData> = {};

    if (!formData.yearsPlaying.trim()) {
      newErrors.yearsPlaying = 'Years playing is required';
    }

    if (!formData.skillLevel) {
      newErrors.skillLevel = 'Skill level is required';
    }

    if (!formData.shotType) {
      newErrors.shotType = 'Shot type is required';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to the terms';
    }

    if (!formData.videoUri) {
      newErrors.videoUri = 'Please select a video';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Camera permission is needed to record videos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData(prev => ({ ...prev, videoUri: result.assets[0].uri }));
      setErrors(prev => ({ ...prev, videoUri: undefined }));
    }
  };

  const handleGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Gallery permission is needed to select videos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData(prev => ({ ...prev, videoUri: result.assets[0].uri }));
      setErrors(prev => ({ ...prev, videoUri: undefined }));
    }
  };

  const handleRemoveVideo = () => {
    setFormData(prev => ({ ...prev, videoUri: null }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Video Uploaded!',
        'Thank you for sharing your tennis video. Our coaches will review it and provide feedback soon.',
        [{ text: 'OK' }]
      );
      
      // Reset form
      setFormData({
        yearsPlaying: '',
        skillLevel: '',
        shortNote: '',
        detailedNote: '',
        shotType: '',
        consent: false,
        videoUri: null,
      });
      setErrors({});
      
      onSubmit?.(formData);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload video. Please try again.');
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
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.formContainer}>
          {/* Tennis Experience Section */}
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Tennis Experience</Text>
            
            <Input
              label="Years Playing Tennis"
              value={formData.yearsPlaying}
              onChangeText={(text) => setFormData(prev => ({ ...prev, yearsPlaying: text }))}
              error={errors.yearsPlaying}
              required
              placeholder="Years Playing Tennis *"
              keyboardType="numeric"
            />

            <View style={styles.skillLevelContainer}>
              <Text style={styles.label}>
                Skill Level <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.skillLevelOptions}>
                {SKILL_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.skillLevelOption,
                      formData.skillLevel === level.value && styles.skillLevelOptionSelected,
                    ]}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, skillLevel: level.value }));
                      setErrors(prev => ({ ...prev, skillLevel: undefined }));
                    }}
                  >
                    <Text
                      style={[
                        styles.skillLevelOptionText,
                        formData.skillLevel === level.value && styles.skillLevelOptionTextSelected,
                      ]}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.skillLevel && (
                <Text style={styles.errorText}>{errors.skillLevel}</Text>
              )}
            </View>
          </Card>

          {/* Video Details Section */}
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Video Details</Text>
            
            <Input
              label=""
              value={formData.shortNote}
              onChangeText={(text) => setFormData(prev => ({ ...prev, shortNote: text }))}
              placeholder="Working on my forehand technique"
              style={styles.shortInput}
            />

            <Input
              label=""
              value={formData.detailedNote}
              onChangeText={(text) => setFormData(prev => ({ ...prev, detailedNote: text }))}
              multiline
              numberOfLines={4}
              placeholder="Tell us what you're working on and what specific feedback you'd like on your technique"
              style={styles.detailedInput}
            />

            <View style={styles.shotTypeContainer}>
              <Text style={styles.label}>
                Shot Type <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.shotTypeOptions}>
                {SHOT_TYPES.map((shot) => (
                  <TouchableOpacity
                    key={shot.value}
                    style={[
                      styles.shotTypeOption,
                      formData.shotType === shot.value && styles.shotTypeOptionSelected,
                    ]}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, shotType: shot.value }));
                      setErrors(prev => ({ ...prev, shotType: undefined }));
                    }}
                  >
                    <Text
                      style={[
                        styles.shotTypeOptionText,
                        formData.shotType === shot.value && styles.shotTypeOptionTextSelected,
                      ]}
                    >
                      {shot.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.shotType && (
                <Text style={styles.errorText}>{errors.shotType}</Text>
              )}
            </View>
          </Card>

          {/* Upload Your Video Section */}
          <Text style={styles.uploadHeader}>Upload Your Video</Text>
          
          <View style={styles.uploadButtons}>
            <TouchableOpacity style={styles.recordButton} onPress={handleCamera} activeOpacity={0.8}>
              <Ionicons name="camera" size={20} color={colors.neutral.white} style={{ marginRight: layout.spacing.xs }} />
              <Text style={styles.recordButtonText}>Record Video</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.chooseButton} onPress={handleGallery} activeOpacity={0.8}>
              <Ionicons name="folder" size={20} color={colors.neutral.white} style={{ marginRight: layout.spacing.xs }} />
              <Text style={styles.chooseButtonText}>Choose Video</Text>
            </TouchableOpacity>
          </View>

          {formData.videoUri && (
            <VideoPreview uri={formData.videoUri} onRemove={handleRemoveVideo} />
          )}

          {errors.videoUri && (
            <Text style={styles.errorText}>{errors.videoUri}</Text>
          )}

          {/* Video Requirements */}
          <Card style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>Video Requirements:</Text>
            <View style={styles.requirementsList}>
              <Text style={styles.requirementItem}>• Maximum file size: 100MB</Text>
              <Text style={styles.requirementItem}>• Supported formats: MP4, MOV, AVI</Text>
              <Text style={styles.requirementItem}>• Ensure good lighting and clear view</Text>
              <Text style={styles.requirementItem}>• Record from a side angle for best analysis</Text>
            </View>
          </Card>

          <TouchableOpacity
            style={styles.consentContainer}
            onPress={() => setFormData(prev => ({ ...prev, consent: !prev.consent }))}
          >
            <View style={[styles.checkbox, formData.consent && styles.checkboxSelected]}>
              {formData.consent && <Ionicons name="checkmark" size={16} color={colors.neutral.white} />}
            </View>
            <Text style={styles.consentText}>
              I agree to the terms and conditions and consent to my video being used for coaching purposes.
            </Text>
          </TouchableOpacity>
          {errors.consent && (
            <Text style={styles.errorText}>{errors.consent}</Text>
          )}

          <Button
            title="Submit for Review"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  formContainer: {
    paddingTop: 60,
    paddingHorizontal: layout.spacing.lg,
    paddingBottom: layout.spacing.xl,
  },
  formCard: {
    marginBottom: layout.spacing.lg,
    borderRadius: layout.borderRadius.card,
    ...layout.shadows.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.sm,
  },
  required: {
    color: colors.semantic.error,
  },
  shortInput: {
    marginBottom: layout.spacing.md,
  },
  detailedInput: {
    marginBottom: layout.spacing.md,
    minHeight: 100,
  },
  skillLevelContainer: {
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.sm,
  },
  skillLevelOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -layout.spacing.xs / 2,
  },
  skillLevelOption: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm + 2,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral.gray[300],
    backgroundColor: colors.neutral.white,
    margin: layout.spacing.xs / 2,
    marginBottom: layout.spacing.sm,
  },
  skillLevelOptionSelected: {
    backgroundColor: colors.primary.green,
    borderColor: colors.primary.green,
  },
  skillLevelOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[900],
  },
  skillLevelOptionTextSelected: {
    color: colors.neutral.white,
  },
  shotTypeContainer: {
    marginTop: layout.spacing.md,
  },
  shotTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -layout.spacing.sm / 2,
  },
  shotTypeOption: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm + 2,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral.gray[300],
    backgroundColor: colors.neutral.gray[100],
    margin: layout.spacing.sm / 2,
    marginBottom: layout.spacing.sm,
    minWidth: '30%',
  },
  shotTypeOptionSelected: {
    backgroundColor: colors.primary.green,
    borderColor: colors.primary.green,
  },
  shotTypeOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[900],
  },
  shotTypeOptionTextSelected: {
    color: colors.neutral.white,
  },
  uploadHeader: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    textAlign: 'center',
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.lg,
  },
  uploadButtons: {
    flexDirection: 'row',
    marginBottom: layout.spacing.lg,
    marginHorizontal: -layout.spacing.sm,
  },
  recordButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.green,
    paddingVertical: layout.spacing.md,
    borderRadius: layout.borderRadius.button,
    marginHorizontal: layout.spacing.sm,
  },
  recordButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
  chooseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.gray[900],
    paddingVertical: layout.spacing.md,
    borderRadius: layout.borderRadius.button,
    marginHorizontal: layout.spacing.sm,
  },
  chooseButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
  requirementsCard: {
    marginTop: layout.spacing.lg,
    marginBottom: layout.spacing.lg,
    borderRadius: layout.borderRadius.card,
    ...layout.shadows.md,
  },
  requirementsTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.gray[900],
    marginBottom: layout.spacing.md,
  },
  requirementsList: {
    // Spacing handled by marginBottom on items
  },
  requirementItem: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray[900],
    lineHeight: 22,
    marginBottom: layout.spacing.sm,
  },
  consentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: layout.spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
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
  consentText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray[500],
    lineHeight: 20,
  },
  required: {
    color: colors.semantic.error,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.semantic.error,
    marginTop: layout.spacing.xs,
  },
  submitButton: {
    marginTop: layout.spacing.md,
  },
});

