import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import useUserStore from '@/store/useUserStore';
import subjects from '@/constants/subjects';
import SubjectButton from '@/components/SubjectButton';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setProfile, setOnboarded } = useUserStore();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const toggleSubject = (subjectId: string) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };
  
  const isStepValid = () => {
    switch (step) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return age.trim().length > 0 && grade.trim().length > 0;
      case 3:
        return selectedSubjects.length > 0;
      default:
        return false;
    }
  };
  
  const completeOnboarding = () => {
    // Create user profile
    setProfile({
      name,
      age: parseInt(age, 10),
      grade: parseInt(grade, 10),
      subjects: selectedSubjects,
      points: 0,
      streak: 0,
      lastActive: new Date().toISOString().split('T')[0],
      badges: [],
    });
    
    setOnboarded(true);
    router.replace('/');
  };
  
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Welcome to AI Homework Helper!</Text>
      <Text style={styles.stepDescription}>
        Let's get to know you better so we can personalize your learning experience.
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>What's your name?</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={Colors.textLight}
          autoFocus
        />
      </View>
    </View>
  );
  
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      <Text style={styles.stepDescription}>
        This helps us tailor explanations to your grade level.
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>How old are you?</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
          placeholderTextColor={Colors.textLight}
          keyboardType="number-pad"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>What grade are you in?</Text>
        <TextInput
          style={styles.input}
          value={grade}
          onChangeText={setGrade}
          placeholder="Enter your grade (1-12)"
          placeholderTextColor={Colors.textLight}
          keyboardType="number-pad"
        />
      </View>
    </View>
  );
  
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select your subjects</Text>
      <Text style={styles.stepDescription}>
        Choose the subjects you need help with. You can select multiple.
      </Text>
      
      <ScrollView style={styles.subjectsContainer}>
        {subjects.map((subject) => (
          <SubjectButton
            key={subject.id}
            name={subject.name}
            icon={subject.icon}
            color={subject.color}
            selected={selectedSubjects.includes(subject.id)}
            onPress={() => toggleSubject(subject.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]}
          />
        </View>
        <Text style={styles.progressText}>Step {step} of 3</Text>
      </View>
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      
      <View style={styles.buttonsContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <ArrowLeft size={20} color={Colors.text} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.nextButton, !isStepValid() && styles.disabledButton]}
          onPress={handleNext}
          disabled={!isStepValid()}
        >
          <Text style={styles.nextButtonText}>
            {step === 3 ? "Get Started" : "Next"}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  progressContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'right',
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subjectsContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: Colors.inactive,
  },
});