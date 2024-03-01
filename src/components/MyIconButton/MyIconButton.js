//react components
import React, {useEffect} from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
//global
import {Colors, Constant, Images, ScreenNames} from 'global/Index';
//styles
import {styles} from './MyIconButtonStyle';
import MyText from '../MyText/MyText';

const MyIconButton = ({
  text,
  onPress,
  isWhite = false,
  style = {},
  isIcon = false,
  icon,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      {isIcon ? <Image source={icon} style={{marginRight: 14}} /> : null}
      <MyText
        text={text}
        fontSize={14}
        fontFamily="medium"
        textColor={Colors.LIGHT_GREY}
        textAlign="center"
      />
    </TouchableOpacity>
  );
};

export default MyIconButton;
