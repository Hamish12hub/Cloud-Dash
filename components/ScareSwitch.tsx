import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

interface Props {
  isMuted: boolean;
}

const ScareSwitch: React.FC<Props> = ({ isMuted }) => {
  useEffect(() => {
    playSound();
  }, []);

  const playSound = async () => {
    if (!isMuted) {
      try {
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync(require('../Sounds/scream.mp3'));
        await soundObject.playAsync();
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    }
  };

  return (
    <Image
      source={require('../assets/jumpScare.jpg')}
      style={styles.image}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default ScareSwitch;
