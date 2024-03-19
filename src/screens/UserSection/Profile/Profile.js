//import : react components
import React, { useEffect, useRef, useState } from 'react';
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
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  Platform,
  Linking,
  PermissionsAndroid,
  RefreshControl
} from 'react-native';
//import : custom components
import MyHeader from 'components/MyHeader/MyHeader';
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import { ScrollView } from 'react-native-virtualized-view';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
//import : global
import { Colors, Constant, MyIcon, ScreenNames, Service } from 'global/Index';
//import : styles
import { styles } from './ProfileStyle';
//import : modal
//import : redux
import { connect, useSelector } from 'react-redux';
import { width, height } from 'global/Constant';
import Divider from 'components/Divider/Divider';
import MyButton from '../../../components/MyButton/MyButton';
import MyTextInput from '../../../components/MyTextInput/MyTextInput';
import ProfileTab from './components/ProfileTab/ProfileTab';
import PasswordTab from './components/PasswordTab/PasswordTab';
import CertificateTab from './components/CertificateTab/CertificateTab';
import NotificationsTab from './components/NotificationsTab/NotificationsTab';
import BillingTab from './components/BillingTab/BillingTab';
import AddCard from '../../../modals/AddCard/AddCard';
import OrderHistoryTab from './components/OrderHistoryTab/OrderHistoryTab';
// import OrderStatus from '../../../modals/OrderStatus/OrderStatus';
import RNFetchBlob from 'react-native-blob-util';
import { createThumbnail } from 'react-native-create-thumbnail';
import ViewPdf from '../../../modals/ViewPdf/ViewPdf';
import { CountryPicker } from 'react-native-country-codes-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../../../reduxToolkit/reducer/user';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import SelectImageSource from '../../../modals/SelectImageSource/SelectImageSource';
import { responsiveWidth } from 'react-native-responsive-dimensions';

const Profile = ({ navigation, dispatch }) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState('1');
  const [tabs, setTabs] = useState([
    {
      id: '1',
      name: 'Profile',
    },
    {
      id: '2',
      name: 'Password',
    },
    {
      id: '3',
      name: 'Certificates',
    },
    // {
    //   id: '4',
    //   name: 'Notifications',
    // },
    // {
    //   id: '5',
    //   name: 'Billing',
    // },
    // {
    //   id: '6',
    //   name: 'Order History',
    // },
  ]);
  // profile tab states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [timezone, setTimezone] = useState('');

  // password tab states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // certificate tab states
  const [certificateData, setCertificateData] = useState([]);
  const [orderHistoryData, setOrderHistoryData] = useState([
    {
      id: '1',
      creatorName: `Max Bryrant`,
      courseImg: '',
      courseName: `O'Reilly's tattoo machine Motor`,
      courseRating: '4.7',
      courseFee: '399.00',
      status: 'Picked-up',
      orderId: 'HBD898DMND8333',
      date: '26 Juny 2023 9:30AM',
      ago: '10h ago',
    },
    {
      id: '2',
      creatorName: `Nikhil Sam`,
      courseImg: '',
      courseName: `O'Reilly's tattoo machine Motor`,
      courseRating: '4.7',
      courseFee: '399.00',
      status: 'Packed',
      orderId: 'HBD898DMND8333',
      courseCompletedDate: '26 Juny 2023 9:30AM',
      ago: '10h ago',
      date: '26 Juny 2023 9:30AM',
    },
  ]);
  // notifications tab states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // billing tab states
  const [cardList, setCardList] = useState([]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showOrderStatusModal, setShowOrderStatusModal] = useState(false);
  const [showViewPdfModal, setShowViewPdfModal] = useState(false);
  const [pdfLink, setPdfLink] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
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
  const [phone, setPhone] = useState('');
  const [show, setShow] = useState(false);
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  const [profileImage, setProfileImage] = useState(userInfo?.profile_image);
  const [refreshing, setRefreshing] = useState(false);
  // profile tab refs
  const lastNameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const companyRef = useRef(null);
  const professionalTitleRef = useRef(null);
  const timezoneRef = useRef(null);
  // password tab refs
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('userToken', userToken);
      // setSelectedTab('1')
      getProfileData();
      getProfileData('3');
      

    });
    return unsubscribe;
  }, [navigation]);
  const checkcon = () => {
    setSelectedTab('1')
    getProfileData(selectedTab);
  
  };
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    checkcon();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);
  const getProfileData = async (id = '1') => {
    const endPoint = getEndpoint(id);
    console.log('endPoint', endPoint);
    // !showLoader && 
    setShowLoader(true);
    try {
      const resp = await Service.getApiWithToken(userToken, endPoint);
      console.log('getProfileData resp', resp?.data);
      if (resp?.data?.status) {
        if (id === '1') {
          setProfileTabData(resp?.data?.data);
        } else if (id === '3') {
          // const thumbData = await generateThumb(resp?.data?.data);
          setCertificateData([...resp?.data?.data]);
        } else if (id === '4') {
          setNotificationsTabData(resp?.data?.data);
        } else if (id === '5') {
          setBillingTabData(resp?.data?.data);
        }
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in getProfileData', error);
    }
    setShowLoader(false);
  };
  const downloadCertificate = async (link, title) => {
    
    let pdfUrl = link;
    let DownloadDir =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: 'Arkansas',
      path: `${dirToSave}.pdf`,
    };
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: 'pdf',
      },
      android: configfb,
    });
    Platform.OS == 'android'
    ? RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${DownloadDir}/.pdf`,
        description: 'Arkansas',
        title: `${title} course certificate.pdf`,
        mime: 'application/pdf',
        mediaScannable: true,
      },
    })
      .fetch('GET', `${pdfUrl}`)
      .catch(error => {
        console.warn(error.message);
      })
    : RNFetchBlob.config(configOptions)
      .fetch('GET', `${pdfUrl}`, {})
      .then(res => {
        if (Platform.OS === 'ios') {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
        console.log('The file saved to ', res);
      })
      .catch(e => {
        console.log('The file saved to ERROR', e.message);
      });
  };
  const setProfileTabData = data => {
    setFirstName(data?.first_name);
    setLastName(data?.last_name);
    setEmail(data?.email);
    setCompany(data?.company);
    setProfessionalTitle(data?.professional_title);
    setTimezone(data?.timezone);
    setPhone(data?.phone);
  };
  const setCertificatesTabData = async data => {
    setShowLoader(true)
   
    setShowLoader(false)
     
  };
  const setNotificationsTabData = data => { };
  const setBillingTabData = data => {
    setCardList(data);
  };
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
        Toast.show({ text1: 'User cancelled picking image' });
        setShowImageSourceModal(false);
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        Toast.show({ text1: 'Camera not available on device' });
        setShowImageSourceModal(false);
        return;
      } else if (response.errorCode == 'permission') {
        Toast.show({ text1: 'Permission not satisfied' });
        setShowImageSourceModal(false);
        return;
      } else if (response.errorCode == 'others') {
        Toast.show({ text1: response.errorMessage });
        setShowImageSourceModal(false);
        return;
      }
      console.log('Response = ', response.assets[0]);
      // setProfileImage(response.assets[0]);
      updateProfileDetails(response.assets[0]);
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
          Toast.show({ text1: `Storage Permission Not Granted` });
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
        Toast.show({ text1: 'User cancelled image picker' });
        // Alert.alert('User cancelled image picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        setShowImageSourceModal(false);
        Toast.show({ text1: 'Camera not available on device' });
        // Alert.alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        setShowImageSourceModal(false);
        Toast.show({ text1: 'Permission not satisfied' });
        // Alert.alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        setShowImageSourceModal(false);
        Toast.show({ text1: response.errorMessage });
        // Alert.alert(response.errorMessage);
        return;
      } else {
        updateProfileDetails(response.assets[0]);
        // setProfileImage(response.assets[0]);
        setShowImageSourceModal(false);
      }
      setShowImageSourceModal(false);
    });
  };
  // const generateThumb = async data => {
  //   console.log('generateThumb', JSON.stringify(data));
  //   let updatedData = [...data];
    
  //   try {
  //     updatedData = await Promise.all(
  //       data?.map?.(async el => {
  //         const thumb = await createThumbnail({
  //           url: el?.video,
  //           timeStamp: 1000,
  //         });
  //         return {
  //           ...el,
  //           thumb,
  //         };
  //       }),
  //     );
  //   } catch (error) {
  //     console.error('Error generating thumbnails:', error);
  //   }
  //   console.log('thumb data cart', updatedData);
  //   return updatedData;
  // };
  const openAddCardModal = () => {
    setShowAddCardModal(true);
  };
  const viewDetails = () => {
    setShowOrderStatusModal(true);
  };

  const deleteCard = async id => {
    const postData = new FormData();
    postData.append('id', id);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.DELETE_CARD,
        postData,
      );
      console.log('deleteCard resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({ text1: resp?.data?.message });
        getProfileData('5');
      } else {
        Toast.show({ text1: resp?.data?.message });
      }
    } catch (error) {
      console.log('error in deleteCard', error);
    }
    setShowLoader(false);
  };

  const updateProfileDetails = async (img = {}) => {
    if (firstName?.trim()?.length === 0) {
      Toast.show({ text1: `First Name cannot be empty` });
      return;
    } else if (lastName?.trim()?.length === 0) {
      Toast.show({ text1: `Last Name cannot be empty` });
      return;
    } else if (phone?.trim()?.length === 0) {
      Toast.show({ text1: `Phone cannot be empty` });
      return;
    } else if (phone?.trim()?.length < 10) {
      Toast.show({ text1: `Phone Number must be 10 digits long` });
      return;
    }
    const postData = new FormData();
    postData.append('first_name', firstName);
    postData.append('last_name', lastName);
    postData.append('phone', phone);
    console.log('Object.keys(img)?.length', Object.keys(img)?.length);
    if (Object.keys(img)?.length > 0) {
      const imageName = img?.uri?.slice(
        img?.uri?.lastIndexOf('/'),
        img?.uri?.length,
      );
      postData.append('profile_image', {
        name: imageName,
        type: img?.type,
        uri: img?.uri,
      });
    }
    console.log('updateProfileDetails postData', postData);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.UPDATE_PROFILE,
        postData,
      );
      console.log('updateProfileDetails resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({ text1: resp?.data?.message });
        setProfileImage(resp?.data?.user?.profile_image);
        const jsonValue = JSON.stringify(resp.data.user);
        await AsyncStorage.setItem('userInfo', jsonValue);
        dispatch(setUser(resp.data.user));
        getProfileData();
      } else {
        Toast.show({ text1: resp?.data?.message });
      }
    } catch (error) {
      console.log('error in updateProfileDetails', error);
    }
    showLoader && setShowLoader(false);
  };

  const changeSelectedTab = id => {
    setSelectedTab(id);
    if (id !== '2') {
      getProfileData(id);
    }
  };
  const changePasswordValidation = () => {
    if (oldPassword?.trim()?.length === 0) {
      Toast.show({ text1: 'Please enter Old Password' });
      return false;
    } else if (newPassword?.trim()?.length === 0) {
      Toast.show({ text1: 'Please enter New Password' });
      return false;
    } else if (confirmPassword?.trim()?.length === 0) {
      Toast.show({ text1: 'Please enter Confirm Password' });
      return false;
    } else if (confirmPassword?.trim() !== newPassword?.trim()) {
      Toast.show({ text1: 'Confirm Password and New Password do not match' });
      return false;
    }
    return true;
  };
  const onChangePassword = async () => {
    if (!changePasswordValidation()) {
      return;
    }
    const postData = new FormData();
    postData.append('current_password', oldPassword);
    postData.append('new_password', newPassword);
    postData.append('password_confirmation', confirmPassword);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.CHANGE_PASSWORD,
        postData,
      );
      console.log('onChangePassword resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({ text1: resp?.data?.message });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Toast.show({ text1: resp?.data?.message });
      }
    } catch (error) {
      console.log('error in onChangePassword', error);
    }
    setShowLoader(false);
    // closeModal();
  };

  const renderTab = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => changeSelectedTab(item.id)}
        style={[
          styles.tab,
          selectedTab === item.id
            ? { backgroundColor: Colors.THEME_BROWN }
            : null,
        ]}>
        <MyText
          text={item.name}
          fontFamily="regular"
          fontSize={13}
          textColor={
            selectedTab === item.id ? Colors.THEME_GOLD : Colors.THEME_BROWN
          }
        />
      </TouchableOpacity>
    );
  };
  const openInBrowser = file => {
    console.log('openPdfInBrowser', file);
    const link = `https://docs.google.com/viewerng/viewer?url=${file}`;
    Linking.openURL(link);
  };
  
  //UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader title=" " />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: '20%' }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.mainView}>
            <View style={styles.contactContainer}>
              <View>
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require('assets/images/user-default.png')
                  }
                  style={styles.personImg}
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
              <View style={{ marginLeft: 17 }}>
                <MyText
                  text={`${userInfo?.first_name} ${userInfo?.last_name}`}
                  fontFamily="bold"
                  fontSize={18}
                  textColor={Colors.THEME_GOLD}
                  style={{ width: responsiveWidth(60) }}
                />
                <View style={styles.contactRow}>
                  <Image source={require('assets/images/email-profile.png')} />
                  <MyText
                    text={userInfo?.email}
                    fontFamily="regular"
                    fontSize={14}
                    textColor={Colors.LIGHT_GREY}
                    style={{ marginLeft: 10 }}
                  />
                </View>
                <View style={styles.contactRow}>
                  <Image source={require('assets/images/phone-profile.png')} />
                  <MyText
                    text={`+1-${userInfo?.phone}`}
                    fontFamily="regular"
                    fontSize={14}
                    textColor={Colors.LIGHT_GREY}
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </View>
            </View>

            <FlatList
              data={tabs}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 19 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderTab}
            />
            {selectedTab === '1' ? (
              <ProfileTab
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                show={show}
                setShow={setShow}
                selectedCountry={selectedCountry}
                company={company}
                setCompany={setCompany}
                professionalTitle={professionalTitle}
                setProfessionalTitle={setProfessionalTitle}
                timezone={timezone}
                setTimezone={setTimezone}
                lastNameRef={lastNameRef}
                phoneRef={phoneRef}
                emailRef={emailRef}
                companyRef={companyRef}
                professionalTitleRef={professionalTitleRef}
                timezoneRef={timezoneRef}
                updateProfileDetails={updateProfileDetails}
              />
            ) : selectedTab === '2' ? (
              <PasswordTab
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                newPasswordRef={newPasswordRef}
                confirmPasswordRef={confirmPasswordRef}
                onChangePassword={onChangePassword}
              />
            ) : selectedTab == '3' ? (
               
            <CertificateTab
                certificateList={certificateData}
                downloadCertificate={downloadCertificate}
                openInBrowser={openInBrowser}
                setShowViewPdfModal={setShowViewPdfModal}
                setPdfLink={setPdfLink}
                setPdfTitle={setPdfTitle}
                 
              />
            ) : // : selectedTab == '4' ? (
              //   <NotificationsTab
              //     notificationsEnabled={notificationsEnabled}
              //     setNotificationsEnabled={setNotificationsEnabled}
              //   />
              // )
              // : selectedTab == '5' ? (
              //   <BillingTab
              //     cardList={cardList}
              //     deleteCard={deleteCard}
              //     openAddCardModal={openAddCardModal}
              //   />
              // )
              selectedTab == '6' ? (
                <OrderHistoryTab
                  orderHistoryData={orderHistoryData}
                // viewDetails={viewDetails}
                />
              ) : null}
              
          </ScrollView>
        </KeyboardAvoidingView>
        <CustomLoader showLoader={showLoader} />
        <AddCard
          visible={showAddCardModal}
          setVisibility={setShowAddCardModal}
          setShowLoader={setShowLoader}
          userToken={userToken}
          callFunctionAfterAddingcard={getProfileData}
        />
        {/* <OrderStatus
          visible={showOrderStatusModal}
          setVisibility={setShowOrderStatusModal}
        /> */}
        {showViewPdfModal ? (
          <ViewPdf
            visible={showViewPdfModal}
            setVisibility={setShowViewPdfModal}
            pdfLink={pdfLink || ''}
            handleDownload={() => downloadCertificate(pdfLink, pdfTitle)}
          />
        ) : null}
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
        <SelectImageSource
          visible={showImageSourceModal}
          setVisibility={setShowImageSourceModal}
          openLibrary={openLibrary}
          openCamera={checkCameraPermission}
        />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(Profile);

const getEndpoint = id => {
  let endPoint = '';
  if (id === '1') {
    endPoint = Service.PROFILE;
  } else if (id === '3') {
    endPoint = Service.CERTIFICATES;
  } else if (id === '4') {
    endPoint = Service.NOTIFICATIONS;
  } else if (id === '5') {
    endPoint = Service.SAVE_CARD_LISTING;
  }
  return endPoint;
};
