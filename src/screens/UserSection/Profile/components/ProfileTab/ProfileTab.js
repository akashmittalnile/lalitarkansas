//import : react components
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'
//import : custom components
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
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
import NameEnterValue from '../../../../../components/NameEnterValue/NameEnterValue';
import MyButton from '../../../../../components/MyButton/MyButton';
import TextInputWithFlag from '../../../../../components/TextInputWithFlag/TextInputWithFlag';
import EditAddress from '../../../../../components/Address/EditAddress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveHeight as hg } from 'react-native-responsive-dimensions';

const ProfileTab = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  company,
  setCompany,
  professionalTitle,
  setProfessionalTitle,
  timezone,
  setTimezone,
  lastNameRef,
  phoneRef,
  emailRef,
  phone,
  setPhone,
  selectedCountry,
  setShow,
  showsetPhone,
  setShowsetPhone,
  selectedCountrysetPhone,
  companyRef,
  professionalTitleRef,
  timezoneRef,
  updateProfileDetails,
}) => {
  const navigation = useNavigation();
  const focused = useIsFocused();

  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    getAddresses();
  }, [focused]);

  const deleteAddressHandler = async (id) => {
    try {
      const userToekn = await AsyncStorage.getItem('userToken');
      const response = await Service.deleteApi(userToekn, Service.DELETE_ADDRESS, id);
      if (response.data.status) {
        Toast.show({
          type: 'success',
          text1: 'Address deleted successfully.',
        });
        getAddresses();
      }
    } catch (err) {
      console.log('delete address tab  err', err.message);
    }
  };


  const getAddresses = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await Service.getApiWithToken(userToken, Service.GET_ALL_ADDRESS);
      if (response.data.status) {
        setAddresses(response.data.data);
      }
      if (!response.data.status) {
        setAddresses([]);
      }
    } catch (err) {
      console.log('addresses tab err ', err.message);
    }
  };

  const addNewAddressHandler = () => {
    navigation.navigate(ScreenNames.ADD_ADDRESS, { tab: true });
  };


  return (
    <View style={{ marginTop: 31 }}>
      <NameEnterValue
        name={'First Name'}
        placeholder={'First Name'}
        value={firstName}
        setValue={setFirstName}
        onSubmitEditing={() => {
          lastNameRef.current.focus();
        }}
      />
      <NameEnterValue
        inputRef={lastNameRef}
        name={'Last Name'}
        placeholder={'Last Name'}
        value={lastName}
        setValue={setLastName}
        onSubmitEditing={() => {
          emailRef.current.focus();
        }}
      />
      <NameEnterValue
        inputRef={emailRef}
        name={'Email Id'}
        placeholder={'Email Id'}
        value={email}
        editable={false}
        setValue={setEmail}
        onSubmitEditing={() => phoneRef.current.focus()}
      />
      <MyText
        text="Phone Number"
        fontSize={14}
        fontFamily="medium"
        textColor="black"
        style={{ marginBottom: 5 }}
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
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      {/* <NameEnterValue
        inputRef={companyRef}
        name={'Company'}
        placeholder={'Company'}
        value={company}
        setValue={setCompany}
        onSubmitEditing={() => {
          professionalTitleRef.current.focus();
        }}
      />
      <NameEnterValue
        inputRef={professionalTitleRef}
        name={'Professional Title'}
        placeholder={'Professional Title'}
        value={professionalTitle}
        setValue={setProfessionalTitle}
        onSubmitEditing={() => {
          timezoneRef.current.focus();
        }}
      />
      <NameEnterValue
        inputRef={timezoneRef}
        name={'Time Zone'}
        placeholder={'Time Zone'}
        value={timezone}
        setValue={setTimezone}
      /> */}
      <MyText
        text="My Addresses"
        fontSize={14}
        fontFamily="medium"
        textColor="black"
        style={{ marginBottom: 5 }}
      />
      <View>
        {addresses.length > 0 ? addresses.map((item, index) => (
          <EditAddress address={item} key={index} deleteAddress={deleteAddressHandler} containerStyle={{ marginTop: hg(3) }} />
        )) : <Text style={{ textAlign: 'center', color: 'black' }}>No saved address found.</Text>}
        <MyButton
          text="Add New Address"
          style={{
            marginTop: 15,
            marginBottom: 10,
            backgroundColor: Colors.THEME_GOLD,
          }}
          onPress={addNewAddressHandler}
        />
      </View>
      <MyButton
        text="SAVE CHANGES"
        style={{
          marginTop: 10,
          marginBottom: 10,
          backgroundColor: Colors.THEME_GOLD,
        }}
        onPress={() => updateProfileDetails({})}
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

export default ProfileTab;
