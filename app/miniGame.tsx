import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export default function MiniGameScreen() {
  const [gameState, setGameState] = useState<'ready' | 'playing'>('ready');

  // Ball properties
  const ballPosition = useRef(new Animated.ValueXY({ x: WIDTH / 2, y: HEIGHT / 2 })).current;
  const ballVelocity = useRef({ x: 2, y: -3 });
  const ballRadius = 15;

  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (gameState === 'ready') {
      const timer = setTimeout(() => {
        setGameState('playing');
        startGame();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const startGame = () => {
    const gameLoop = () => {
      // Update ball position
      const currentBallX = ballPosition.x._value;
      const currentBallY = ballPosition.y._value;

      let newBallX = currentBallX + ballVelocity.current.x;
      let newBallY = currentBallY + ballVelocity.current.y;

      // Ball bounces off screen edges (like your paddle logic)
      if (newBallX - ballRadius < 0) {
        ballVelocity.current.x = -ballVelocity.current.x;
        newBallX = ballRadius;
      } else if (newBallX + ballRadius > WIDTH) {
        ballVelocity.current.x = -ballVelocity.current.x;
        newBallX = WIDTH - ballRadius;
      }

      if (newBallY - ballRadius < 100) { // Top boundary (accounting for header)
        ballVelocity.current.y = -ballVelocity.current.y;
        newBallY = 100 + ballRadius;
      } else if (newBallY + ballRadius > HEIGHT) { // Floor boundary
        ballVelocity.current.y = -ballVelocity.current.y;
        newBallY = HEIGHT - ballRadius;
      }

      // Update ball position
      ballPosition.setValue({ x: newBallX, y: newBallY });

      // Continue the loop
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();
  };


  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>

      {gameState === 'ready' && (
        <View style={styles.readyContainer}>
          <Animated.Text style={styles.readyText}>Ready</Animated.Text>
        </View>
      )}

      {gameState === 'playing' && (
        <View style={styles.gameContainer}>
          {/* Ball */}
          <Animated.View
            style={[
              styles.ball,
              {
                transform: [
                  { translateX: ballPosition.x },
                  { translateY: ballPosition.y }
                ]
              }
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 8,
    zIndex: 1,
  },
  readyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readyText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  gameContainer: {
    flex: 1,
    position: 'relative',
  },
  ball: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00FFFF',
  },
});