import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Colors from '@/constants/colors';
import { ContentPart, Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const renderContent = () => {
    if (typeof message.content === 'string') {
      return <Text style={styles.text}>{message.content}</Text>;
    }
    
    return (message.content as ContentPart[]).map((part, index) => {
      if (part.type === 'text') {
        return <Text key={index} style={styles.text}>{part.text}</Text>;
      } else if (part.type === 'image') {
        return (
          <Image
            key={index}
            source={{ uri: part.image }}
            style={styles.image}
            contentFit="cover"
          />
        );
      }
      return null;
    });
  };
  
  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  assistantContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
  },
});

export default MessageBubble;