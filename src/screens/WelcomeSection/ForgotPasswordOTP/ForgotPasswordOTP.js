//react components
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  SafeAreaView,
  StatusBar,
} from 'react-native';
//global
import {Colors, Constant, Images, ScreenNames} from 'global/Index';
//styles
import {styles} from './ForgotPasswordOTPStyle';
import {CommonActions} from '@react-navigation/native';
import MyText from 'components/MyText/MyText';
//redux
import {useDispatch} from 'react-redux';
import MyButton from 'components/MyButton/MyButton';
import {width} from '../../../global/Constant';
import WelcomeHeader from 'components/WelcomeHeader/WelcomeHeader';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../../components/CustomLoader/CustomLoader';
import { Service } from '../../../global/Index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ForgotPasswordOTP = ({navigation, route}) => {
  //variables : redux variables
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const [correctOtp, setCorrectOtp] =  useState(route?.params?.otp)
  const [firstCode, setFirstCode] = useState('');
  const [secondCode, setSecondCode] = useState('');
  const [thirdCode, setThirdCode] = useState('');
  const [forthCode, setForthCode] = useState('');
  const [message, setMessage] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const firstCodeRef = useRef();
  const secondCodeRef = useRef();
  const thirdCodeRef = useRef();
  const forthCodeRef = useRef();

  //function : navigation function
  const gotoForgotPasswordChange = () => {
    navigation.navigate(ScreenNames.FORGOT_PASSWORD_CHANGE, {email: route?.params?.email, correctOtp: firstCode + secondCode + thirdCode + forthCode});
  };
  const Validation = () => {
    if(firstCode === '' && secondCode === '' && thirdCode === '' && forthCode === ''){
      Toast.show({text1: 'Please enter Verification Code'});
      return false;
    }
    else if (firstCode === '' || secondCode === '' || thirdCode === '' || forthCode === '') {
      Toast.show({text1: 'Please enter complete Verification Code'});
      return false;
    }
    return true
  }
  const handleValidateOtp = async () => {
    if(!Validation()){
      return
    }
    setShowLoader(true);
    try {
      const postData = new FormData();
      postData.append('email', route?.params?.email);
      postData.append('otp', firstCode + secondCode + thirdCode + forthCode);
      console.log('handleValidateOtp postData', postData);
      const resp = await Service.postApi(Service.VERIFY_OTP, postData);
      console.log('handleValidateOtp resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({text1: resp.data.message});
        gotoForgotPasswordChange();
      } else {
        Toast.show({text1: resp.data.message});
      }
    } catch (error) {
      console.log('error in handleValidateOtp', error);
    }
    setShowLoader(false);
  };
  const handleResendOtp = async () => {
    setShowLoader(true);
    try {
      const postData = new FormData();
      postData.append('email', route?.params?.email);
      console.log('handleResendOtp postData', postData);
      const resp = await Service.postApi(Service.RESEND_OTP, postData);
      console.log('handleResendOtp resp', resp?.data);
      if (resp?.data?.status) {
        setCorrectOtp(resp.data.code)
        Toast.show({text1: resp.data.message});
      } else {
        Toast.show({text1: resp.data.message});
      }
    } catch (error) {
      console.log('error in handleResendOtp', error);
    }
    setShowLoader(false);
  };
  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ScrollView
          style={styles.mainView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%', alignItems: 'center'}}>
          <WelcomeHeader text="Verification" right="38%" />
          <Image
            source={require('assets/images/lock-email-big-icon.png')}
            style={{marginTop: 40}}
          />
          <MyText
            text={'Verify your email'}
            fontSize={40}
            fontFamily="medium"
            textColor="black"
            textAlign="center"
            style={{}}
          />
          <MyText
            text={
              'Wohoo!!! Check your email we have sent you a verification code'
            }
            fontSize={18}
            fontFamily="medium"
            textColor={Colors.LIGHT_GREY}
            textAlign="center"
            style={{marginTop: 10, marginBottom: 18}}
          />
          <MyText
            text={route?.params?.email}
            fontSize={18}
            fontFamily="medium"
            textColor={Colors.LIGHT_GREY}
            textAlign="center"
            style={{marginBottom: 18}}
          />
          <View style={styles.flexRowView}>
            <TextInput
              placeholder=""
              ref={firstCodeRef}
              value={firstCode}
              onTouchStart={() => (message ? setMessage('') : null)}
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={text => {
                setFirstCode(text);
                if (text.length == 1) {
                  secondCodeRef.current.focus();
                } else {
                  firstCodeRef.current.focus();
                }
              }}
              onSubmitEditing={() => secondCodeRef.current.focus()}
              style={{
                ...styles.textInputStyle,
                color: firstCode == '' ? '#C0C0C0' : 'black',
              }}
            />
            <TextInput
              ref={secondCodeRef}
              value={secondCode}
              onTouchStart={() => (message ? setMessage('') : null)}
              placeholder={''}
              placeholderTextColor={
                secondCode == '' ? Colors.BLACK : Colors.WHITE
              }
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={text => {
                setSecondCode(text);
                if (text.length == 1) {
                  thirdCodeRef.current.focus();
                } else {
                  firstCodeRef.current.focus();
                }
              }}
              onSubmitEditing={() => thirdCodeRef.current.focus()}
              style={{
                ...styles.textInputStyle,
                color: secondCode == '' ? '#C0C0C0' : 'black',
              }}
            />
            <TextInput
              ref={thirdCodeRef}
              value={thirdCode}
              onTouchStart={() => (message ? setMessage('') : null)}
              placeholder={''}
              placeholderTextColor={
                thirdCode == '' ? Colors.BLACK : Colors.WHITE
              }
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={text => {
                setThirdCode(text);
                if (text.length == 1) {
                  forthCodeRef.current.focus();
                } else {
                  secondCodeRef.current.focus();
                }
              }}
              onSubmitEditing={() => forthCodeRef.current.focus()}
              style={{
                ...styles.textInputStyle,
                color: thirdCode == '' ? '#C0C0C0' : 'black',
              }}
            />
            <TextInput
              ref={forthCodeRef}
              value={forthCode}
              placeholder=""
              onTouchStart={() => (message ? setMessage('') : null)}
              placeholderTextColor={
                forthCode == '' ? Colors.BLACK : Colors.WHITE
              }
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={text => {
                setForthCode(text);
                if (text.length == 1) {
                  Keyboard.dismiss();
                } else {
                  thirdCodeRef.current.focus();
                }
              }}
              style={{
                ...styles.textInputStyle,
                color: forthCode == '' ? '#C0C0C0' : 'black',
                marginRight: 0,
              }}
            />
          </View>
          {message ? (
            <MyText
              text={message}
              fontFamily="bold"
              textAlign="center"
              fontSize={16}
              textColor={'#fe0000'}
            />
          ) : null}
          <MyButton
            text="VALIDATE OTP"
            style={{
              width: width * 0.9,
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
            }}
            onPress={handleValidateOtp}
          />
          <TouchableOpacity onPress={handleResendOtp} >
            <MyText
              text={'Resend Verification Code'}
              fontSize={18}
              fontFamily="medium"
              textColor={Colors.THEME_GOLD}
              textAlign="center"
              style={{marginTop: 8}}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
      </KeyboardAwareScrollView>
      <CustomLoader showLoader={showLoader} />
    </SafeAreaView>
  );
};

export default ForgotPasswordOTP;
