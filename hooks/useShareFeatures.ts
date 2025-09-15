import { useState, useEffect } from 'react';
import { Platform, Share } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import useUserStore from '@/store/useUserStore';

// Configure notifications
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export default function useShareFeatures() {
  const { profile, addPoints } = useUserStore();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [currentBadgeId, setCurrentBadgeId] = useState<string | null>(null);
  
  // Check if sharing is available
  const [isSharingAvailable, setIsSharingAvailable] = useState(false);
  
  useEffect(() => {
    const checkSharingAvailability = async () => {
      if (Platform.OS !== 'web') {
        const available = await Sharing.isAvailableAsync();
        setIsSharingAvailable(available);
      } else {
        setIsSharingAvailable(!!navigator.share);
      }
    };
    
    checkSharingAvailability();
  }, []);
  
  // Request notification permissions
  useEffect(() => {
    const requestNotificationPermissions = async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permissions not granted');
        }
      }
    };
    
    requestNotificationPermissions();
  }, []);
  
  // Show achievement popup when a new badge is earned
  const showBadgeAchievement = (badgeId: string) => {
    setCurrentBadgeId(badgeId);
    setShowAchievementPopup(true);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  // Show streak popup when streak milestone is reached
  const showStreakMilestone = () => {
    if (!profile) return;
    
    // Only show for certain milestones (3, 7, 14, 30, 60, 90, etc.)
    const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
    if (milestones.includes(profile.streak)) {
      setShowStreakPopup(true);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };
  
  // Show app sharing popup based on usage patterns
  const checkAndShowSharePrompt = () => {
    if (!profile) return;
    
    // Show share popup after user has:
    // 1. Asked at least 5 questions
    // 2. Earned at least 2 badges
    // 3. Has a streak of at least 3 days
    // 4. Hasn't seen the popup in the last 7 days
    
    const hasEnoughQuestions = true; // Replace with actual logic from questions store
    const hasEnoughBadges = profile.badges.length >= 2;
    const hasGoodStreak = profile.streak >= 3;
    
    if (hasEnoughQuestions && hasEnoughBadges && hasGoodStreak) {
      setShowSharePopup(true);
    }
  };
  
  // Schedule a notification
  const scheduleNotification = async (title: string, body: string, trigger: any = null) => {
    if (Platform.OS === 'web') return;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: trigger || { 
        seconds: 60 * 60 
      }, // Default 1 hour from now
    });
  };
  
  // Schedule a streak reminder notification
  const scheduleStreakReminder = async () => {
    if (Platform.OS === 'web' || !profile) return;
    
    // Schedule for 8 PM if they haven't used the app today
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(20, 0, 0, 0); // 8 PM
    
    // If it's already past 8 PM, schedule for tomorrow
    if (now > reminderDate) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't Break Your Streak!",
        body: `You're on a ${profile.streak} day streak! Take a moment to learn something new today.`,
      },
      trigger: {
        date: reminderDate,
      },
    });
  };
  
  // Handle successful share
  const handleSuccessfulShare = () => {
    // Reward the user with points for sharing
    addPoints(5);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  return {
    showSharePopup,
    setShowSharePopup,
    showAchievementPopup,
    setShowAchievementPopup,
    showStreakPopup,
    setShowStreakPopup,
    currentBadgeId,
    isSharingAvailable,
    showBadgeAchievement,
    showStreakMilestone,
    checkAndShowSharePrompt,
    scheduleNotification,
    scheduleStreakReminder,
    handleSuccessfulShare,
  };
}