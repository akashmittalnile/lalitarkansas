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
import {styles} from './PrerequisiteModalStyle';
import Modal from 'react-native-modal';
import MyButton from '../../components/MyButton/MyButton';
import {width} from '../../global/Constant';

const PrerequisiteModal = ({
  visible,
  setVisibility,
  prerequisiteModalText,
  setPrerequisiteModalText,
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
      onModalHide={() => {
        setPrerequisiteModalText('');
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
        <Image source={require('assets/images/prereq-not-completed.png')} />
        <MyText
          text="Prerequisite(s) have not yet been completed!"
          textColor={Colors.THEME_GOLD}
          fontSize={24}
          fontFamily="medium"
          textAlign="center"
          style={{}}
        />
        <MyText
          text={`To move forward, please complete all prerequisites in Chapter ${prerequisiteModalText}`}
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

export default PrerequisiteModal;
