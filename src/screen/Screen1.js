import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';

export default function Screen1({ navigation }) {
  const [moveRight, setMoveRight] = useState(false);
  const animation = useRef(new Animated.Value(-800)).current; 
  useEffect(() => {
    async function animateAndNavigate() {
      if (moveRight) {
        Animated.timing(animation, {
          toValue: 800,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          navigation.navigate("House");
        });
      } else {
        Animated.timing(animation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }).start();
      }
    }
  
    animateAndNavigate();
  }, [moveRight]);
  
  const handleMoveRight = () => {
    setMoveRight(true);
  };

  const handleMoveCenter = () => {
    setMoveRight(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Awesome Ride</Text>
      <Animated.Image
        source={require('../img/bike (1).gif')}
        style={[
          styles.image,
          {
            transform: [
              {
                translateX: animation,
              },
            ],
          },
        ]}
      />
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleMoveRight}>
  <Text style={styles.buttonText}>Next</Text>
</TouchableOpacity>
   

      </View>
      <Text style={styles.prom}>Created by Umer Siddiqui</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: '800',
    color: '#070F2B',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#070F2B',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  prom: {
    fontSize: 20,
    fontWeight: '500',
    position: 'absolute',
    bottom: 50,
    color: '#070F2B',

  },
});
