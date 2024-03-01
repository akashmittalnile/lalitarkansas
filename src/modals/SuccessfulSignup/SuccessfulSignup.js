//import : react components
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import : custom components
import MyText from 'components/MyText/MyText';
//import : globals
import {Colors, Constant, MyIcon, ScreenNames} from 'global/Index';
//import : styles
import {styles} from './SuccessfulSignupStyle';
import Modal from 'react-native-modal';
import MyButton from '../../components/MyButton/MyButton';
import {width} from '../../global/Constant';

const SuccessfulSignup = ({visible, setVisibility, gotoLogin}) => {
  //variables : navigation
  const navigation = useNavigation();
  //function : navigation function
  //function : modal function
  const closeModal = () => {
    setVisibility(false);
  };
  //UI
  return (
    <Modal
      isVisible={visible}
      // swipeDirection="down"
      onBackdropPress={() => {
        // setVisibility(false)
      }}
      onSwipeComplete={e => {
        setVisibility(false);
      }}
      scrollTo={() => {}}
      scrollOffset={1}
      propagateSwipe={true}
      coverScreen={false}
      backdropColor="transparent"
      style={styles.modal}>
      {/* <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
      <View style={styles.modalContent}>
        <MyText
          text="Great!"
          textColor={Colors.THEME_GOLD}
          fontSize={24}
          fontFamily="medium"
          textAlign="center"
          style={{}}
        />
        <MyText
          text="You Have Successfully Signed Up"
          textColor={Colors.LIGHT_GREY}
          fontSize={18}
          fontFamily="regular"
          textAlign="center"
          style={{}}
        />
        <Image
          source={require('assets/images/signup-success-bg.png')}
          style={{marginBottom: 10, marginTop: 15, width: '100%'}}
          resizeMode="contain"
        />
        <MyButton
          text="Login"
          style={{
            width: width * 0.9,
            marginBottom: 10,
            backgroundColor: Colors.THEME_BROWN,
          }}
          onPress={gotoLogin}
        />
      </View>
      {/* </KeyboardAvoidingView> */}
    </Modal>
  );
};

export default SuccessfulSignup;
