import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function MuscleMaintenanceScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to your muscle maintenance session! I'm your specialized microgravity fitness trainer. What specific muscle groups or exercises would you like help with today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingDots, setTypingDots] = useState('');
  const [referenceContent, setReferenceContent] = useState('');

  // Fetch reference content on component mount
  useEffect(() => {
    const fetchReferenceContent = async () => {
      try {
        // Fetch NASA bone and muscle loss article
        const nasaResponse = await fetch('https://www.nasa.gov/missions/station/iss-research/counteracting-bone-and-muscle-loss-in-microgravity/');
        const nasaText = await nasaResponse.text();
        
        // Fetch Canadian Space Agency physical activity guide
        const csaResponse = await fetch('https://www.asc-csa.gc.ca/eng/astronauts/living-in-space/physical-activity-in-space.asp');
        const csaText = await csaResponse.text();
        
        // Combine the reference content
        const combinedContent = `
REFERENCE MATERIALS:

NASA - COUNTERACTING BONE AND MUSCLE LOSS IN MICROGRAVITY:
${nasaText.substring(0, 4000)}...

CANADIAN SPACE AGENCY - PHYSICAL ACTIVITY IN SPACE:
${csaText.substring(0, 3000)}...
        `;
        
        setReferenceContent(combinedContent);
      } catch (error) {
        console.error('Error fetching reference content:', error);
        // Fallback content if fetching fails
        setReferenceContent(`
REFERENCE MATERIALS:
- NASA research on counteracting bone and muscle loss in microgravity
- Canadian Space Agency guidelines for physical activity in space
- Advanced Resistive Exercise Device (ARED) specifications
- VR exercise programs and tissue chip research
        `);
      }
    };

    fetchReferenceContent();
  }, []);

  // Animate typing dots
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setTypingDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setTypingDots('');
    }
  }, [isLoading]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const requestBody = {
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: `You are a specialized microgravity fitness trainer for astronauts in space. Provide BRIEF, initial responses about muscle maintenance and exercise routines. Don't overwhelm with all details at once - give a basic answer and encourage follow-up questions. Keep responses concise, encouraging, and conversational.

${referenceContent}

Use this reference material to provide accurate information when asked for details, but always start with brief responses and encourage follow-up questions like "Would you like specific exercises for..." or "What muscle group concerns you most?"`
          },
          ...messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          })),
          {
            role: 'user',
            content: currentInput
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      };

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY_HERE',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.choices[0].message.content,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I received an unexpected response. Please try again.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I'm having trouble connecting right now. Please try again later.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Muscle Maintenance</ThemedText>
        <View style={styles.headerSpacer} />
      </ThemedView>

      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.botMessage
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.botMessageText
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about microgravity workouts..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={inputText.trim() ? "#fff" : "#999"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Aldrich_400Regular',
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#fff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 0.4,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Aldrich_400Regular',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#555',
  },
});
