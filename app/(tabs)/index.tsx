import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Flame, ArrowRight, HelpCircle, BarChart2, Award } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Colors from '@/constants/colors';
import useUserStore from '@/store/useUserStore';
import useStudyPlanStore from '@/store/useStudyPlanStore';
import useQuestionsStore from '@/store/useQuestionsStore';
import useShareFeatures from '@/hooks/useShareFeatures';
import StudyPlanCard from '@/components/StudyPlanCard';
import QuestionCard from '@/components/QuestionCard';
import EmptyState from '@/components/EmptyState';
import SharePopup from '@/components/SharePopup';
import AchievementPopup from '@/components/AchievementPopup';
import StreakPopup from '@/components/StreakPopup';
import InviteFriendsButton from '@/components/InviteFriendsButton';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, isOnboarded, incrementStreak } = useUserStore();
  const { questions } = useQuestionsStore();
  const { getTodayPlan, generateNewPlan, toggleTaskCompletion } = useStudyPlanStore();
  const { 
    showSharePopup, 
    setShowSharePopup,
    showAchievementPopup,
    setShowAchievementPopup,
    showStreakPopup,
    setShowStreakPopup,
    currentBadgeId,
    checkAndShowSharePrompt,
    scheduleStreakReminder,
    handleSuccessfulShare
  } = useShareFeatures();
  
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  
  useEffect(() => {
    if (!isOnboarded) {
      router.replace('/onboarding');
    } else if (profile && !getTodayPlan()) {
      generateNewPlan(profile.subjects);
    }
    
    // Check if this is a new day login and update streak
    if (profile) {
      const today = new Date().toISOString().split('T')[0];
      if (profile.lastActive !== today) {
        incrementStreak();
        setShowWelcomeBack(true);
        
        // Schedule streak reminder for tomorrow
        scheduleStreakReminder();
        
        // Check if we should show streak milestone popup
        setTimeout(() => {
          if (profile.streak > 0 && profile.streak % 7 === 0) {
            setShowStreakPopup(true);
          }
        }, 1000);
      }
    }
    
    // Check if we should show share popup
    setTimeout(() => {
      checkAndShowSharePrompt();
    }, 3000);
  }, [isOnboarded, profile]);
  
  const todayPlan = getTodayPlan();
  const recentQuestions = questions.slice(0, 3);
  
  const getGreeting = () => {
    if (showWelcomeBack) return 'Welcome back';
    
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const handleQuickAction = (route: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(route);
  };
  
  const handleShareAchievement = () => {
    setShowAchievementPopup(false);
    
    // Show share popup with achievement context
    setTimeout(() => {
      setShowSharePopup(true);
    }, 500);
  };
  
  const handleShareStreak = () => {
    setShowStreakPopup(false);
    
    // Show share popup with streak context
    setTimeout(() => {
      setShowSharePopup(true);
    }, 500);
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{profile?.name || 'Student'}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.streakContainer}
          onPress={() => setShowStreakPopup(true)}
          activeOpacity={0.7}
        >
          <Flame size={20} color={Colors.warning} />
          <Text style={styles.streakText}>{profile?.streak || 0} day streak</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Study Plan</Text>
        {todayPlan ? (
          <StudyPlanCard
            plan={todayPlan}
            onToggleTask={(taskId) => {
              toggleTaskCompletion(todayPlan.id, taskId);
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
            }}
          />
        ) : (
          <EmptyState
            icon="calendar"
            title="No Study Plan Yet"
            message="Your personalized study plan will appear here soon."
          />
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Questions</Text>
          <TouchableOpacity
            onPress={() => handleQuickAction('/ask')}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>Ask a question</Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        {recentQuestions.length > 0 ? (
          recentQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onPress={() => router.push(`/question/${question.id}`)}
            />
          ))
        ) : (
          <EmptyState
            icon="help-circle"
            title="No Questions Yet"
            message="Ask your first homework question to get help from your AI tutor."
          />
        )}
      </View>
      
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleQuickAction('/ask')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
              <HelpCircle size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Ask Question</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleQuickAction('/progress')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.secondary }]}>
              <BarChart2 size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>View Progress</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleQuickAction('/profile')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.success }]}>
              <Award size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Achievements</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <InviteFriendsButton style={styles.inviteButton} />
      
      {/* Popups */}
      <SharePopup
        visible={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        title="Help Your Friends Succeed!"
        message="Share AI Homework Helper with your friends and classmates so they can get help with their homework too. Learning is better together!"
        shareMessage="I've been using AI Homework Helper for my studies and it's been amazing! It's like having a personal tutor 24/7. Join me!"
        shareUrl="https://aihomeworkhelper.app"
      />
      
      <AchievementPopup
        visible={showAchievementPopup}
        onClose={() => setShowAchievementPopup(false)}
        badgeId={currentBadgeId || ''}
        onShare={handleShareAchievement}
      />
      
      <StreakPopup
        visible={showStreakPopup}
        onClose={() => setShowStreakPopup(false)}
        streak={profile?.streak || 0}
        onShare={handleShareStreak}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textLight,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  inviteButton: {
    marginBottom: 16,
  },
});