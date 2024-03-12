//react components
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
//global
import {Colors, Constant, Images, ScreenNames} from 'global/Index';
//styles
import {styles} from './ForgotPasswordChangeStyle';
import {CommonActions} from '@react-navigation/native';
import MyText from 'components/MyText/MyText';
//redux
import {useDispatch} from 'react-redux';
import MyButton from 'components/MyButton/MyButton';
import {width} from '../../../global/Constant';
import WelcomeHeader from 'components/WelcomeHeader/WelcomeHeader';
import MyTextInput from 'components/MyTextInput/MyTextInput';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../../components/CustomLoader/CustomLoader';
import { Service } from '../../../global/Index';

const ForgotPasswordChange = ({navigation, route}) => {
  //variables : redux variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useDispatch();
  const confirmPasswordRef = useRef(null);

  //function : navigation function
  const resetIndexGoToLogin = CommonActions.reset({
    index: 1,
    routes: [{name: ScreenNames.LOGIN}],
  });
  const gotoLogin = () => {
    navigation.dispatch(resetIndexGoToLogin);
  };
  const Validation = () => {
    if(password?.trim()?.length === 0){
      Toast.show({text1: 'Please enter Password'});
      return false;
    }
    else if(confirmPassword?.trim()?.length === 0){
      Toast.show({text1: 'Please enter Confirm Password'});
      return false;
    } else if(password !== confirmPassword){
      Toast.show({text1: 'Password and Confirm Password do not match'});
      return false;
    } 
    return true
  }
  const changePassword = async () => {
    if(!Validation()){
      return
    }
    setShowLoader(true);
    try {
      const postData = new FormData();
      postData.append('email', route?.params?.email);
      postData.append('otp', Number(route?.params?.correctOtp));
      postData.append('password', password);
      postData.append('password_confirmation', confirmPassword);
      console.log('changePassword postData', postData);
      const resp = await Service.postApi(Service.VERIFY_OTP, postData);
      console.log('changePassword resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({text1: resp.data.message});
        gotoLogin();
      } else {
        Toast.show({text1: resp.data.message});
      }
    } catch (error) {
      console.log('error in changePassword', error);
    }
    setShowLoader(false);
  };
  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            style={styles.mainView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: '20%',
              alignItems: 'center',
            }}>
            <WelcomeHeader text="Change Password" right="33%" />
            <Image
              source={require('assets/images/lock-circle-big-icon-2.png')}
              style={{marginTop: 40}}
            />
            <MyText
              text={'Change Password'}
              fontSize={40}
              fontFamily="medium"
              textColor="black"
              textAlign="center"
              style={{}}
            />
            <MyText
              text={
                'Your new password must be different from previously used password'
              }
              fontSize={18}
              fontFamily="medium"
              textColor={Colors.LIGHT_GREY}
              textAlign="center"
              style={{marginTop: 10, marginBottom: 30}}
            />
            <MyTextInput
              placeholder={'Password'}
              value={password}
              setValue={setPassword}
              isIcon
              icon={require('assets/images/password.png')}
              secureTextEntry
              onSubmitEditing={() => confirmPasswordRef.current.focus()}
            />
            <MyTextInput
              inputRef={confirmPasswordRef}
              placeholder={'Confirm Password'}
              value={confirmPassword}
              setValue={setConfirmPassword}
              isIcon
              icon={require('assets/images/password.png')}
              secureTextEntry
            />
            <MyButton
              text="SAVE PASSWORD"
              style={{
                width: width * 0.9,
                marginBottom: 10,
                backgroundColor: Colors.THEME_BROWN,
              }}
              onPress={changePassword}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <CustomLoader showLoader={showLoader} />
    </SafeAreaView>
  );
};

export default ForgotPasswordChange;
