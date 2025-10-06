import { ThemedText } from '@/components/themed-text';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const handlePress = () => {
    router.push('/checkIn');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <ThemedText style={styles.text}>Welcome to your LEO journey</ThemedText>
      <ThemedText style={styles.clickText}>click anywhere</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 36,
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  clickText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
