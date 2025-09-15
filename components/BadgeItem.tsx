import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Award } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Badge } from '@/constants/badges';

interface BadgeItemProps {
  badge: Badge;
  earned: boolean;
}

const BadgeItem: React.FC<BadgeItemProps> = ({ badge, earned }) => {
  // Import the specific icon component dynamically
  const BadgeIcon = require('lucide-react-native')[badge.icon] || Award;
  
  return (
    <View style={[styles.container, !earned && styles.lockedContainer]}>
      <View style={[styles.iconContainer, !earned && styles.lockedIconContainer]}>
        <BadgeIcon
          size={24}
          color={earned ? '#FFFFFF' : Colors.inactive}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, !earned && styles.lockedText]}>
          {badge.name}
        </Text>
        <Text style={[styles.description, !earned && styles.lockedText]}>
          {badge.description}
        </Text>
      </View>
      {earned ? (
        <Award size={20} color={Colors.success} />
      ) : (
        <Text style={styles.pointsNeeded}>{badge.requiredPoints} pts</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  lockedContainer: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lockedIconContainer: {
    backgroundColor: Colors.inactive,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
  },
  lockedText: {
    color: Colors.inactive,
  },
  pointsNeeded: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
});

export default BadgeItem;