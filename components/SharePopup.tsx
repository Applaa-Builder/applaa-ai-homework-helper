import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Platform, Share } from 'react-native';
import { Share as ShareIcon, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import Colors from '@/constants/colors';

interface SharePopupProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  shareMessage: string;
  shareTitle?: string;
  shareUrl?: string;
}

const SharePopup: React.FC<SharePopupProps> = ({
  visible,
  onClose,
  title,
  message,
  shareMessage,
  shareTitle = "AI Homework Helper",
  shareUrl = "https://aihomeworkhelper.app"
}) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
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
        Animated.timing(translateY, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      // Web sharing
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareMessage,
            url: shareUrl,
          });
          onClose();
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        // Copy to clipboard fallback
        navigator.clipboard.writeText(`${shareMessage} ${shareUrl}`);
        alert('Link copied to clipboard!');
        onClose();
      }
    } else {
      // Native sharing
      try {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          await Sharing.shareAsync(shareUrl, {
            dialogTitle: shareTitle,
            mimeType: 'text/plain',
            UTI: 'public.plain-text',
          });
        } else {
          // Web fallback or if sharing is not available
          await Share.share({
            title: shareTitle,
            message: shareMessage,
            url: shareUrl,
          });
        }
        
        onClose();
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.container,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={20} color={Colors.textLight} />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <ShareIcon size={20} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>Share with Friends</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.laterButton} onPress={onClose}>
            <Text style={styles.laterButtonText}>Maybe Later</Text>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
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
  laterButton: {
    paddingVertical: 12,
  },
  laterButtonText: {
    color: Colors.textLight,
    fontSize: 14,
  },
});

export default SharePopup;