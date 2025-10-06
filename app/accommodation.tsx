import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AccommodationScreen() {
  const [showLetters, setShowLetters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLetters(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {!showLetters && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
      )}

      {!showLetters && (
        <View style={styles.contentContainer}>
          <ThemedText style={styles.instruction}>
            Set the screen about 7 meters away
          </ThemedText>
        </View>
      )}

      {showLetters && (
        <>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          
          <View style={styles.landscapeContainer}>
            <ThemedText style={styles.letters}>
              QWERTYUIOPASDFGHJKLZXCVBNM
            </ThemedText>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instruction: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
  },
  landscapeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '90deg' }],
  },
  letters: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 8,
    lineHeight: 100,
    writingDirection: 'horizontal-tb',
  },
});
