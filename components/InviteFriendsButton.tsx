import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform, Share } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import Colors from '@/constants/colors';

interface InviteFriendsButtonProps {
  onPress?: () => void;
  style?: any;
}

const InviteFriendsButton: React.FC<InviteFriendsButtonProps> = ({ onPress, style }) => {
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (onPress) {
      onPress();
      return;
    }
    
    // Default share behavior
    try {
      const message = "Hey! I've been using AI Homework Helper for my studies and it's been super helpful. It's like having a personal tutor 24/7! Check it out:";
      const url = "https://aihomeworkhelper.app";
      
      if (Platform.OS === 'web') {
        // Web sharing
        if (navigator.share) {
          await navigator.share({
            title: "Join me on AI Homework Helper!",
            text: message,
            url: url,
          });
        } else {
          // Copy to clipboard fallback
          navigator.clipboard.writeText(`${message} ${url}`);
          alert('Invite link copied to clipboard!');
        }
      } else {
        // Native sharing
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          await Sharing.shareAsync(url, {
            dialogTitle: "Invite Friends to AI Homework Helper",
            mimeType: 'text/plain',
            UTI: 'public.plain-text',
          });
        } else {
          // Fallback
          await Share.share({
            title: "Join me on AI Homework Helper!",
            message: `${message} ${url}`,
            url: url,
          });
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <UserPlus size={20} color="#FFFFFF" />
      <Text style={styles.text}>Invite Friends</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default InviteFriendsButton;