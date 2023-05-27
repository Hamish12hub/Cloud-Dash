import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Image,
} from "react-native";

const {height, width} = Dimensions.get('window');

interface Props {
  setccc: (number: number) => void;
}

function Character(props: Props): JSX.Element {
  const [score, setScore] = useState(50);
  
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);

  const barPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.8, width * 0.1],
  });

  const wheelPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.2, 0.],
  });

  useEffect(() => {
    props.setccc(score);
  }, [score]);

  const MAX_SIZE = 450;
  const wheelSize = width * 0.8;
  const size = Math.min(wheelSize, MAX_SIZE);
  const borderRadius = size * 0.4;
  
  const wheelStyles = {
    height: size,
    width: size,
    borderRadius: borderRadius,
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dx) > Math.abs(dy);
    },
    onPanResponderMove: (_, gestureState) => {
      const { dx } = gestureState;
      const distance = Math.abs(dx);
      const direction = dx > 0 ? 'right' : 'left';
      const step = Math.min(2, distance / 100) * (direction === 'right' ? 1 : -1);
      setScore(prevScore => Math.max(0, Math.min(100, prevScore + step * 30)));
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.middle}>

        <View style={styles.barContainer}>
          <Animated.View style={[styles.bar, { left: barPosition }]}>
             <Image source={require('../assets/character.png')} style={{...styles.character, top: `${score * 0.9}%`}} />
          </Animated.View>
        </View>
      </View>
      <View style={styles.bottom} {...panResponder.panHandlers}>
<Animated.Image source={require('../assets/wheel.png')} 
          style={[  wheelStyles,  {    transform: [{ rotate: `${score}deg` }],
    top: wheelPosition,
  },
]}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    zIndex: 100,
    position: 'absolute',
  },
  middle: {
    height: height * 0.8,
    width: width,
  },
  bottom: {
    height: height * 0.2,
    width: width,
    alignItems: 'center',
    paddingTop: width * 0.05,
  },
  wheel: {
    height: width * 0.8,
    width: width * 0.8,
    borderRadius: width * 0.4,
  },
  barContainer: {
    position: 'absolute',
    top: height * 0.2,
    left: 0,
    width: '100%',
    height: height * 0.6,
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: height * 0.06,
    zIndex: 100,
  },
  character: {
    width: height * 0.06,
    height: height * 0.06,
    backgroundColor: 'rgba(211, 211, 211, 1)',
  }  
});

export default Character;