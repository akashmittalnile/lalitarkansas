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
import {styles} from './WelcomeHeaderStyle';
import MyText from '../MyText/MyText';
import {useNavigation} from '@react-navigation/native';

const WelcomeHeader = ({text, right = '45%'}) => {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={goBack}>
        <Image source={require('assets/images/arrow-left-black.png')} />
      </TouchableOpacity>
      <MyText
        text={text}
        fontSize={16}
        fontFamily="bold"
        textColor={'black'}
        textAlign="center"
        style={{position: 'absolute', right}}
      />
    </View>
  );
};

export default WelcomeHeader;
