import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CheckUpScreen() {
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>

      <View style={styles.blocksContainer}>
        <ThemedText style={styles.title}>Checkup</ThemedText>

        <TouchableOpacity
          style={styles.block}
          onPress={() => router.push('/muscleMaintenance')}
        >
          <ThemedText style={styles.blockText}>Muscle maintenance</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.block}
          onPress={() => router.push('/eyeTraining')}
        >
          <ThemedText style={styles.blockText}>Eyesight training</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  blocksContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  block: {
    width: '80%',
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blockText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
});