//react components
import React, {useEffect} from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
//global
import {Colors, Constant, Images, ScreenNames} from 'global/Index';
//styles
import {styles} from './WelcomeStyle';
import {CommonActions} from '@react-navigation/native';
import MyText from 'components/MyText/MyText';
//third parties
import AsyncStorage from '@react-native-async-storage/async-storage';
//redux
import {useDispatch} from 'react-redux';
import {
  setUser,
  setUserToken,
  setUserNotifications,
} from 'src/reduxToolkit/reducer/user';
import LinearGradient from 'react-native-linear-gradient';
import MyButton from 'components/MyButton/MyButton';
import {width} from '../../../global/Constant';

const Welcome = ({navigation}) => {
  //variables : redux variables
  const dispatch = useDispatch();
  //function : navigation function
  const gotoSignUp = () => {
    navigation.navigate(ScreenNames.SIGN_UP);
  };
  const gotoLogin = () => {
    navigation.navigate(ScreenNames.LOGIN);
  };

  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <ImageBackground
        source={require('assets/images/welcome-bg.png')}
        style={styles.container}>
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.00)',
            'rgba(57, 42, 43, 0.5677)',
            'rgba(57, 42, 43, 1)',
          ]}
          useAngle
          angle={180}
          angleCenter={{x: 1, y: 0}}
          style={styles.gradient}>
          <View style={{marginBottom: 33, alignItems: 'center', padding: 20}}>
            <Image
              source={require('assets/images/logo.png')}
              style={{marginBottom: 20}}
            />
            <MyText
              text={'PERMANENT\nMAKEUP TRAINING'}
              fontSize={40}
              fontFamily="medium"
              textColor="white"
              textAlign="center"
            />
            <MyText
              text="Learn skills for your new career at Arkansas Permanent Cosmetics Institute, a school that truly cares."
              fontSize={18}
              fontFamily="medium"
              textColor="white"
              textAlign="center"
              style={{marginBottom: 20, marginTop: 20}}
            />
            <MyButton
              text="LOGIN"
              style={{width: width * 0.9, marginBottom: 10}}
              onPress={gotoLogin}
            />
            <MyButton
              text="SIGNUP"
              isWhite
              style={{width: width * 0.9}}
              onPress={gotoSignUp}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Welcome;
