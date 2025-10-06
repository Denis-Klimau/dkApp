import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TimelineScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);
  const lineFillAnimation = useRef(new Animated.Value(0)).current;
  const [expandedRectangles, setExpandedRectangles] = useState<Set<number>>(new Set());

  const handleRectanglePress = (index: number) => {
    if (index === 0) {
      // Navigate to preFlight chat screen
      router.push('/preFlight');
    } else if (index === 7) {
      // Navigate to inFlight chat screen
      router.push('/inFlight');
    } else if (index === 8) {
      // Navigate to arrived screen
      router.push('/arrived');
    } else if (index === 9) {
      // Navigate to checkUp screen
      router.push('/checkUp');
    } else if (index >= 1 && index <= 6) {
      // Toggle detailed view for small rectangles
      setExpandedRectangles(prev => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    }
  };


  useEffect(() => {
    const durations = [10000, 5000, 5000, 5000, 5000, 5000, 5000, 10000, 10000, 10000]; // 10s for big, 5s for small
    
    const animateToNext = (index: number) => {
      if (index >= 10) return; // Stop at the end
      
      currentIndex.current = index;
      const scrollToY = currentIndex.current * 500; // 500px per rectangle
      
      // Animate the line fill to reach the current rectangle
      const targetFillHeight = (currentIndex.current + 1) * 500; // Height to fill to reach current rectangle
      Animated.timing(lineFillAnimation, {
        toValue: targetFillHeight,
        duration: durations[index], // Use different duration for each rectangle
        useNativeDriver: false, // We need layout animations
      }).start();
      
      scrollViewRef.current?.scrollTo({
        y: scrollToY,
        animated: true,
      });
      
      // Schedule next animation
      setTimeout(() => {
        animateToNext(index + 1);
      }, durations[index]);
    };
    
    // Start the animation sequence
    animateToNext(0);

    // Reset animation after completing all rectangles
    const resetTimeout = setTimeout(() => {
      lineFillAnimation.setValue(0);
      currentIndex.current = 0;
      animateToNext(0);
    }, durations.reduce((sum, duration) => sum + duration, 0));

    return () => clearTimeout(resetTimeout);
  }, [lineFillAnimation]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        snapToInterval={500}
        snapToAlignment="start"
        decelerationRate="fast"
      >
        <View style={styles.timelineLineContainer}>
          <View style={styles.timelineLine} />
          <Animated.View 
            style={[
              styles.timelineLineFill,
              {
                height: lineFillAnimation,
              }
            ]} 
          />
        </View>
        {Array.from({ length: 10 }, (_, index) => {
          const getRectangleInfo = (index: number) => {
            const info = [
              { title: "Pre-Launch", subtitle: "Get ready for your pre-flight checks" },
              { title: "Liftoff", subtitle: "" },
              { title: "High G Period 1", subtitle: "Initial acceleration" },
              { title: "High G Period 2", subtitle: "(Max Q)" },
              { title: "Zero G", subtitle: "(Burnout)" },
              { title: "High G Period 3", subtitle: "(Stage 2 ignition)" },
              { title: "Zero G", subtitle: "(Sustained)" },
              { title: "In-flight", subtitle: "Sustaining comfort, activities, health checks" },
              { title: "Arrived", subtitle: "How to adapt, move, and recover" },
              { title: "Checkup", subtitle: "Health maintenance" },
            ];
            return info[index] || { title: `Rectangle ${index + 1}`, subtitle: "Unknown phase" };
          };

          const getDetailedText = (index: number) => {
            const detailedInfo = [
              "", // Index 0 - Pre-Launch (no detailed text needed)
              "Rocket engines ignite and you begin your journey to space.", // Index 1 - Liftoff
              "Experience high gravitational forces during initial acceleration phase.", // Index 2 - High G Period 1
              "Maximum dynamic pressure point during ascent - the most intense part.", // Index 3 - High G Period 2
              "First stage burnout - you'll experience brief weightlessness.", // Index 4 - Zero G
              "Second stage ignition continues your journey to orbit.", // Index 5 - High G Period 3
              "Sustained zero gravity as you enter stable orbit.", // Index 6 - Zero G
              "", // Index 7 - In-flight (no detailed text needed)
              "", // Index 8 - Arrived (no detailed text needed)
              "", // Index 9 - Checkup (no detailed text needed)
            ];
            return detailedInfo[index] || "Detailed information for this phase.";
          };

          const rectangleInfo = getRectangleInfo(index);
          const isExpanded = expandedRectangles.has(index);

          return (
            <TouchableOpacity 
              key={index} 
              style={index === 0 || index >= 7 ? styles.rectangle : styles.smallRectangle}
              onPress={() => handleRectanglePress(index)}
              activeOpacity={0.8}
            >
              {isExpanded ? (
                <View style={styles.textContainer}>
                  <Text style={index === 0 || index >= 7 ? styles.detailedText : styles.smallDetailedText}>
                    {getDetailedText(index)}
                  </Text>
                </View>
              ) : (
                <View style={styles.textContainer}>
                  <View style={styles.textContent}>
                    <Text style={index === 0 || index >= 7 ? styles.label : styles.smallLabel}>
                      {rectangleInfo.title}
                    </Text>
                    <Text style={index === 0 || index >= 7 ? styles.subtitle : styles.smallSubtitle}>
                      {rectangleInfo.subtitle}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 300,
    paddingBottom: 50,
    position: 'relative',
  },
  timelineLineContainer: {
    position: 'absolute',
    left: '50%',
    top: 300, // Start from the first rectangle
    width: 3,
    marginLeft: -1.5, // Center the line
    height: 4200, // Adjusted height to cover all 10 rectangles (9 gaps × 500px + 300px start)
  },
  timelineLine: {
    position: 'absolute',
    width: 3,
    backgroundColor: '#333',
    height: 4200,
    top: 0,
    left: 0,
  },
  timelineLineFill: {
    position: 'absolute',
    width: 3,
    backgroundColor: '#007AFF', // Blue color
    top: 0,
    left: 0,
  },
  rectangle: {
    width: 350,
    height: 190,
    backgroundColor: '#fff',
    borderRadius: 42,
    marginVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallRectangle: {
    width: 280,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 32,
    marginVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 24,
    color: '#000',
    fontFamily: 'Aldrich_400Regular',
  },
  smallLabel: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Aldrich_400Regular',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Aldrich_400Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  smallSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Aldrich_400Regular',
    marginTop: 2,
    textAlign: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  textContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailedText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Aldrich_400Regular',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  smallDetailedText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Aldrich_400Regular',
    textAlign: 'center',
    paddingHorizontal: 15,
    lineHeight: 20,
  },
});
