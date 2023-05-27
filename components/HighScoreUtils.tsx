import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveHighScore = async (score: number) => {
  try {
    await AsyncStorage.setItem('highScore', score.toString());
    console.log('High score saved successfully!');
  } catch (error) {
    console.log('Error saving high score:', error);
  }
};

export const getHighScore = async (): Promise<string | null> => {
  try {
    const highScore = await AsyncStorage.getItem('highScore');
    if (highScore !== null) {
      console.log('High score:', highScore);
      return highScore;
    } else {
      console.log('High score not found.');
      return null;
    }
  } catch (error) {
    console.log('Error retrieving high score:', error);
    return null;
  }
};

export const saveGamesPlayed = async (gamesPlayed: number) => {
  try {
    await AsyncStorage.setItem('gamesPlayed', gamesPlayed.toString());
  } catch (error) {
  }
};

export const getGamesPlayed = async (): Promise<number | null> => {
  try {
    const gamesPlayed = await AsyncStorage.getItem('gamesPlayed');
    if (gamesPlayed !== null) {
      const parsedGamesPlayed = parseInt(gamesPlayed, 10);
      return parsedGamesPlayed;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
