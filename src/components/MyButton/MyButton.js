//react components
import React, { useEffect } from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
//global
import { Colors, Constant, Images, ScreenNames } from 'global/Index';
//styles
import { styles } from './MyButtonStyle';
import MyText from '../MyText/MyText';

const MyButton = ({
  text,
  onPress,
  isWhite = false,
  style = {},
  isIcon = false,
  icon,
  textColor = 'white',
  disabled = false,
}) => {
  const pressHandler = () => {
    if (disabled) {
      return;
    }
    onPress();
  };
  // console.log('text textColor', text, textColor);
  return (
    <TouchableOpacity
      onPress={pressHandler}
      activeOpacity={disabled ? 1 : 0.5}
      style={[
        styles.container,
        style,
        isWhite ? { backgroundColor: 'white' } : null,
      ]}>
      {isIcon ? <Image source={icon} style={{ marginRight: 14 }} /> : null}
      <MyText
        text={text}
        fontSize={14}
        fontFamily="medium"
        textColor={isWhite ? Colors.THEME_BROWN : textColor}
        textAlign="center"
      />
    </TouchableOpacity>
  );
};

export default MyButton;
