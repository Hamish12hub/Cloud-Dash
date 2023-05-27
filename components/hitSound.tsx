import { Audio } from 'expo-av';

const playSound = async () => {
  try {
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync(require('../Sounds/hit.mp3'));
    await soundObject.playAsync();
  } catch (error) {
    console.log('Failed to play the sound', error);
  }
};

export default playSound;
