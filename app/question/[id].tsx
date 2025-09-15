import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import Colors from '@/constants/colors';
import useQuestionsStore from '@/store/useQuestionsStore';
import useUserStore from '@/store/useUserStore';
import useShareFeatures from '@/hooks/useShareFeatures';
import subjects from '@/constants/subjects';
import MessageBubble from '@/components/MessageBubble';
import InputBar from '@/components/InputBar';
import SharePopup from '@/components/SharePopup';
import { ContentPart, Message } from '@/types';

export default function QuestionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { questions, messages, getMessagesForQuestion, addMessage, markQuestionAsAnswered } = useQuestionsStore();
  const { addPoints, addBadge } = useUserStore();
  const { showSharePopup, setShowSharePopup, showBadgeAchievement } = useShareFeatures();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessShare, setShowSuccessShare] = useState(false);
  
  const question = questions.find((q) => q.id === id);
  const questionMessages = getMessagesForQuestion(id || '');
  
  useEffect(() => {
    // If this is a new question with no assistant response yet, generate one
    if (
      question &&
      !question.answered &&
      questionMessages.length === 1 &&
      questionMessages[0].role === 'user'
    ) {
      handleAIResponse();
    }
  }, [question, questionMessages]);
  
  const handleAIResponse = async () => {
    if (!question || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Create system message
      const systemMessage = {
        role: 'system',
        content: `You are a helpful, friendly, and patient AI tutor for a student in grade ${8}. 
        Explain concepts clearly and step-by-step in a way that's easy to understand. 
        Be encouraging and supportive. If the student is asking about a homework problem, 
        guide them through the solution process rather than just giving the answer.
        Keep explanations concise but thorough.`,
      };
      
      // Get the user's question
      const userMessage = questionMessages[0];
      
      // Prepare messages for the API
      const apiMessages = [
        systemMessage,
        {
          role: userMessage.role,
          content: typeof userMessage.content === 'string'
            ? userMessage.content
            : (userMessage.content as ContentPart[]).map(part => {
                if (part.type === 'text') return part.text;
                return "[Image attached]";
              }).join('\n'),
        },
      ];
      
      // Make API request
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      
      // Create assistant message
      const assistantMessage: Message = {
        id: `message-${Date.now()}-assistant`,
        questionId: id || '',
        role: 'assistant',
        content: data.completion,
        timestamp: Date.now(),
      };
      
      // Add message to store
      addMessage(assistantMessage);
      
      // Mark question as answered
      markQuestionAsAnswered(id || '');
      
      // Add points for getting an answer
      addPoints(2);
      
      // Haptic feedback for answer
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Check if this is the first question answered
      if (questions.filter(q => q.answered).length === 1) {
        addBadge('first_question');
        
        // Show achievement popup after a delay
        setTimeout(() => {
          showBadgeAchievement('first_question');
        }, 1000);
      }
      
      // Show share success popup after 5 questions
      if (questions.filter(q => q.answered).length === 5) {
        setTimeout(() => {
          setShowSuccessShare(true);
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add a fallback message if the API fails
      const fallbackMessage: Message = {
        id: `message-${Date.now()}-assistant`,
        questionId: id || '',
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: Date.now(),
      };
      
      addMessage(fallbackMessage);
      
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = (text: string, imageUri?: string) => {
    if (!text.trim() && !imageUri) return;
    
    // Haptic feedback when sending message
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Create user message
    const userMessage: Message = {
      id: `message-${Date.now()}-user`,
      questionId: id || '',
      role: 'user',
      content: imageUri
        ? [
            { type: 'text' as const, text: text.trim() },
            { type: 'image' as const, image: imageUri },
          ]
        : text.trim(),
      timestamp: Date.now(),
    };
    
    // Add message to store
    addMessage(userMessage);
    
    // Trigger AI response
    handleAIResponse();
  };
  
  const handleShareQuestion = async () => {
    if (!question) return;
    
    if (Platform.OS === 'web') {
      // Web sharing
      if (navigator.share) {
        try {
          const subject = subjects.find((s) => s.id === question.subject)?.name || "homework";
          await navigator.share({
            title: "I got help with my homework!",
            text: `I just got help with my ${subject} question on AI Homework Helper! Check it out:`,
            url: "https://aihomeworkhelper.app",
          });
          
          // Add points for sharing
          addPoints(3);
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        // Copy to clipboard fallback
        const subject = subjects.find((s) => s.id === question.subject)?.name || "homework";
        navigator.clipboard.writeText(`I just got help with my ${subject} question on AI Homework Helper! Check it out: https://aihomeworkhelper.app`);
        alert('Link copied to clipboard!');
        
        // Add points for sharing
        addPoints(3);
      }
    } else {
      // Native sharing
      try {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        
        const isAvailable = await Sharing.isAvailableAsync();
        const subject = subjects.find((s) => s.id === question.subject)?.name || "homework";
        const shareMessage = `I just got help with my ${subject} question on AI Homework Helper! Check it out:`;
        
        if (isAvailable) {
          await Sharing.shareAsync("https://aihomeworkhelper.app", {
            dialogTitle: "Share Your Question",
            mimeType: 'text/plain',
            UTI: 'public.plain-text',
          });
          
          // Add points for sharing
          addPoints(3);
        } else {
          // Fallback
          await Share.share({
            title: "I got help with my homework!",
            message: shareMessage,
            url: "https://aihomeworkhelper.app",
          });
          
          // Add points for sharing
          addPoints(3);
        }
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [questionMessages]);
  
  if (!question) {
    return (
      <View style={styles.container}>
        <Text>Question not found</Text>
      </View>
    );
  }
  
  const subject = subjects.find((s) => s.id === question.subject) || subjects[7]; // Default to "Other"
  
  // Import the specific icon component dynamically
  const SubjectIcon = require('lucide-react-native')[subject.icon] || null;
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <View style={[styles.subjectBadge, { backgroundColor: subject.color }]}>
          {SubjectIcon && <SubjectIcon size={16} color="#FFFFFF" />}
          <Text style={styles.subjectText}>{subject.name}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(question.timestamp).toLocaleDateString()}
        </Text>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        <Text style={styles.questionText}>{question.text}</Text>
        
        {question.imageUri && (
          <Image
            source={{ uri: question.imageUri }}
            style={styles.questionImage}
            contentFit="cover"
          />
        )}
        
        {questionMessages.slice(1).map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} size="small" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>
      
      <InputBar 
        onSend={handleSendMessage} 
        placeholder="Ask a follow-up question..." 
        onShare={handleShareQuestion}
      />
      
      {/* Share Success Popup */}
      <SharePopup
        visible={showSuccessShare}
        onClose={() => setShowSuccessShare(false)}
        title="You're on a Roll!"
        message="You've successfully solved 5 questions with AI Homework Helper! Share your success with friends who might need help too."
        shareMessage="I've solved 5 homework problems with AI Homework Helper! It's like having a personal tutor 24/7. Try it out:"
        shareUrl="https://aihomeworkhelper.app"
      />
      
      {/* General Share Popup */}
      <SharePopup
        visible={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        title="Share Your Learning Journey"
        message="Let your friends know about AI Homework Helper so they can get help with their homework too!"
        shareMessage="I've been using AI Homework Helper for my studies and it's been amazing! It's like having a personal tutor 24/7. Check it out:"
        shareUrl="https://aihomeworkhelper.app"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  subjectText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  date: {
    fontSize: 14,
    color: Colors.textLight,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
});