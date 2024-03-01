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
import {styles} from './SuccessfulyPurchasedStyle';
import Modal from 'react-native-modal';
import MyButton from '../../components/MyButton/MyButton';
import {width} from '../../global/Constant';

const SuccessfulyPurchased = ({visible, setVisibility, gotoMyCourses}) => {
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
      // onBackdropPress={() => setVisibility(false)}
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
        <Image source={require('assets/images/tick-circle.png')} />
        <MyText
          text="Successfully Purchased!"
          textColor={Colors.THEME_GOLD}
          fontSize={24}
          fontFamily="medium"
          textAlign="center"
          style={{}}
        />
        <MyText
          text="Thank you for your purchase. You can now go to My Orders section and check the status."
          textColor={Colors.LIGHT_GREY}
          fontSize={18}
          fontFamily="regular"
          textAlign="center"
          style={{marginBottom: 20}}
        />
        <MyButton
          text="MY ORDERS"
          style={{
            width: width * 0.9,
            marginBottom: 10,
            backgroundColor: Colors.THEME_BROWN,
          }}
          onPress={gotoMyCourses}
        />
      </View>
      {/* </KeyboardAvoidingView> */}
    </Modal>
  );
};

export default SuccessfulyPurchased;
