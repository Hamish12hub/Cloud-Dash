import React, { useEffect, useRef, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {Animated,Button,Dimensions,Easing,StyleSheet,Text,TouchableOpacity,
UIManager,View, findNodeHandle,Image, SwitchComponent, Switch} from 'react-native';
import Character from './Character';
import { saveHighScore, getHighScore, saveGamesPlayed, getGamesPlayed } from './HighScoreUtils';
import {playAudio}  from './SongPlayer';
import Icon from 'react-native-vector-icons/FontAwesome';
import ScareSwitch from './ScareSwitch';
import hitSound  from './hitSound';

const {height, width} = Dimensions.get('window')

function Game(): JSX.Element {

  const [game, setGame] = useState(false);
  const [character, setCharacter] = useState(false);
  const [IntroHeight, setIntroHeight] = useState(0.9);
  const [animation] = useState(new Animated.Value(height * 0.9));
  const [characterScore, setCharacterScore] = useState<number>(0);
  const [Gscore, GsetScore] = useState(0)
  const [highScoreText, setHighScoreText] = useState('0');
  const [gamesPlayed, setGamesPlayed] = useState(0);

  useEffect(() => {
    const fetchGamesPlayed = async () => {
      const count = await getGamesPlayed();
      if (count !== null) {
        setGamesPlayed(count);
      } else {
        setGamesPlayed(0);
      }
    };
    fetchGamesPlayed();
  }, []);

  const [isMuted, setIsMuted] = useState(false);
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const updateGamesPlayed = async () => {
    const updatedCount = gamesPlayed + 1;
    await saveGamesPlayed(updatedCount);
    setGamesPlayed(updatedCount);
  };

  useEffect(() => {
    const fetchHighScore = async () => {
      const highScore = await getHighScore();
      if (highScore !== null) {setHighScoreText(highScore);
      } else {setHighScoreText('0');
      }
    };
    fetchHighScore();
  }, []);

  const updateHighScore = async () => {
    const parsedHighScore = parseInt(highScoreText, 10);
    if (Gscore > parsedHighScore || highScoreText === '0') {
      await saveHighScore(Gscore + 1);
      setHighScoreText(Gscore.toString());
    }
  };

  function seteee(ggg: number) {
    setCharacterScore(ggg);
  }

  const handleStart = () => {
    GsetScore(0);
    setIntroHeight(IntroHeight === 0.9 ? 0.1 : 0.9);
    setTimeout(() => {
      setGame(true)
      setCharacter(!character);
      setTimeout(() => {
        setIsPaused(!isPaused);
      }, 2500); 
    }, 200); 
  };

  const handleStop = () => {
    if(!isDisplayed){scareForThreeSeconds()}
    if (!isMuted) {hitSound()}
    updateHighScore()
    updateGamesPlayed()
    setIsDisplayed(true);
    setIsEnabled(false)
    setIsPaused(!isPaused);
    setTimeout(() => {
      setIntroHeight(IntroHeight === 0.9 ? 0.1 : 0.9);
      setGame(false)
      setTimeout(() => {
        setCharacter(!character);
      }, 400); 
    }, 2000); 
  };

  useEffect(() => {
      Animated.timing(animation, {
        toValue: height * IntroHeight,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: false
      }).start();
  }, [IntroHeight]);


  const logScore = () => {
    if (!isMuted) {
       playAudio();
    }
    setTimeout(() => {
      GsetScore(Gscore + 1);
    }, 400);
  };
  
  const [pillarPosition] = useState(new Animated.Value(Dimensions.get('window').width));
  const [isPaused, setIsPaused] = useState(true);
  const [pillerScore, setPillerScore] = useState(85);

  const generateRandomScore = () => {
    setPillerScore(Math.floor(Math.random() * 85))
 };


  const characterScoreRef = useRef(characterScore);
  characterScoreRef.current = characterScore;
  
  useEffect(() => {
    const logInterval = setInterval(generateRandomScore, 2025);
    const animation = Animated.timing(pillarPosition, {
      toValue: -height * 0.06,
      duration: 1350,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    const pauseDuration = 675;
    const repeatAnimation = Animated.loop(
      Animated.sequence([animation, Animated.delay(pauseDuration)])
    );
    const listener = pillarPosition.addListener((position) => {
      const screenThresholdLeft = width * 0.01;
      const screenThresholdRight = width * 0.2;
      if (
        position.value <= screenThresholdRight &&
        position.value >= screenThresholdLeft
      ) {
        if (characterScoreRef.current * 0.9 < pillerScore || characterScoreRef.current * 0.9 > pillerScore + 4
        ) {handleStop();}else{logScore()}
      }
    });
  
    if (isPaused) {
      repeatAnimation.stop();
    } else {
      repeatAnimation.start();
    }
  
    return () => {
      clearInterval(logInterval);
      repeatAnimation.reset();
      pillarPosition.removeListener(listener);
    };
  }, [isPaused, pillerScore]);
  
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDisplayed, setIsDisplayed] = useState(true);
  
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    setTimeout(() => {
      setIsDisplayed(!isDisplayed);
    }, 1500); 
  };

  const [scare, setScare] = useState(false);
  const scareForThreeSeconds = () => {
    setScare(true);
    setTimeout(() => {
      setScare(false);
    }, 3000);
  };

  return (
    <>
    <View style={styles.container}>
      {!character ? (<></>) : (<Character setccc={seteee}/>)}
      <View style={styles.Pcontainer}>
      {isPaused ? (<></>) : (
<Animated.View style={[styles.pillar, { transform: [{ translateX: pillarPosition }] }]}>
  <Image
    source={require('../assets/brick.png')}
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: height * 0.8 }}
  />
  <View style={[styles.topPiller, { height: height * 0.2 }]} />
  <View style={[styles.bottomPiller, { height: (height * 0.6) * (pillerScore * 0.01) }]} />
  <View style={{ height: height * 0.08, width: '100%', backgroundColor: '#84E4F7' }} />
  <View style={[styles.bottomPiller, { height: height * 0.6 }]} />
</Animated.View>
)}
     </View>
    </View>
    <View style={[styles.OtherStyle, { height: game ? height * 0.2 : height * 1 }]}>
 <Animated.View style={[styles.Intro, { width: width * 0.9, height: animation }]}>
  {!game ? (
    <>
    <Text style={styles.TitleText}>Cloud Dash</Text>
     <Text style={styles.highScoreText}>High Score</Text>
     <Text style={styles.highScoreTextNumber}>{highScoreText}</Text>
<TouchableOpacity style={styles.startButton} onPress={handleStart}> 
        <Icon name={'play'} size={80} color="black" />
      </TouchableOpacity>
      <Text style={styles.gamesPlayedText}>Amount of games you have played: {gamesPlayed}</Text>
      <TouchableOpacity style={styles.iconButton} onPress={handleMuteToggle}>
        <Icon name={!isMuted ? 'volume-up' : 'volume-off'} size={30} color="black" />
      </TouchableOpacity>
         {isDisplayed ? (
         <View style={{ alignItems: 'center', flexDirection: 'row' }}><Text style={styles.scareText}>Press to scare a friend</Text>
         <Switch
           trackColor={{ false: '#767577', true: '#81b0ff' }}
           thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
           ios_backgroundColor="#3e3e3e"
           onValueChange={toggleSwitch}
           value={isEnabled}
         />
        </View>
        ) : (null)}
      </>
      ) : (
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
  <Text style={{ fontSize: 70, textAlign: 'center' }}>Score : {Gscore}</Text>
</View>
      )}
    </Animated.View> 
    </View> 

    {scare ? (<ScareSwitch isMuted={isMuted}/>) : (null)}
</>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    zInedx: 100,
    position: 'absolute',
  },
  Intro:{
  width: width * 0.9,
  backgroundColor: "white",
  top: height * 0.05,
  left: width * 0.05,
  position: 'absolute',
  borderColor: "black",
  borderRadius: 20,
  borderWidth: 5,
  alignItems: 'center',
  justifyContent: 'space-evenly',
},
  OtherStyle:{
    width: width,
    position: 'absolute',
  },
  Pcontainer: {
    height: height,
    width: width,
    zInedx: 100,
    position: 'absolute',
  },
  pillar: {
    width: height * 0.06,
    height: height * 0.8,
  },
  Pbutton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  PbuttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topPiller:{
    width: "100%",

  },
  bottomPiller:{
    width: "100%",
  },
  startButton: {
    width: width * 0.35,
    height: width * 0.25,
    backgroundColor: 'green',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  TitleText :{
    fontSize: 60,
    marginBottom: 10,
  },
  highScoreText: {
    fontSize: 40,
    marginBottom: 10,
  },
  highScoreTextNumber:{
    fontSize: 80,
    marginBottom: 10,
  },
  gamesPlayedText: {
    fontSize: 15,
    marginBottom: 10,
  },
  iconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  scareText: {
    fontSize: 20,
    marginBottom: 10,
  },
});
export default Game;