import { Audio } from 'expo-av';

let isAudioPlaying = false;
let soundObject: Audio.Sound | null = null;
let audioPosition = 0;

export const playAudio = async () => {

  if (isAudioPlaying) {
    return;
  }

  isAudioPlaying = true;

  if (!soundObject) {
    soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../Sounds/piller.mp3'));
    } catch (error) {
      isAudioPlaying = false;
      return;
    }
  } else {
    try {
      await soundObject.setPositionAsync(0);
      audioPosition = 0;
    } catch (error) {
      isAudioPlaying = false;
      return;
    }
  }

  try {
    await soundObject.playAsync();
    await soundObject.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && !status.isBuffering) {
        audioPosition = status.positionMillis || 0;
        const audioDuration = status.durationMillis || 0;
        
        if (audioPosition >= audioDuration) {
          isAudioPlaying = false;
        }
      }
    });
  } catch (error) {
    isAudioPlaying = false;
  }
};

