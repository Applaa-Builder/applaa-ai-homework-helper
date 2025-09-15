import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/colors';

interface SubjectButtonProps {
  name: string;
  icon: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}

const SubjectButton: React.FC<SubjectButtonProps> = ({
  name,
  icon,
  color,
  selected,
  onPress,
}) => {
  // Import the specific icon component dynamically
  const IconComponent = require('lucide-react-native')[icon] || null;
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
        { borderColor: color },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        {IconComponent && <IconComponent size={20} color="#FFFFFF" />}
      </View>
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedContainer: {
    backgroundColor: `${Colors.primary}10`,
    borderWidth: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
});

export default SubjectButton;