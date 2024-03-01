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
import {styles} from './CourseNotPurshasedModalStyle';
import Modal from 'react-native-modal';
import MyButton from '../../components/MyButton/MyButton';
import {width} from '../../global/Constant';

const CourseNotPurshasedModal = ({
  visible,
  setVisibility,
}) => {
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
      swipeDirection="down"
      onBackdropPress={() => setVisibility(false)}
      onSwipeComplete={e => {
        setVisibility(false);
      }}
      onModalHide={() => {}}
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
        <Image source={require('assets/images/prereq-not-completed.png')} />
        <MyText
          text="You have not purchased this course"
          textColor={Colors.THEME_GOLD}
          fontSize={24}
          fontFamily="medium"
          textAlign="center"
          style={{}}
        />
        <MyText
          text={`To access chapter contents, please purchase this course`}
          textColor={Colors.LIGHT_GREY}
          fontSize={18}
          fontFamily="regular"
          textAlign="center"
          style={{marginBottom: 20}}
        />
        <MyButton
          text="OK, GOT IT"
          style={{
            width: width * 0.9,
            marginBottom: 10,
            backgroundColor: Colors.THEME_BROWN,
          }}
          onPress={closeModal}
        />
      </View>
      {/* </KeyboardAvoidingView> */}
    </Modal>
  );
};

export default CourseNotPurshasedModal;
