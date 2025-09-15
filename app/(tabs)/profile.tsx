import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Award, Flame, Bell, Shield, HelpCircle, Info, ChevronRight, Share, UserPlus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Colors from '@/constants/colors';
import useUserStore from '@/store/useUserStore';
import useShareFeatures from '@/hooks/useShareFeatures';
import badges from '@/constants/badges';
import BadgeItem from '@/components/BadgeItem';
import SharePopup from '@/components/SharePopup';
import InviteFriendsButton from '@/components/InviteFriendsButton';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useUserStore();
  const { showSharePopup, setShowSharePopup, handleSuccessfulShare } = useShareFeatures();
  
  const [showInviteOptions, setShowInviteOptions] = useState(false);
  
  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }
  
  const earnedBadges = badges.filter((badge) => profile.badges.includes(badge.id));
  const unearnedBadges = badges.filter((badge) => !profile.badges.includes(badge.id));
  
  const handleSettingPress = (setting: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Handle different settings
    switch (setting) {
      case 'invite':
        setShowInviteOptions(true);
        break;
      case 'share':
        setShowSharePopup(true);
        break;
      default:
        // For other settings, just log for now
        console.log(`Pressed ${setting}`);
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profile.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.details}>
            Grade {profile.grade} • Age {profile.age}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Award size={16} color={Colors.primary} />
              <Text style={styles.statText}>{profile.badges.length} badges</Text>
            </View>
            <View style={styles.stat}>
              <Flame size={16} color={Colors.warning} />
              <Text style={styles.statText}>{profile.streak} day streak</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Subjects</Text>
        <View style={styles.subjectsList}>
          {profile.subjects.map((subjectId) => {
            const subject = subjectId;
            return (
              <View key={subjectId} style={styles.subjectBadge}>
                <Text style={styles.subjectText}>{subject}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Achievements</Text>
        <Text style={styles.sectionSubtitle}>
          Earned Badges ({earnedBadges.length})
        </Text>
        
        {earnedBadges.length > 0 ? (
          earnedBadges.map((badge) => (
            <BadgeItem key={badge.id} badge={badge} earned={true} />
          ))
        ) : (
          <Text style={styles.emptyText}>
            You haven't earned any badges yet. Keep learning!
          </Text>
        )}
        
        <Text style={[styles.sectionSubtitle, { marginTop: 16 }]}>
          Badges to Earn ({unearnedBadges.length})
        </Text>
        
        {unearnedBadges.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} earned={false} />
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => handleSettingPress('notifications')}
        >
          <Bell size={20} color={Colors.text} />
          <Text style={styles.settingText}>Notifications</Text>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => handleSettingPress('privacy')}
        >
          <Shield size={20} color={Colors.text} />
          <Text style={styles.settingText}>Privacy</Text>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => handleSettingPress('help')}
        >
          <HelpCircle size={20} color={Colors.text} />
          <Text style={styles.settingText}>Help & Support</Text>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => handleSettingPress('about')}
        >
          <Info size={20} color={Colors.text} />
          <Text style={styles.settingText}>About</Text>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.socialSection}>
        <Text style={styles.sectionTitle}>Share & Invite</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => handleSettingPress('share')}
        >
          <Share size={20} color={Colors.text} />
          <Text style={styles.settingText}>Share App</Text>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => handleSettingPress('invite')}
        >
          <UserPlus size={20} color={Colors.text} />
          <Text style={styles.settingText}>Invite Friends</Text>
          <ChevronRight size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
      
      {/* Popups */}
      <SharePopup
        visible={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        title="Share AI Homework Helper"
        message="Help your friends succeed in school by sharing this app with them. Everyone deserves access to quality education!"
        shareMessage="I've been using AI Homework Helper for my studies and it's been amazing! It's like having a personal tutor 24/7. Check it out!"
        shareUrl="https://aihomeworkhelper.app"
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
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  socialSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  subjectsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectBadge: {
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  subjectText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
});