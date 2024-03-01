import {Image, View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors, MyIcon} from 'global/Index';
import { responsiveWidth } from 'react-native-responsive-dimensions';

const FAB_Button = ({
  onPress = () => {},
  padding = 10,
  right = 0,
  bottom = 30,
  icon = <Image source={require('assets/images/message-text.png')} />,
  style = {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'absolute',
        right: right,
        bottom: bottom,
        backgroundColor: Colors.THEME_BROWN,
        justifyContent: 'center',
        alignItems: 'center',
        padding: padding,
        height: 59,
        width: 59,
        borderRadius: 59 / 2,
        ...style,
      }}>
      {icon}
      {/* <MyIcon.AntDesign name="plus" size={30} color={Colors.WHITE} /> */}
    </TouchableOpacity>
  );
};

export default FAB_Button;
