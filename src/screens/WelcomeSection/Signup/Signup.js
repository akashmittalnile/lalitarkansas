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
  Platform,
  PermissionsAndroid,
} from 'react-native';
//global
import {Colors, Constant, Images, ScreenNames} from 'global/Index';
//styles
import {styles} from './SignupStyle';
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
import WelcomeHeader from 'components/WelcomeHeader/WelcomeHeader';
import MyTextInput from 'components/MyTextInput/MyTextInput';
import MyIconButton from 'components/MyIconButton/MyIconButton';
import Divider from '../../../components/Divider/Divider';
import TextInputWithFlag from '../../../components/TextInputWithFlag/TextInputWithFlag';
import {CountryPicker} from 'react-native-country-codes-picker';
import SuccessfulSignup from '../../../modals/SuccessfulSignup/SuccessfulSignup';
import {MyIcon, Service} from '../../../global/Index';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../../components/CustomLoader/CustomLoader';
import SelectImageSource from 'modals/SelectImageSource/SelectImageSource';
//import : third parties
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import messaging from '@react-native-firebase/messaging';

const Signup = ({navigation}) => {
  //variables : redux variables
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'US',
    dial_code: '+1',
    flag: '🇺🇸',
    name: {
      by: '',
      cz: 'Spoj  ené státy',
      en: 'United States',
      es: 'Estados Unidos',
      pl: 'Stany Zjednoczone',
      pt: 'Estados Unidos',
      ru: 'Соединенные Штаты',
      ua: 'Сполучені Штати',
    },
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  const [filePath, setFilePath] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const dispatch = useDispatch();
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
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
  const openSuccessModal = () => {
    setShowSuccessModal(true);
  };
  //function : navigation function
  const gotoLogin = () => {
    // navigation.dispatch(resetIndexGoToLogin);
    navigation.navigate(ScreenNames.LOGIN);
    setShowSuccessModal(false);
  };
  const resetIndexGoToLogin = CommonActions.reset({
    index: 1,
    routes: [{name: ScreenNames.LOGIN}],
  });
  const Validation = () => {
    console.log("phone,,,,,",phone.trim().length)
    if (filePath == '') {
      Toast.show({text1: 'Please upload Profile Image'});
      return;
    } else if (firstName == '') {
      Toast.show({text1: 'Please enter First Name'});
      return false;
    } else if (lastName == '') {
      Toast.show({text1: 'Please enter Last Name'});
      return false;
    } else if (email == '') {
      Toast.show({text1: 'Please enter Email Address'});
      return false;
    } else if (password == '') {
      Toast.show({text1: 'Please enter Password'});
      return false;
    } else if (phone == '') {
      Toast.show({text1: 'Please enter Phone Number'});
      return false
    }else if (phone.trim().length < 10) {
      Toast.show({text1: 'Please valid Phone Number'});
      return false ;
    } else if (password == '') {
      Toast.show({text1: 'Please enter Password'});
      return false;
    }
    return true;
  };
  const signUpUser = async () => {
    if (!Validation()) {
      return;
    }
    // setShowLoader(true);
    // try {
    //   const formaData = new FormData();
    //   // const isRegistered=await messaging().isDeviceRegisteredForRemoteMessages()
    //   // console.log(isRegistered);
    //   // const token = await messaging().getToken();
    //   // console.log("TOKEN",token);
    //   const imageName = filePath?.uri?.slice(
    //     filePath?.uri?.lastIndexOf('/'),
    //     filePath?.uri?.length,
    //   );
    //   formaData.append('profile_image', {
    //     name: imageName,
    //     type: filePath?.type,
    //     uri: filePath?.uri,
    //   });
    //   formaData.append('first_name', firstName);
    //   formaData.append('last_name', lastName);
    //   formaData.append('email', email);
    //   formaData.append('phone', phone);
    //   formaData.append('password', password);
    //   formaData.append('fcm_token', 'jklmhfbfjhdsfjkfgg');
    //   formaData.append('role', '1');
    //   console.log('signUpUser formaData', formaData);
    //   const resp = await Service.postApi(Service.REGISTER, formaData);
    //   console.log('signUpUser resp', resp?.data);
    //   if (resp?.data?.status) {
    //     Toast.show({text1: resp.data.message});
    //     openSuccessModal();
    //   } else {
    //     Toast.show({text1: resp.data.message});
    //   }
    // } catch (error) {
    //   console.log('error in signUpUser', error);
    // }
    // setShowLoader(false);
  };
  //function : imp function
  const openCamera = () => {
    const options = {
      width: 1080,
      height: 1080,
      cropping: true,
      mediaType: 'photo',
      compressImageQuality: 1,
      compressImageMaxHeight: 1080 / 2,
      compressImageMaxWidth: 1080 / 2,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        Toast.show({text1: 'User cancelled picking image'});
        setShowImageSourceModal(false);
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        Toast.show({text1: 'Camera not available on device'});
        setShowImageSourceModal(false);
        return;
      } else if (response.errorCode == 'permission') {
        Toast.show({text1: 'Permission not satisfied'});
        setShowImageSourceModal(false);
        return;
      } else if (response.errorCode == 'others') {
        Toast.show({text1: response.errorMessage});
        setShowImageSourceModal(false);
        return;
      }
      console.log('Response = ', response.assets[0]);
      setFilePath(response.assets[0]);
      setShowImageSourceModal(false);
    });
  };
  //function : imp function
  const checkCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      openCamera();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to access camera',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          openCamera();
          console.log('Storage Permission Granted.');
        } else {
          Toast.show({text1: `Storage Permission Not Granted`});
          // Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('ERROR' + err);
      }
    }
  };
  //function : imp function
  const openLibrary = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        // Alert.alert('User cancelled camera picker');
        setShowImageSourceModal(false);
        Toast.show({text1: 'User cancelled image picker'});
        // Alert.alert('User cancelled image picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        setShowImageSourceModal(false);
        Toast.show({text1: 'Camera not available on device'});
        // Alert.alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        setShowImageSourceModal(false);
        Toast.show({text1: 'Permission not satisfied'});
        // Alert.alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        setShowImageSourceModal(false);
        Toast.show({text1: response.errorMessage});
        // Alert.alert(response.errorMessage);
        return;
      } else {
        setFilePath(response.assets[0]);
        setShowImageSourceModal(false);
      }
      setShowImageSourceModal(false);
    });
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
            contentContainerStyle={{paddingBottom: '20%'}}>
            <WelcomeHeader text="Sign Up" right="42%" />
            {filePath == '' ? (
              <View style={styles.imageViewStyle}>
                <Image
                  resizeMode="contain"
                  borderRadius={100}
                  source={require('assets/images/user-default.png')}
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowImageSourceModal(true);
                  }}
                  style={styles.addButtonStyle}>
                  <MyIcon.AntDesign
                    name="plus"
                    color={Colors.WHITE}
                    size={16}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imageViewStyle}>
                <Image
                  resizeMode="cover"
                  borderRadius={1000}
                  source={{uri: filePath.uri}}
                  style={{height: '100%', width: '100%'}}
                />
                <TouchableOpacity
                  // onPress={() => setFilePath('')}
                  onPress={() => setShowImageSourceModal(true)}
                  style={styles.addButtonStyle}>
                  <MyIcon.Feather
                    name="edit-2"
                    color={Colors.WHITE}
                    size={16}
                  />
                </TouchableOpacity>
              </View>
            )}
            <MyText
              text={'Please enter your basic details'}
              fontSize={14}
              fontFamily="medium"
              textColor="black"
              style={{marginTop: 10, marginBottom: 25}}
            />
            <MyTextInput
              placeholder={'First Name'}
              value={firstName}
              setValue={setFirstName}
              isIcon
              icon={require('assets/images/user.png')}
              onSubmitEditing={() => lastNameRef.current.focus()}
            />
            <MyTextInput
              inputRef={lastNameRef}
              placeholder={'Last Name'}
              value={lastName}
              setValue={setLastName}
              isIcon
              icon={require('assets/images/user.png')}
              onSubmitEditing={() => emailRef.current.focus()}
            />
            <MyTextInput
              inputRef={emailRef}
              placeholder={'Email Address'}
              value={email}
              setValue={setEmail}
              isIcon
              icon={require('assets/images/email.png')}
              onSubmitEditing={() => phoneRef.current.focus()}
            />
            <TextInputWithFlag
              inputRef={phoneRef}
              value={phone}
              Flag={selectedCountry.flag}
              CountryCode={selectedCountry.dial_code}
              placeholder="Enter Phone Number"
              keyboardType="number-pad"
              maxLength={10}
              // onPress={() => setShow(true)}
              onChangeText={text => setPhone(text)}
              onSubmitEditing={() => passwordRef.current.focus()}
            />
            {/* <MyTextInput
          inputRef={phoneRef}
          placeholder={'Phone'}
          value={phone}
          setValue={setPhone}
          isIcon
          icon={require('assets/images/phone.png')}
          onSubmitEditing={() => passwordRef.current.focus()}
        /> */}
            <MyTextInput
              inputRef={passwordRef}
              placeholder={'Password'}
              value={password}
              setValue={setPassword}
              isIcon
              icon={require('assets/images/password.png')}
              secureTextEntry
            />
            <MyButton
              text="SIGN UP"
              style={{
                width: width * 0.9,
                marginBottom: 10,
                backgroundColor: Colors.THEME_BROWN,
              }}
              // onPress={openSuccessModal}
              onPress={signUpUser}
            />
            {/* <View style={styles.dividerRow}>
              <Divider style={{width: '38%'}} />
              <View style={styles.orBox}>
                <MyText
                  text={'OR'}
                  fontSize={18}
                  fontFamily="bold"
                  textColor="white"
                />
              </View>
              <Divider style={{width: '38%'}} />
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
            <TouchableOpacity onPress={gotoLogin} style={styles.alreadyView}>
              <MyText
                text={'Already have an account? '}
                fontSize={13}
                fontFamily="medium"
                textColor={Colors.LIGHT_GREY}
              />
              <MyText
                text={'Signin'}
                fontSize={13}
                fontFamily="medium"
                textColor={'#B600F8'}
              />
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
        <SuccessfulSignup
          visible={showSuccessModal}
          setVisibility={setShowSuccessModal}
          gotoLogin={gotoLogin}
        />
        <CountryPicker
          show={show}
          disableBackdrop={false}
          // style={styles.countrySilderStyle}
          style={{
            // Styles for whole modal [View]
            modal: {
              height: Constant.height * 0.4,
              // backgroundColor: 'red',
            },
            // Styles for modal backdrop [View]
            backdrop: {},
            countryName: {
              color: 'black',
            },
            dialCode: {
              color: 'black',
            },
          }}
          // when picker button press you will get the country object with dial code
          pickerButtonOnPress={item => {
            // console.warn('item', item);
            // setCountryCode(item.dial_code);
            setSelectedCountry(item);
            setShow(false);
          }}
          placeholderTextColor={'#c9c9c9'}
          color={Colors.BLACK}
          onBackdropPress={() => setShow(false)}
        />
      </View>
      <CustomLoader showLoader={showLoader} />
      <SelectImageSource
        visible={showImageSourceModal}
        setVisibility={setShowImageSourceModal}
        openLibrary={openLibrary}
        openCamera={checkCameraPermission}
      />
    </SafeAreaView>
  );
};

export default Signup;
