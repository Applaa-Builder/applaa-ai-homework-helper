import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Platform } from 'react-native';
import { Award, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import badges, { Badge } from '@/constants/badges';

interface AchievementPopupProps {
  visible: boolean;
  onClose: () => void;
  badgeId: string;
  onShare?: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  visible,
  onClose,
  badgeId,
  onShare,
}) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.8)).current;

  const badge = badges.find(b => b.id === badgeId);

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

  if (!visible || !badge) return null;

  // Import the specific icon component dynamically
  const BadgeIcon = require('lucide-react-native')[badge.icon] || Award;

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
          <Text style={styles.congratsText}>Congratulations!</Text>
          
          <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
            <BadgeIcon size={40} color="#FFFFFF" />
          </View>
          
          <Text style={styles.badgeName}>{badge.name}</Text>
          <Text style={styles.badgeDescription}>{badge.description}</Text>
          
          {onShare && (
            <TouchableOpacity style={styles.shareButton} onPress={onShare}>
              <Text style={styles.shareButtonText}>Share Achievement</Text>
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
  badgeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  shareButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    paddingVertical: 12,
  },
  continueButtonText: {
    color: Colors.textLight,
    fontSize: 14,
  },
});

export default AchievementPopup;