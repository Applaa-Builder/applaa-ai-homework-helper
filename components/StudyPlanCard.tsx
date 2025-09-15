import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, CheckCircle, Circle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { StudyPlan } from '@/types';

interface StudyPlanCardProps {
  plan: StudyPlan;
  onToggleTask: (taskId: string) => void;
}

const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ plan, onToggleTask }) => {
  const completedTasks = plan.tasks.filter((task) => task.completed).length;
  const totalTasks = plan.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const formatDate = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (date === today) return 'Today';
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.date}>{formatDate(plan.date)}</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {completedTasks}/{totalTasks}
          </Text>
          <Text style={styles.progressLabel}>Tasks</Text>
        </View>
      </View>
      
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${progress}%` }]}
        />
      </View>
      
      <View style={styles.taskList}>
        {plan.tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskItem}
            onPress={() => onToggleTask(task.id)}
          >
            {task.completed ? (
              <CheckCircle size={20} color={Colors.success} />
            ) : (
              <Circle size={20} color={Colors.primary} />
            )}
            <View style={styles.taskContent}>
              <Text
                style={[
                  styles.taskText,
                  task.completed && styles.completedTaskText,
                ]}
              >
                {task.text}
              </Text>
              {task.subject && (
                <View style={styles.taskSubject}>
                  {/* Import the specific icon component dynamically */}
                  {(() => {
                    const SubjectIcon = require('lucide-react-native')[task.subjectIcon] || null;
                    return SubjectIcon ? (
                      <SubjectIcon size={12} color={task.subjectColor} />
                    ) : null;
                  })()}
                  <Text
                    style={[
                      styles.subjectText,
                      { color: task.subjectColor },
                    ]}
                  >
                    {task.subject}
                  </Text>
                </View>
              )}
            </View>
            <Calendar size={16} color={Colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.textLight,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
    marginLeft: 12,
  },
  taskText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },
  taskSubject: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default StudyPlanCard;