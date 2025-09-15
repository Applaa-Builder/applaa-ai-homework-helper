import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  // Import the specific icon component dynamically
  const IconComponent = require('lucide-react-native')[icon] || null;
  
  return (
    <View style={styles.container}>
      {IconComponent && <IconComponent size={64} color={Colors.inactive} />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    maxWidth: '80%',
  },
});

export default EmptyState;