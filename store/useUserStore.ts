import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { UserProfile } from '@/types';

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  lastSharePrompt: string | null; // Date string when last prompted to share
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addPoints: (points: number) => void;
  addBadge: (badgeId: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  setOnboarded: (value: boolean) => void;
  setLastSharePrompt: (date: string) => void;
  checkAndUpdateStreak: () => void;
}

// Configure notifications for streak reminders
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

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isOnboarded: false,
      lastSharePrompt: null,
      
      setProfile: (profile) => set({ profile }),
      
      updateProfile: (updates) => 
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),
      
      addPoints: (points) => 
        set((state) => {
          if (!state.profile) return { profile: null };
          
          const newPoints = state.profile.points + points;
          
          // Check for point milestones and schedule notifications
          if (Platform.OS !== 'web') {
            if (newPoints >= 50 && state.profile.points < 50) {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "Milestone Reached!",
                  body: "You've earned 50 points! Keep up the great work!",
                },
                trigger: null, // Show immediately
              });
            }
          }
          
          return {
            profile: { 
              ...state.profile, 
              points: newPoints 
            }
          };
        }),
      
      addBadge: (badgeId) => 
        set((state) => {
          if (!state.profile) return { profile: null };
          if (state.profile.badges.includes(badgeId)) return { profile: state.profile };
          
          // Schedule notification for new badge
          if (Platform.OS !== 'web') {
            Notifications.scheduleNotificationAsync({
              content: {
                title: "New Badge Earned!",
                body: "You've earned a new achievement badge! Check it out in your profile.",
              },
              trigger: null, // Show immediately
            });
          }
          
          return {
            profile: {
              ...state.profile,
              badges: [...state.profile.badges, badgeId],
              points: state.profile.points + 10, // Bonus points for badges
            }
          };
        }),
      
      incrementStreak: () => 
        set((state) => {
          if (!state.profile) return { profile: null };
          
          const newStreak = state.profile.streak + 1;
          const today = new Date().toISOString().split('T')[0];
          
          // Schedule streak milestone notifications
          if (Platform.OS !== 'web') {
            if (newStreak === 7 || newStreak === 30 || newStreak === 100) {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: `${newStreak} Day Streak!`,
                  body: `Amazing! You've maintained your learning streak for ${newStreak} days. Keep it up!`,
                },
                trigger: { 
                  seconds: 2 
                }, // Show after a slight delay
              });
            }
          }
          
          return {
            profile: { 
              ...state.profile, 
              streak: newStreak,
              lastActive: today,
              // Add bonus points for streak milestones
              points: state.profile.points + (
                newStreak % 7 === 0 ? 15 : // Weekly milestone
                newStreak % 30 === 0 ? 50 : // Monthly milestone
                1 // Regular daily point
              )
            }
          };
        }),
      
      resetStreak: () => 
        set((state) => ({
          profile: state.profile 
            ? { ...state.profile, streak: 0 } 
            : null,
        })),
      
      setOnboarded: (value) => set({ isOnboarded: value }),
      
      setLastSharePrompt: (date) => set({ lastSharePrompt: date }),
      
      checkAndUpdateStreak: () => {
        const { profile } = get();
        if (!profile) return;
        
        const today = new Date().toISOString().split('T')[0];
        const lastActive = profile.lastActive;
        
        // If last active was yesterday, increment streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastActive === yesterdayStr) {
          get().incrementStreak();
        } 
        // If last active was more than a day ago, reset streak
        else if (lastActive !== today && lastActive !== yesterdayStr) {
          get().resetStreak();
        }
        
        // Update last active to today
        if (lastActive !== today) {
          set((state) => ({
            profile: state.profile 
              ? { ...state.profile, lastActive: today } 
              : null,
          }));
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;