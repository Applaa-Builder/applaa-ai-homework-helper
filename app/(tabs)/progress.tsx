import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart, Flame, Lightbulb } from 'lucide-react-native';
import Colors from '@/constants/colors';
import useQuestionsStore from '@/store/useQuestionsStore';
import useUserStore from '@/store/useUserStore';
import subjects from '@/constants/subjects';
import EmptyState from '@/components/EmptyState';

export default function ProgressScreen() {
  const { questions } = useQuestionsStore();
  const { profile } = useUserStore();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Calculate stats based on questions
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter((q) => q.answered).length;
  const completionRate = totalQuestions > 0 
    ? Math.round((answeredQuestions / totalQuestions) * 100) 
    : 0;
  
  // Get subject distribution
  const subjectCounts = subjects.map((subject) => {
    const count = questions.filter((q) => q.subject === subject.id).length;
    return {
      ...subject,
      count,
      percentage: totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0,
    };
  }).filter((subject) => subject.count > 0);
  
  // Sort subjects by count (descending)
  subjectCounts.sort((a, b) => b.count - a.count);
  
  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      <TouchableOpacity
        style={[
          styles.periodButton,
          selectedPeriod === 'week' && styles.selectedPeriodButton,
        ]}
        onPress={() => setSelectedPeriod('week')}
      >
        <Text
          style={[
            styles.periodButtonText,
            selectedPeriod === 'week' && styles.selectedPeriodButtonText,
          ]}
        >
          Week
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.periodButton,
          selectedPeriod === 'month' && styles.selectedPeriodButton,
        ]}
        onPress={() => setSelectedPeriod('month')}
      >
        <Text
          style={[
            styles.periodButtonText,
            selectedPeriod === 'month' && styles.selectedPeriodButtonText,
          ]}
        >
          Month
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.periodButton,
          selectedPeriod === 'all' && styles.selectedPeriodButton,
        ]}
        onPress={() => setSelectedPeriod('all')}
      >
        <Text
          style={[
            styles.periodButtonText,
            selectedPeriod === 'all' && styles.selectedPeriodButtonText,
          ]}
        >
          All Time
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Learning Progress</Text>
      
      {renderPeriodSelector()}
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalQuestions}</Text>
          <Text style={styles.statLabel}>Questions Asked</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{answeredQuestions}</Text>
          <Text style={styles.statLabel}>Questions Solved</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Streak</Text>
        <View style={styles.streakCard}>
          <View style={styles.streakIconContainer}>
            <Flame size={32} color="#FFFFFF" />
          </View>
          <View style={styles.streakInfo}>
            <Text style={styles.streakValue}>{profile?.streak || 0} days</Text>
            <Text style={styles.streakLabel}>Current Streak</Text>
          </View>
          <View style={styles.streakPoints}>
            <Text style={styles.pointsValue}>{profile?.points || 0}</Text>
            <Text style={styles.pointsLabel}>Total Points</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subject Distribution</Text>
        
        {subjectCounts.length > 0 ? (
          <View style={styles.subjectDistribution}>
            {subjectCounts.map((subject) => {
              // Import the specific icon component dynamically
              const IconComponent = require('lucide-react-native')[subject.icon] || PieChart;
              
              return (
                <View key={subject.id} style={styles.subjectItem}>
                  <View style={styles.subjectHeader}>
                    <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
                      <IconComponent size={16} color="#FFFFFF" />
                    </View>
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    <Text style={styles.subjectCount}>{subject.count}</Text>
                  </View>
                  
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${subject.percentage}%`, backgroundColor: subject.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <EmptyState
            icon="pie-chart"
            title="No Data Yet"
            message="Start asking questions to see your subject distribution."
          />
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Insights</Text>
        <View style={styles.insightCard}>
          <Lightbulb size={24} color={Colors.warning} />
          <Text style={styles.insightText}>
            {totalQuestions > 0
              ? `You're making great progress! You've asked ${totalQuestions} questions and solved ${answeredQuestions} of them.`
              : "Start asking questions to get personalized learning insights."}
          </Text>
        </View>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  selectedPeriodButton: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedPeriodButtonText: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  streakCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  streakIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  streakLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  streakPoints: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  pointsLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  subjectDistribution: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  subjectItem: {
    marginBottom: 16,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  subjectName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  subjectCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
});