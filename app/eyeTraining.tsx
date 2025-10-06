import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function EyeTrainingScreen() {
  const handleTrackingPress = () => {
    router.push('/miniGame');
  };

  const handleAccommodationPress = () => {
    router.push('/accommodation');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <TouchableOpacity 
          style={styles.block}
          onPress={handleTrackingPress}
        >
          <ThemedText style={styles.blockTitle}>Tracking</ThemedText>
          <ThemedText style={styles.blockDescription}>
            Exercises to improve eye movement coordination and follow moving objects smoothly
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.block}
          onPress={handleAccommodationPress}
        >
          <ThemedText style={styles.blockTitle}>Accommodation</ThemedText>
          <ThemedText style={styles.blockDescription}>
            Training to strengthen the eye's ability to focus between near and far distances
          </ThemedText>
        </TouchableOpacity>
      </View>
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
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  block: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 45,
    padding: 25,
    marginVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Aldrich_400Regular',
  },
  blockDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Aldrich_400Regular',
  },
});