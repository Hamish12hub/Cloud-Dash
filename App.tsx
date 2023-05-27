// import React, { useState, useEffect } from 'react';
// import Game from './components/Game';
// import { Dimensions, StyleSheet, View } from 'react-native';

// const {height, width} = Dimensions.get('window')

// function App(): JSX.Element {

//   return (
//     <View style={styles.container}>
//       <Game />
//       <View style={styles.bottom}></View>
//     </View>
//   );
// }

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     height: height,
//     width: width,
//     backgroundColor: "#84E4F7",
//   },
//   bottom: {
//     height: height * 0.2,
//     width: width,
//     backgroundColor: 'green',
//   },
// });


import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import { Dimensions, StyleSheet, View } from 'react-native';

const { height, width } = Dimensions.get('window');

function App(): JSX.Element {
  return (
    <View style={styles.container}>
      <Game />
      <View style={styles.bottom}></View>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: '#84E4F7',
    position: 'relative', // Added
  },
  bottom: {
    position: 'absolute', // Added
    bottom: 0, // Added
    height: height * 0.2,
    width: width,
    backgroundColor: 'green',
    zIndex: -1, // Added
  },
});
