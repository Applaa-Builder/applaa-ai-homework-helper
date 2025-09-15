import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowRight, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import subjects from '@/constants/subjects';
import { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  onPress: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onPress }) => {
  const subject = subjects.find((s) => s.id === question.subject) || subjects[7]; // Default to "Other"
  
  // Import the specific icon component dynamically
  const SubjectIcon = require('lucide-react-native')[subject.icon] || null;
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.subjectBadge, { backgroundColor: subject.color }]}>
          {SubjectIcon && <SubjectIcon size={16} color="#FFFFFF" />}
          <Text style={styles.subjectText}>{subject.name}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(question.timestamp).toLocaleDateString()}
        </Text>
      </View>
      
      <Text 
        style={styles.questionText}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {question.text}
      </Text>
      
      <View style={styles.footer}>
        {question.answered ? (
          <View style={styles.statusBadge}>
            <CheckCircle size={16} color={Colors.success} />
            <Text style={[styles.statusText, { color: Colors.success }]}>
              Answered
            </Text>
          </View>
        ) : (
          <View style={[styles.statusBadge, styles.pendingBadge]}>
            <Text style={[styles.statusText, { color: Colors.warning }]}>
              Waiting for answer...
            </Text>
          </View>
        )}
        
        <ArrowRight size={16} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  subjectText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  date: {
    fontSize: 12,
    color: Colors.textLight,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingBadge: {
    opacity: 0.7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default QuestionCard;