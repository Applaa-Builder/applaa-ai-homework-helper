import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HelpCircle, Image as ImageIcon, Check, X, Lightbulb } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Colors from '@/constants/colors';
import subjects from '@/constants/subjects';
import useQuestionsStore from '@/store/useQuestionsStore';
import useUserStore from '@/store/useUserStore';
import SubjectButton from '@/components/SubjectButton';
import InputBar from '@/components/InputBar';

export default function AskScreen() {
  const router = useRouter();
  const { addQuestion, addMessage } = useQuestionsStore();
  const { addPoints } = useUserStore();
  
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [question, setQuestion] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };
  
  const handleSubmit = async (text: string, image?: string) => {
    if ((!text.trim() && !image) || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Create a new question
      const newQuestion = {
        id: `question-${Date.now()}`,
        text: text.trim(),
        subject: selectedSubject,
        timestamp: Date.now(),
        imageUri: image,
        answered: false,
      };
      
      // Add the question to the store
      const questionId = addQuestion(newQuestion);
      
      // Create user message
      const userMessage = {
        id: `message-${Date.now()}-user`,
        questionId,
        role: 'user' as const,
        content: image
          ? [
              { type: 'text' as const, text: text.trim() },
              { type: 'image' as const, image },
            ]
          : text.trim(),
        timestamp: Date.now(),
      };
      
      // Add user message
      addMessage(userMessage);
      
      // Add points for asking a question
      addPoints(1);
      
      // Navigate to the question detail screen
      router.push(`/question/${questionId}`);
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setIsSubmitting(false);
      setQuestion('');
      setImageUri(undefined);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ask Your Homework Question</Text>
        <Text style={styles.subtitle}>
          Get step-by-step help with any homework problem
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Subject</Text>
          <View style={styles.subjectList}>
            {subjects.map((subject) => (
              <SubjectButton
                key={subject.id}
                name={subject.name}
                icon={subject.icon}
                color={subject.color}
                selected={selectedSubject === subject.id}
                onPress={() => handleSubjectSelect(subject.id)}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Homework Image</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImagePick}
          >
            {imageUri ? (
              <View style={styles.imagePreviewContainer}>
                <Text style={styles.imagePreviewText}>Image Selected</Text>
                <Check size={20} color={Colors.success} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImageUri(undefined)}
                >
                  <X size={16} color={Colors.text} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <ImageIcon size={24} color={Colors.primary} />
                <Text style={styles.uploadText}>
                  Tap to upload a photo of your homework
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.tipContainer}>
          <Lightbulb size={20} color={Colors.warning} />
          <Text style={styles.tipText}>
            Tip: For math problems, try to write your question clearly or upload a clear image of the problem.
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <InputBar
          onSend={handleSubmit}
          placeholder="Type your homework question..."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 24,
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
  subjectList: {
    gap: 8,
  },
  uploadButton: {
    height: 120,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}10`,
  },
  uploadText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePreviewText: {
    fontSize: 16,
    color: Colors.success,
    marginRight: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: `${Colors.warning}15`,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});