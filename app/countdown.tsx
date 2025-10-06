import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

export default function CountdownScreen() {
  const [count, setCount] = useState(10);
  const [isCountingUp, setIsCountingUp] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (!isCountingUp && prevCount <= 1) {
          // Start animation when reaching 0
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
              toValue: 1300,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start();
          
          // Start counting up after animation
          setTimeout(() => {
            setIsCountingUp(true);
          }, 500);
          
          return 0;
        } else if (isCountingUp) {
          return prevCount + 1;
        } else {
          return prevCount - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [scaleAnim, translateYAnim, isCountingUp]);

  const handlePress = () => {
    router.push('/(tabs)');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Animated.Text 
        style={[
          styles.countdownText,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim }
            ]
          }
        ]}
      >
        {isCountingUp ? `+${count}` : count}
      </Animated.Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  countdownText: {
    fontSize: 150,
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
});
