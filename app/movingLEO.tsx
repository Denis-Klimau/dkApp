import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function MovingLEOScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <ThemedText style={styles.title}>Moving in LEO</ThemedText>
        <ThemedText style={styles.subtitle}>Visual Walk-through</ThemedText>
        
        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View style={styles.imageContainer}>
              <Image
                source={require('@/assets/images/stpone.png')}
                style={styles.corridorImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepNumber}>Step 1</ThemedText>
              <ThemedText style={styles.stepDescription}>
                Move carefully through the space station using the handrails and grab bars for stability in zero gravity.
              </ThemedText>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.imageContainer}>
              <Image
                source={require('@/assets/images/stptwo.png')}
                style={styles.corridorImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepNumber}>Step 2</ThemedText>
              <ThemedText style={styles.stepDescription}>
                Push off the wall lightly to go where you need to. If you push off too hard, your inertia will take you too far and you can hurt yourself or cause damage.
              </ThemedText>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.imageContainer}>
              <Image
                source={require('@/assets/images/stpthree.png')}
                style={styles.corridorImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepNumber}>Step 3</ThemedText>
              <ThemedText style={styles.stepDescription}>
                Use controlled movements and maintain awareness of your surroundings while navigating in microgravity.
              </ThemedText>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.imageContainer}>
              <Image
                source={require('@/assets/images/stpfour.png')}
                style={styles.corridorImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepNumber}>Step 4</ThemedText>
              <ThemedText style={styles.stepDescription}>
                Practice proper body positioning and use your core muscles to maintain control during movement.
              </ThemedText>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.imageContainer}>
              <Image
                source={require('@/assets/images/stpfour2.png')}
                style={styles.corridorImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepNumber}>Step 4b</ThemedText>
              <ThemedText style={styles.stepDescription}>
                Advanced techniques for efficient movement and energy conservation in the space environment.
              </ThemedText>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.imageContainer}>
              <Image
                source={require('@/assets/images/stpfive.png')}
                style={styles.corridorImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.stepContent}>
              <ThemedText style={styles.stepNumber}>Step 5</ThemedText>
              <ThemedText style={styles.stepDescription}>
                Master the art of precise navigation and emergency movement techniques in zero gravity.
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.fullSizeImageContainer}>
          <Image
            source={require('@/assets/images/refferenceSheet.png')}
            style={styles.fullSizeImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
    paddingTop: 80,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    marginVertical: 20,
    borderRadius: 11,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  corridorImage: {
    width: 300,
    height: 200,
    borderRadius: 0,
  },
  fullSizeImageContainer: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  fullSizeImage: {
    width: '100%',
    height: 400,
  },
  stepsContainer: {
    width: '100%',
    marginVertical: 20,
  },
  stepItem: {
    marginBottom: 30,
    alignItems: 'center',
  },
  stepContent: {
    marginTop: 15,
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
