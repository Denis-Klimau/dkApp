import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
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

export default function ArrivedScreen() {
  const [selectedSense, setSelectedSense] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSensePress = async (sense: string) => {
    setSelectedSense(sense);
    setIsLoading(true);

    // Create more specific system prompts for different senses
    let systemPrompt: string;
    let userMessage: string;
    
    switch (sense) {
      case 'Internal pressure':
        systemPrompt = `You are a helpful assistant for astronauts who have just arrived in Low Earth Orbit (LEO). The user is asking about dealing with changes in internal body pressure (like ear pressure, sinus pressure, blood pressure, and other internal pressure changes that occur in microgravity). Provide BRIEF, practical advice and tips. Keep responses concise and encouraging. Always end with a question to encourage follow-up.`;
        userMessage = `I need help dealing with internal pressure changes (like ear pressure, sinus pressure) now that I've arrived in LEO.`;
        break;
      case 'Zero g':
        systemPrompt = `You are a helpful assistant for astronauts who have just arrived in Low Earth Orbit (LEO). The user is asking about dealing with changes in zero gravity/microgravity. Provide BRIEF, practical advice and tips. Keep responses concise and encouraging. Always end with a question to encourage follow-up.`;
        userMessage = `I need help dealing with zero gravity/microgravity now that I've arrived in LEO.`;
        break;
      case 'Smell':
        systemPrompt = `You are a helpful assistant for astronauts who have just arrived in Low Earth Orbit (LEO). The user is asking about dealing with changes in smell/taste perception in space. Provide BRIEF, practical advice and tips. Keep responses concise and encouraging. Always end with a question to encourage follow-up.`;
        userMessage = `I need help dealing with smell/taste changes now that I've arrived in LEO.`;
        break;
      case 'Motion sickness':
        systemPrompt = `You are a helpful assistant for astronauts who have just arrived in Low Earth Orbit (LEO). The user is asking about dealing with motion sickness/space adaptation syndrome. Provide BRIEF, practical advice and tips. Keep responses concise and encouraging. Always end with a question to encourage follow-up.`;
        userMessage = `I need help dealing with motion sickness/space adaptation syndrome now that I've arrived in LEO.`;
        break;
      default:
        systemPrompt = `You are a helpful assistant for astronauts who have just arrived in Low Earth Orbit (LEO). The user is asking about dealing with changes in ${sense.toLowerCase()}. Provide BRIEF, practical advice and tips. Keep responses concise and encouraging. Always end with a question to encourage follow-up.`;
        userMessage = `I need help dealing with changes in ${sense.toLowerCase()} now that I've arrived in LEO.`;
    }

    try {
      const requestBody = {
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 300,
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

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0]) {
          const grokMessage: Message = {
            id: Date.now().toString(),
            text: data.choices[0].message.content,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages([grokMessage]);
        }
      }
    } catch (error) {
      console.error('Error calling Grok API:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `I'm here to help with ${sense.toLowerCase()} issues in LEO. What specific problem are you experiencing?`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
      // Create specific system prompt for follow-up messages
      let followUpSystemPrompt: string;
      switch (selectedSense) {
        case 'Internal pressure':
          followUpSystemPrompt = `You are a helpful assistant for astronauts in Low Earth Orbit (LEO) dealing with internal body pressure issues (like ear pressure, sinus pressure, blood pressure). Provide BRIEF, practical advice. Keep responses concise and encouraging.`;
          break;
        case 'Zero g':
          followUpSystemPrompt = `You are a helpful assistant for astronauts in Low Earth Orbit (LEO) dealing with zero gravity/microgravity issues. Provide BRIEF, practical advice. Keep responses concise and encouraging.`;
          break;
        case 'Smell':
          followUpSystemPrompt = `You are a helpful assistant for astronauts in Low Earth Orbit (LEO) dealing with smell/taste perception issues. Provide BRIEF, practical advice. Keep responses concise and encouraging.`;
          break;
        case 'Motion sickness':
          followUpSystemPrompt = `You are a helpful assistant for astronauts in Low Earth Orbit (LEO) dealing with motion sickness/space adaptation syndrome. Provide BRIEF, practical advice. Keep responses concise and encouraging.`;
          break;
        default:
          followUpSystemPrompt = `You are a helpful assistant for astronauts in Low Earth Orbit (LEO) dealing with ${selectedSense?.toLowerCase() || 'space adaptation'} issues. Provide BRIEF, practical advice. Keep responses concise and encouraging.`;
      }

      const requestBody = {
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: followUpSystemPrompt
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
        max_tokens: 300,
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

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0]) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: data.choices[0].message.content,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, botMessage]);
        }
      }
    } catch (error) {
      console.error('Error calling Grok API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const senses = ['Zero g', 'Smell', 'Internal pressure', 'Motion sickness'];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>

      {!selectedSense ? (
        <View style={styles.welcomeContainer}>
          <ThemedText style={styles.title}>Welcome to LEO!</ThemedText>
          <ThemedText style={styles.subtitle}>
            Here are some tips to help you deal with changes in:
          </ThemedText>
          
          <View style={styles.sensesContainer}>
            {senses.map((sense, index) => (
              <TouchableOpacity
                key={index}
                style={styles.senseButton}
                onPress={() => handleSensePress(sense)}
              >
                <ThemedText style={styles.senseText}>{sense}</ThemedText>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.visualWalkthroughButton}
              onPress={() => router.push('/movingLEO')}
            >
              <ThemedText style={styles.visualWalkthroughTitle}>Moving in LEO</ThemedText>
              <ThemedText style={styles.visualWalkthroughSubtitle}>visual walk-through</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity 
              style={styles.backToMenu}
              onPress={() => {
                setSelectedSense(null);
                setMessages([]);
              }}
            >
              <ThemedText style={styles.backToMenuText}>← Back to menu</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.chatTitle}>Dealing with {selectedSense}</ThemedText>
          </View>

          <ScrollView style={styles.messagesContainer}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isUser ? styles.userMessage : styles.botMessage
                ]}
              >
                <ThemedText
                  style={[
                    styles.messageText,
                    message.isUser ? styles.userMessageText : styles.botMessageText
                  ]}
                >
                  {message.text}
                </ThemedText>
              </View>
            ))}
            
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ThemedText style={styles.loadingText}>Thinking...</ThemedText>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask a follow-up question..."
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons name="send" size={20} color={inputText.trim() && !isLoading ? '#007AFF' : '#666'} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  sensesContainer: {
    width: '100%',
    gap: 15,
  },
  senseButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  senseText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  visualWalkthroughButton: {
    backgroundColor: '#000',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 5,
  },
  visualWalkthroughTitle: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  visualWalkthroughSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
  },
  chatContainer: {
    flex: 1,
    paddingTop: 80,
  },
  chatHeader: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backToMenu: {
    marginBottom: 10,
  },
  backToMenuText: {
    fontSize: 16,
    color: '#007AFF',
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#000',
  },
  loadingContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
