import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { Image as ImageIcon, X, Mic, Send, Share } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

interface InputBarProps {
  onSend: (text: string, imageUri?: string) => void;
  placeholder?: string;
  onShare?: () => void;
}

const InputBar: React.FC<InputBarProps> = ({
  onSend,
  placeholder = "Ask your question...",
  onShare,
}) => {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  
  const handleSend = () => {
    if (text.trim() || imageUri) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      onSend(text, imageUri);
      setText('');
      setImageUri(undefined);
    }
  };
  
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };
  
  const handleShare = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (onShare) {
      onShare();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          multiline
        />
        
        {imageUri ? (
          <TouchableOpacity
            style={styles.imageIndicator}
            onPress={() => setImageUri(undefined)}
          >
            <ImageIcon size={16} color={Colors.primary} />
            <X 
              size={12} 
              color={Colors.primary} 
              style={styles.removeIcon} 
            />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={pickImage}
          disabled={!!imageUri}
        >
          <ImageIcon
            size={20}
            color={imageUri ? Colors.inactive : Colors.primary}
          />
        </TouchableOpacity>
        
        {Platform.OS !== 'web' && (
          <TouchableOpacity style={styles.button}>
            <Mic size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
        
        {onShare && (
          <TouchableOpacity 
            style={styles.button}
            onPress={handleShare}
          >
            <Share size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!text.trim() && !imageUri) && styles.disabledButton,
          ]}
          onPress={handleSend}
          disabled={!text.trim() && !imageUri}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    color: Colors.text,
  },
  imageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}20`,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.inactive,
  },
});

export default InputBar;