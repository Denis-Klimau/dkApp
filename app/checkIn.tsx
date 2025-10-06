import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function CheckInScreen() {
  const [idNumber, setIdNumber] = useState('');
  
  const handleBack = () => {
    router.back();
  };

  const handleTextChange = (text: string) => {
    // Only allow numbers and limit to 6 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setIdNumber(numericText);
    
    // Navigate to timeline when 6th digit is filled
    if (numericText.length === 6) {
      router.push('/timeline');
    }
  };

  const renderDigitBoxes = () => {
    const digits = idNumber.split('');
    const boxes = [];
    
    for (let i = 0; i < 6; i++) {
      boxes.push(
        <View key={i} style={styles.digitBox}>
          <ThemedText style={styles.digitText}>{digits[i] || ''}</ThemedText>
        </View>
      );
    }
    
    return boxes;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.subtitle}>Check in</ThemedText>
      
      <View style={styles.inputContainer}>
        <View style={styles.digitBoxContainer}>
          {renderDigitBoxes()}
        </View>
        <TextInput
          style={styles.hiddenInput}
          value={idNumber}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          maxLength={6}
          autoFocus
        />
      </View>
      
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <ThemedText style={styles.backButtonText}>←</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: 40,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 30,
    paddingTop: 50,
  },
  inputContainer: {
    position: 'relative',
  },
  digitBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  digitBox: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    fontSize: 16,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
