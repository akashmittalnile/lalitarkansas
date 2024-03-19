//import : react components
import React, {useEffect, useRef, useState} from 'react';
import {
  View, 
  Switch,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
//import : custom components
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
//import : global
import {Colors, Constant, MyIcon, ScreenNames, Service} from 'global/Index';
//import : styles
import {styles} from './PasswordTabStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
import NameEnterValue from '../../../../../components/NameEnterValue/NameEnterValue';
import MyButton from '../../../../../components/MyButton/MyButton';

const PasswordTab = ({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  newPasswordRef,
  confirmPasswordRef,
  onChangePassword
}) => {
  const onPressSave = async () => {
    
    await onChangePassword()
  }
  return (
    <View style={{marginTop: 31}}>
      <NameEnterValue
        name={'Enter Old Password'}
        placeholder={'Enter Old Password'}
        value={oldPassword}
        setValue={setOldPassword}
        secureTextEntry
        textInputstyle={{width: '85%'}}
        onSubmitEditing={() => {
          newPasswordRef.current.focus();
        }}
      />
      <NameEnterValue
        inputRef={newPasswordRef}
        name={'New Password'}
        placeholder={'New Password'}
        value={newPassword}
        setValue={setNewPassword}
        secureTextEntry
        textInputstyle={{width: '85%'}}
        onSubmitEditing={() => {
          confirmPasswordRef.current.focus();
        }}
      />
      <NameEnterValue
        inputRef={confirmPasswordRef}
        name={'Confirm Password'}
        placeholder={'Confirm Password'}
        value={confirmPassword}
        setValue={setConfirmPassword}
        secureTextEntry
        textInputstyle={{width: '85%'}}
      />
      <MyButton
        text="SAVE CHANGES"
        style={{
          marginTop: 10,
          marginBottom: 10,
          backgroundColor: Colors.THEME_GOLD,
        }}
        onPress={onPressSave}
      />
      {/* <MyButton
        text="CLEAR ALL"
        style={{
          marginBottom: 10,
          backgroundColor: Colors.THEME_BROWN,
        }}
      /> */}
    </View>
  );
};

export default PasswordTab;
