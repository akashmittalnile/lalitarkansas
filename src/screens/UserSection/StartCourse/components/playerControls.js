import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {
  VideoSkipBack,
  VideoPause,
  VideoPlay,
  VideoSkipForward,
} from '../assets/icons';
import {AntDesign, Entypo, Fontisto} from '../../../../global/MyIcon';

const PlayerControls = props => {
  const {playing, onPlay, onPause, skipForwards, skipBackwards} = props;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.touchable} onPress={skipBackwards}>
        <Entypo name="back-in-time" color="white" size={50} />
        {/* <VideoSkipBack /> */}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.touchable}
        onPress={playing ? onPause : onPlay}>
        {playing ? (
          //   <VideoPause height="50" width="50" />
          <AntDesign name="pausecircleo" color="white" size={50} />
        ) : (
          //   <VideoPlay height="50" width="50" />
          <AntDesign name="playcircleo" color="white" size={50} />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.touchable} onPress={skipForwards}>
        <Fontisto name="spinner-rotate-forward" color="white" size={50} />
        {/* <VideoSkipForward /> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 3,
  },
  touchable: {
    padding: 5,
  },
  touchableDisabled: {
    opacity: 0.3,
  },
});

export default PlayerControls;
