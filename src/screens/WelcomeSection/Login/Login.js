//react components
import React, { useEffect, useRef, useState } from 'react';
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
import { Colors, Constant, Images, ScreenNames } from 'global/Index';
//styles
import { styles } from './LoginStyle';
import { CommonActions } from '@react-navigation/native';
import MyText from 'components/MyText/MyText';
//third parties
import AsyncStorage from '@react-native-async-storage/async-storage';
//redux
import { useDispatch } from 'react-redux';
import {
  setUser,
  setUserToken,
  setUserNotifications,
} from 'src/reduxToolkit/reducer/user';
import LinearGradient from 'react-native-linear-gradient';
import MyButton from 'components/MyButton/MyButton';
import { width } from '../../../global/Constant';
import WelcomeHeader from 'components/WelcomeHeader/WelcomeHeader';
import MyTextInput from 'components/MyTextInput/MyTextInput';
import MyIconButton from 'components/MyIconButton/MyIconButton';
import Divider from '../../../components/Divider/Divider';
import TextInputWithFlag from '../../../components/TextInputWithFlag/TextInputWithFlag';
import { CountryPicker } from 'react-native-country-codes-picker';
import SuccessfulSignup from '../../../modals/SuccessfulSignup/SuccessfulSignup';
import { Service } from '../../../global/Index';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../../components/CustomLoader/CustomLoader';
import messaging from '@react-native-firebase/messaging';

const Login = ({ navigation }) => {
  //variables : redux variables
  const [email, setEmail] = useState('ssuser7@gmail.com');
  const [password, setPassword] = useState('123456');
  const [fcmToken, setFcmToken] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useDispatch();
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);

  const checkToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('fcm token', token);
        setFcmToken(token);
      } else {
        console.log('could not get fcm token');
      }
    } catch (error) {
      console.log('error in getting fcm token', error);
    }
  };
  //useEffect
  useEffect(() => {
    checkToken();
  }, []);
  //function : navigation function
  const gotoSignUp = () => {
    navigation.navigate(ScreenNames.SIGN_UP);
  };
  const gotoForgotPasswordEmail = () => {
    navigation.navigate(ScreenNames.FORGOT_PASSWORD_EMAIL);
  };
  const resetIndexGoToBottomTab = CommonActions.reset({
    index: 1,
    routes: [{ name: ScreenNames.BOTTOM_TAB }],
  });
  const Validation = () => {
    if (email == '') {
      Toast.show({ text1: 'Please enter Email Address' });
    } else if (password == '') {
      Toast.show({ text1: 'Please enter Password' });
    }
    return true;
  };
  const signInUser = async () => {
    if (Validation()) {
      setShowLoader(true);
      try {
        const signInData = new FormData();
        signInData.append('email', email);
        signInData.append('password', password);
        signInData.append('fcm_token', fcmToken);
        signInData.append('role', '1');
        const resp = await Service.postApi(Service.LOGIN, signInData);
        console.log('signInUser resp', resp?.data);
        if (resp?.data?.status) {
          await AsyncStorage.setItem('userToken', resp.data.authorization.token);
          const jsonValue = JSON.stringify(resp.data.user);
          console.log('sign in jsonValue', jsonValue);
          await AsyncStorage.setItem('userInfo', jsonValue);
          // if (requestLoactionPermission()) {
          //   getLocation(resp.data.access_token);
          // } else {
          dispatch(setUserToken(resp.data.authorization.token));
          dispatch(setUser(resp.data.user));
          navigation.dispatch(resetIndexGoToBottomTab);
          // }
        } else {
          // Alert.alert('', `${resp.data.message}`);
          Toast.show({ text1: resp.data.message });
        }
      } catch (error) {
        console.log('error in signInUser', error);
      }
      setShowLoader(false);
    }
  };
  //UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            style={styles.mainView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: '20%' }}>
            <WelcomeHeader text="Login" />
            <MyText
              text={'Enter your login credentials'}
              fontSize={14}
              fontFamily="medium"
              textColor="black"
              style={{ marginTop: 50, marginBottom: 25 }}
            />
            <MyTextInput
              placeholder={'Email Address'}
              value={email}
              setValue={setEmail}
              isIcon
              icon={require('assets/images/email.png')}
              onSubmitEditing={() => passwordRef.current.focus()}
            />
            <MyTextInput
              inputRef={passwordRef}
              placeholder={'Password'}
              value={password}
              setValue={setPassword}
              isIcon
              icon={require('assets/images/password.png')}
              secureTextEntry
            />
            <TouchableOpacity
              onPress={gotoForgotPasswordEmail}
              style={styles.forgot}>
              <MyText
                text={'FORGOT PASSWORD?'}
                fontSize={14}
                fontFamily="medium"
                textColor={Colors.THEME_GOLD}
                style={{ marginTop: 5, marginBottom: 15 }}
              />
            </TouchableOpacity>
            <MyButton
              text="SIGN IN"
              style={{
                width: width * 0.9,
                marginBottom: 10,
                backgroundColor: Colors.THEME_BROWN,
              }}
              onPress={signInUser}
            // onPress={()=>{navigation.dispatch(resetIndexGoToBottomTab)}}
            />
            {/* <View style={styles.dividerRow}>
              <Divider style={{width: '38%', borderColor: '#040706'}} />
              <View style={styles.orBox}>
                <MyText
                  text={'OR'}
                  fontSize={18}
                  fontFamily="bold"
                  textColor="white"
                />
              </View>
              <Divider style={{width: '38%', borderColor: '#040706'}} />
            </View>
            <MyIconButton
              text="Login with Facebook"
              isWhite
              style={{width: width * 0.9}}
              isIcon
              icon={require('assets/images/fb.png')}
            />
            <MyIconButton
              text="Login with Google"
              isWhite
              style={{width: width * 0.9}}
              isIcon
              icon={require('assets/images/google.png')}
            /> */}
            <TouchableOpacity onPress={gotoSignUp} style={styles.alreadyView}>
              <MyText
                text={`Don't have an account? `}
                fontSize={13}
                fontFamily="medium"
                textColor={Colors.LIGHT_GREY}
              />
              <MyText
                text={'Signup'}
                fontSize={13}
                fontFamily="medium"
                textColor={'#B600F8'}
              />
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <CustomLoader showLoader={showLoader} />
    </SafeAreaView>
  );
};

export default Login;
