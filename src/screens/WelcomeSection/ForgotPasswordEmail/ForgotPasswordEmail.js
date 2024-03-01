//react components
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
//global
import {Colors, Constant, Images, ScreenNames} from 'global/Index';
//styles
import {styles} from './ForgotPasswordEmailStyle';
import {CommonActions} from '@react-navigation/native';
import MyText from 'components/MyText/MyText';
//redux
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import MyButton from 'components/MyButton/MyButton';
import {width} from '../../../global/Constant';
import WelcomeHeader from 'components/WelcomeHeader/WelcomeHeader';
import MyTextInput from 'components/MyTextInput/MyTextInput';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../../components/CustomLoader/CustomLoader';
import { Service } from '../../../global/Index';

const ForgotPasswordEmail = ({navigation}) => {
  //variables : redux variables
  const [email, setEmail] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useDispatch();

  //function : navigation function
  const gotoForgotPasswordOTP = (otp) => {
    navigation.navigate(ScreenNames.FORGOT_PASSWORD_OTP, {email, otp});
  };
  const handleForgotPasswrord = async () => {
    if (email?.trim()?.length === 0) {
      Toast.show({text1: 'Please enter Email Address'});
      return;
    }
    setShowLoader(true);
    try {
      const postData = new FormData();
      postData.append('email', email);
      const resp = await Service.postApi(Service.FORGET_PASSWORD, postData);
      console.log('handleForgotPasswrord resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({text1: resp.data.message});
        gotoForgotPasswordOTP(resp.data.message);
      } else {
        Toast.show({text1: resp.data.message});
      }
    } catch (error) {
      console.log('error in handleForgotPasswrord', error);
    }
    setShowLoader(false);
  };
  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <ScrollView
          style={styles.mainView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%', alignItems: 'center'}}>
          <WelcomeHeader text="Forgot Password" right="33%" />
          <Image
            source={require('assets/images/lock-circle-big-icon.png')}
            style={{marginTop: 40}}
          />
          <MyText
            text={'Forgot Password'}
            fontSize={40}
            fontFamily="medium"
            textColor="black"
            textAlign="center"
            style={{}}
          />
          <MyText
            text={'We Will Send An 4 Digit OTP In Your Registered Email ID'}
            fontSize={18}
            fontFamily="medium"
            textColor={Colors.LIGHT_GREY}
            textAlign="center"
            style={{marginTop: 10, marginBottom: 30}}
          />
          <MyTextInput
            placeholder={'Email Address'}
            value={email}
            setValue={setEmail}
            isIcon
            icon={require('assets/images/email.png')}
          />
          <MyButton
            text="RESET PASSWORD"
            style={{
              width: width * 0.9,
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
            }}
            onPress={handleForgotPasswrord}
          />
        </ScrollView>
      </View>
      <CustomLoader showLoader={showLoader} />
    </SafeAreaView>
  );
};

export default ForgotPasswordEmail;
