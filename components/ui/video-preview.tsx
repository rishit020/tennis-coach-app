import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VideoPreviewProps {
  uri: string;
  onRemove?: () => void;
  style?: any;
}

export function VideoPreview({ uri, onRemove, style }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<any>({});

  const handlePlayPause = async () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Video',
      'Are you sure you want to remove this video?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onRemove },
      ]
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.videoContainer}>
        <Video
          style={styles.video}
          source={{ uri }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          shouldPlay={isPlaying}
          onPlaybackStatusUpdate={setStatus}
        />
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={32}
            color={colors.neutral.white}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.duration}>
          Duration: {Math.round((status.durationMillis || 0) / 1000)}s
        </Text>
        <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={20} color={colors.semantic.error} />
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: layout.spacing.md,
  },
  videoContainer: {
    position: 'relative',
    backgroundColor: colors.neutral.gray[100],
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: 200,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: layout.spacing.sm,
  },
  duration: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray[500],
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeText: {
    fontSize: typography.fontSize.sm,
    color: colors.semantic.error,
    marginLeft: layout.spacing.xs,
  },
});
