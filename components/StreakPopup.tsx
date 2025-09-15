import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Platform } from 'react-native';
import { Flame, Share, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

interface StreakPopupProps {
  visible: boolean;
  onClose: () => void;
  streak: number;
  onShare?: () => void;
}

const StreakPopup: React.FC<StreakPopupProps> = ({
  visible,
  onClose,
  streak,
  onShare,
}) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.container,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={20} color={Colors.textLight} />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Text style={styles.congratsText}>Amazing Streak!</Text>
          
          <View style={styles.streakIconContainer}>
            <Flame size={40} color="#FFFFFF" />
            <Text style={styles.streakCount}>{streak}</Text>
          </View>
          
          <Text style={styles.streakTitle}>
            {streak} Day{streak !== 1 ? 's' : ''} Learning Streak!
          </Text>
          
          <Text style={styles.streakDescription}>
            You've been learning consistently for {streak} day{streak !== 1 ? 's' : ''}! 
            Consistency is key to success. Keep it up!
          </Text>
          
          {onShare && (
            <TouchableOpacity style={styles.shareButton} onPress={onShare}>
              <Share size={20} color="#FFFFFF" />
              <Text style={styles.shareButtonText}>Share My Streak</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.continueButton} onPress={onClose}>
            <Text style={styles.continueButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: '85%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  streakIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  streakCount: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: Colors.primary,
    color: '#FFFFFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: '700',
    fontSize: 16,
  },
  streakTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  streakDescription: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  continueButton: {
    paddingVertical: 12,
  },
  continueButtonText: {
    color: Colors.textLight,
    fontSize: 14,
  },
});

export default StreakPopup;