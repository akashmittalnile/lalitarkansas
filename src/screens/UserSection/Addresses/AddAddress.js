/* eslint-disable react-native/no-inline-styles */
import { View, StyleSheet,  Text, Image } from 'react-native';
import React, { useReducer, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import MyTextInput from '../../../components/MyTextInput/MyTextInput';
import MyText from '../../../components/MyText/MyText';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { responsiveWidth as wd, responsiveHeight as hg, responsiveHeight } from 'react-native-responsive-dimensions';
import Divider from '../../../components/Divider/Divider';
import Check from '../../../components/Button/Check';
import MyButton from '../../../components/MyButton/MyButton';
import BorderLessBtn from '../../../components/Button/BorderLessBtn';
import { ScreenNames, Colors } from '../../../global/Index';
import { Service } from '../../../global/Index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import residentialIcon from '../../../assets/images/residential.png';
import commercialIcon from '../../../assets/images/commercial.png';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../../components/CustomLoader/CustomLoader';
import MyHeader from '../../../components/MyHeader/MyHeader';
import { getApiWithToken, postApiWithToken } from '../../../global/Service';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaskInput from 'react-native-mask-input';

const shippingAddressDetailsReducer = (state, action) => {
  if (action.type === 'first_name') {
    return { ...state, first_name: action.payload };
  }
  else if (action.type === 'middle_name') {
    return { ...state, middle_name: action.payload };
  }
  else if (action.type === 'last_name') {
    return { ...state, last_name: action.payload };
  }
  else if (action.type === 'phone') {
    return { ...state, phone: action.payload };
  }
  else if (action.type === 'email') {
    return { ...state, email: action.payload };
  }
  else if (action.type === 'company_name') {
    return { ...state, company_name: action.payload };
  }
  else if (action.type === 'address_line_1') {
    return { ...state, address_line_1: action.payload };
  }
  else if (action.type === 'address_line_2') {
    return { ...state, address_line_2: action.payload };
  }
  else if (action.type === 'city') {
    return { ...state, city: action.payload };
  }
  else if (action.type === 'state') {
    return { ...state, state: action.payload };
  }
  else if (action.type === 'zip_code') {
    return { ...state, zip_code: action.payload };
  }
  else if (action.type === 'country') {
    return { ...state, country: action.payload };
  }
  else if (action.type === 'address_type') {
    return { ...state, address_type: action.payload };
  }
  else {
    return { ...action.payload };
  }
};

const billingAddressDetailsReducer = (state, action) => {
  if (action.type === 'first_name') {
    return { ...state, billing_first_name: action.payload };
  }
  else if (action.type === 'middle_name') {
    return { ...state, billing_middle_name: action.payload };
  }
  else if (action.type === 'last_name') {
    return { ...state, billing_last_name: action.payload };
  }
  else if (action.type === 'phone') {
    return { ...state, billing_phone: action.payload };
  }
  else if (action.type === 'email') {
    return { ...state, billing_email: action.payload };
  }
  else if (action.type === 'company_name') {
    return { ...state, billing_company_name: action.payload };
  }
  else if (action.type === 'address_line_1') {
    return { ...state, billing_address_line_1: action.payload };
  }
  else if (action.type === 'address_line_2') {
    return { ...state, billing_address_line_2: action.payload };
  }
  else if (action.type === 'city') {
    return { ...state, billing_city: action.payload };
  }
  else if (action.type === 'state') {
    return { ...state, billing_state: action.payload };
  }
  else if (action.type === 'zip_code') {
    return { ...state, billing_zip_code: action.payload };
  }
  else if (action.type === 'country') {
    return { ...state, billing_country: action.payload };
  }
  else if (action.type === 'address_type') {
    // console.log('chal gya', { ...state, billing_address_type: action.payload });
    return { ...state, billing_address_type: action.payload };
  }
  else {
    return { ...action.payload };
  }
};

const initialValue = {
  first_name: '',
  middle_name: '',
  last_name: '',
  phone: '',
  email: '',
  company_name: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  latitude: 45.32352,
  longitude: 102.65658,
  address_type: '',
};

const billingInitialValue = {
  billing_first_name: '',
  billing_middle_name: '',
  billing_last_name: '',
  billing_phone: '',
  billing_email: '',
  billing_company_name: '',
  billing_address_line_1: '',
  billing_address_line_2: '',
  billing_city: '',
  billing_state: '',
  billing_zip_code: '',
  billing_country: '',
  billing_latitude: 45.32352,
  billing_longitude: 102.65658,
  billing_address_type: '',
};


const AddAddress = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userToken = useSelector(state => state.user.userToken);

  const [isClicked, setIsClicked] = React.useState(false);
  const [loader, setLoader] = useState(false);

  const [shippingAddressDetails, dispatchShippingAddressDetails] = useReducer(shippingAddressDetailsReducer, initialValue);

  const [billingAddressDetails, dispatchbillingAddressDetails] = useReducer(billingAddressDetailsReducer, billingInitialValue);
  const [shippingAddressErr, setShippingAddressErr] = useState({
    first_name: false,
    last_name: false,
    phone: false,
    email: false,
    address_line_1: false,
    city: false,
    state: false,
    zip_code: false,
    country: false,
    address_type: false,
  });

  const [billingAddressErr, setBillingAddressErr] = useState({
    billing_first_name: false,
    billing_last_name: false,
    billing_phone: false,
    billing_email: false,
    billing_address_line_1: false,
    billing_city: false,
    billing_state: false,
    billing_zip_code: false,
    billing_country: false,
    billing_address_type: false,
  });

  const residentialIconPath = Image.resolveAssetSource(residentialIcon).uri;
  const commercialIconPath = Image.resolveAssetSource(commercialIcon).uri;

  React.useEffect(() => {
    const address_id = route?.params?.address_id;
    if (address_id) {
      paramsHandler(address_id);
    }
  }, [route?.params,]);

  const paramsHandler = async (address_id) => {
    const result = await getApiWithToken(userToken, `${Service.ADDRESS_DETAILS}/${address_id}`);
    const shippingAddressParams = result?.data?.data;
    const billingAddressParams = result?.data?.billing;
    console.log("ADDRESS_DETAILS...",result?.data);
    if (shippingAddressParams) {
      dispatchShippingAddressDetails({
        payload: {
          id: shippingAddressParams.id,
          first_name: shippingAddressParams.first_name,
          middle_name: shippingAddressParams.middle_name,
          last_name: shippingAddressParams.last_name,
          phone: shippingAddressParams.phone,
          email: shippingAddressParams.email,
          company_name: shippingAddressParams.company_name,
          address_line_1: shippingAddressParams.address_line_1,
          address_line_2: shippingAddressParams.address_line_2,
          city: shippingAddressParams.city,
          state: shippingAddressParams.state,
          zip_code: shippingAddressParams.zip_code,
          country: shippingAddressParams.country,
          latitude: shippingAddressParams.latitude,
          longitude: shippingAddressParams.longitude,
          address_type: shippingAddressParams.address_type,
        },
      });
      // console.log('shoaib 1', billingAddressParams)
      if (billingAddressParams) {
        dispatchbillingAddressDetails({
          payload: {
            billing_first_name: billingAddressParams.first_name,
            billing_middle_name: billingAddressParams.middle_name,
            billing_last_name: billingAddressParams.last_name,
            billing_phone: billingAddressParams.phone,
            billing_email: billingAddressParams.email,
            billing_company_name: billingAddressParams.company_name,
            billing_address_line_1: billingAddressParams.address_line_1,
            billing_address_line_2: billingAddressParams.address_line_2,
            billing_city: billingAddressParams.city,
            billing_state: billingAddressParams.state,
            billing_zip_code: billingAddressParams.zip_code,
            billing_country: billingAddressParams.country,
            billing_latitude: billingAddressParams.latitude,
            billing_longitude: billingAddressParams.longitude,
            billing_address_type: billingAddressParams.address_type,
          },
        });
      }
      if (shippingAddressParams.billing_checkbox) {
        setIsClicked(true);
        dispatchbillingAddressDetails({
          payload: {
            billing_first_name: shippingAddressParams.first_name,
            billing_middle_name: shippingAddressParams.middle_name,
            billing_last_name: shippingAddressParams.last_name,
            billing_phone: shippingAddressParams.phone,
            billing_email: shippingAddressParams.email,
            billing_company_name: shippingAddressParams.company_name,
            billing_address_line_1: shippingAddressParams.address_line_1,
            billing_address_line_2: shippingAddressParams.address_line_2,
            billing_city: shippingAddressParams.city,
            billing_state: shippingAddressParams.state,
            billing_zip_code: shippingAddressParams.zip_code,
            billing_country: shippingAddressParams.country,
            billing_latitude: shippingAddressParams.latitude,
            billing_longitude: shippingAddressParams.longitude,
            billing_address_type: shippingAddressParams.address_type,
          },
        });
      }
    }
  };

  const onChangeCheckValue = (value) => {
    if (value) {
      dispatchbillingAddressDetails({
        payload: {
          billing_first_name: shippingAddressDetails.first_name,
          billing_middle_name: shippingAddressDetails.middle_name,
          billing_last_name: shippingAddressDetails.last_name,
          billing_phone: shippingAddressDetails.phone,
          billing_email: shippingAddressDetails.email,
          billing_company_name: shippingAddressDetails.company_name,
          billing_address_line_1: shippingAddressDetails.address_line_1,
          billing_address_line_2: shippingAddressDetails.address_line_2,
          billing_city: shippingAddressDetails.city,
          billing_state: shippingAddressDetails.state,
          billing_zip_code: shippingAddressDetails.zip_code,
          billing_country: shippingAddressDetails.country,
          billing_latitude: shippingAddressDetails.latitude,
          billing_longitude: shippingAddressDetails.longitude,
          billing_address_type: shippingAddressDetails.address_type,
        },
      });
    }
    setIsClicked(value);
  };

  const onChangeFirstName = (value) => {
    dispatchShippingAddressDetails({ type: 'first_name', payload: value });
  };
  const onChangeMiddleName = (value) => {
    dispatchShippingAddressDetails({ type: 'middle_name', payload: value });
  };
  const onChangeLastName = (value) => {
    dispatchShippingAddressDetails({ type: 'last_name', payload: value });
  };
  const onChangePhoneNumber = (value) => {
    dispatchShippingAddressDetails({ type: 'phone', payload: value });
  };
  const onChangeEmail = (value) => {
    dispatchShippingAddressDetails({ type: 'email', payload: value });
  };
  const onChangeCompanyName = (value) => {
    dispatchShippingAddressDetails({ type: 'company_name', payload: value });
  };
  const onChangeAddressOne = (value) => {
    dispatchShippingAddressDetails({ type: 'address_line_1', payload: value });
  };
  const onChangeAddressTwo = (value) => {
    dispatchShippingAddressDetails({ type: 'address_line_2', payload: value });
  };
  const onChangeCity = (value) => {
    dispatchShippingAddressDetails({ type: 'city', payload: value });
  };
  const onChangeState = (value) => {
    dispatchShippingAddressDetails({ type: 'state', payload: value });
  };
  const onChangeZipCode = (value) => {
    dispatchShippingAddressDetails({ type: 'zip_code', payload: value });
  };
  const onChangeCountry = (value) => {
    dispatchShippingAddressDetails({ type: 'country', payload: value });
  };


  const onChangeBillingFirstName = (value) => {
    dispatchbillingAddressDetails({ type: 'first_name', payload: value });
  };
  const onChangeBillingMiddleName = (value) => {
    dispatchbillingAddressDetails({ type: 'middle_name', payload: value });
  };
  const onChangeBillingLastName = (value) => {
    dispatchbillingAddressDetails({ type: 'last_name', payload: value });
  };
  const onChangeBillingPhoneNumber = (value) => {
    dispatchbillingAddressDetails({ type: 'phone', payload: value });
  };
  const onChangeBillingEmail = (value) => {
    dispatchbillingAddressDetails({ type: 'email', payload: value });
  };
  const onChangeBillingCompanyName = (value) => {
    dispatchbillingAddressDetails({ type: 'company_name', payload: value });
  };
  const onChangeBillingAddressOne = (value) => {
    dispatchbillingAddressDetails({ type: 'address_line_1', payload: value });
  };
  const onChangeBillingAddressTwo = (value) => {
    dispatchbillingAddressDetails({ type: 'address_line_2', payload: value });
  };
  const onChangeBillingCity = (value) => {
    dispatchbillingAddressDetails({ type: 'city', payload: value });
  };
  const onChangeBillingState = (value) => {
    dispatchbillingAddressDetails({ type: 'state', payload: value });
  };
  const onChangeBillingZipCode = (value) => {
    dispatchbillingAddressDetails({ type: 'zip_code', payload: value });
  };
  const onChangeBillingCountry = (value) => {
    dispatchbillingAddressDetails({ type: 'country', payload: value });
  };

  const addressTypeHandler = (type, category) => {
    if (category === 'shipping') {
      setShippingAddressErr(preData => ({
        ...preData,
        address_type: false,
      }));
      if (type === 'residential') {
        dispatchShippingAddressDetails({ type: 'address_type', payload: type });
      }
      else {
        dispatchShippingAddressDetails({ type: 'address_type', payload: type });
      }
    }
    else {
      setBillingAddressErr(preData => ({
        ...preData,
        billing_address_type: false,
      }));
      if (type === 'residential') {
        dispatchbillingAddressDetails({ type: 'address_type', payload: type });
      }
      else {
        dispatchbillingAddressDetails({ type: 'address_type', payload: type });
      }
    }
  };

  const shippingAddressValidator = () => {
    const err = {
      first_name: false,
      last_name: false,
      phone: false,
      email: false,
      address_line_1: false,
      city: false,
      state: false,
      zip_code: false,
      country: false,
      address_type: false,
    };

    const billingErr = {
      billing_first_name: false,
      billing_last_name: false,
      billing_phone: false,
      billing_email: false,
      billing_address_line_1: false,
      billing_city: false,
      billing_state: false,
      billing_zip_code: false,
      billing_country: false,
      billing_address_type: false,
    };
    
    let billingValidation = false;
    if (!isClicked) {
      const { billing_first_name, billing_last_name, billing_phone, billing_email, billing_address_line_1, billing_city, billing_state, billing_zip_code, billing_country, billing_address_type } = billingAddressDetails;
      if (billing_first_name.length > 0 && billing_last_name.length > 0 && billing_phone.length > 0 && billing_email.length > 0 && billing_address_line_1.length > 0 && billing_city.length > 0 && billing_state.length > 0 && billing_zip_code.length > 0 && billing_country.length > 0 && billing_address_type.length > 0) {
        billingValidation = true;
      }
      if (!billingValidation) {
        if (billing_first_name.length === 0) {
          billingErr.billing_first_name = true;
        }
        if (billing_last_name.length === 0) {
          billingErr.billing_last_name = true;
        }
        if (billing_phone.length === 0) {
          billingErr.billing_phone = true;
        }
        if (billing_email.length === 0) {
          billingErr.billing_email = true;
        }
        if (billing_address_line_1.length === 0) {
          billingErr.billing_address_line_1 = true;
        }
        if (billing_city.length === 0) {
          billingErr.billing_city = true;
        }
        if (billing_state.length === 0) {
          billingErr.billing_state = true;
        }
        if (billing_zip_code.length === 0) {
          billingErr.billing_zip_code = true;
        }
        if (billing_country.length === 0) {
          billingErr.billing_country = true;
        }
        if (billing_address_type.length === 0) {
          billingErr.billing_address_type = true;
        }
        setBillingAddressErr(preData => ({
          ...preData,
          ...billingErr,
        }));
      }
    }
  

    if (isClicked) {
      billingValidation = true;
      setBillingAddressErr(preData => ({
        ...billingErr,
      }));
    }
    const { first_name, last_name, phone, email, address_line_1, city, state, zip_code, country, address_type } = shippingAddressDetails;
    if (first_name.length > 0 && last_name.length > 0 && phone.length > 0 && email.length > 0 && address_line_1.length > 0 && city.length > 0 && state.length > 0 && zip_code.length > 0 && country.length > 0 && address_type.length > 0) {
      return true && billingValidation;
    }
    if (first_name.length === 0) {
      err.first_name = true;
    }
    if (last_name.length === 0) {
      err.last_name = true;
    }
    if (phone.length === 0) {
      err.phone = true;
    }
    if (email.length === 0) {
      err.email = true;
    }
    if (address_line_1.length === 0) {
      err.address_line_1 = true;
    }
    if (city.length === 0) {
      err.city = true;
    }
    if (state.length === 0) {
      err.state = true;
    }
    if (zip_code.length === 0) {
      err.zip_code = true;
    }
    if (country.length === 0) {
      err.country = true;
    }
    if (address_type.length === 0) {
      err.address_type = true;
    }
    setShippingAddressErr(preData => ({
      ...preData,
      ...err,
    }));
    return false;
    
  };
//Amit kumar 12 mar modify UI and functionality issues
  const addAddressHandler = async () => {
    // console.log("shippingAddressDetails.phone.trim().length",shippingAddressDetails.phone.trim().length);
   try {
      setLoader(true);
      const validator = shippingAddressValidator();
      if (validator) {
        if(shippingAddressDetails.phone.trim().length < 14){
          Toast.show({
            type: 'error',
            text1: 'Please Enter Valid Phone Number',
          });
          return ; 
        } else if (route?.params?.address_id) {
          const postData = { ...shippingAddressDetails, billing_checkbox: Number(isClicked), ...billingAddressDetails };
          console.log("Address-postdata",{postData})
          const response = await Service.postJsonApiWithToken(userToken, Service.UPDATE_ADDRESS, postData);
          if (response.data.status) {
            Toast.show({
              type: 'success',
              text1: 'Address updated successfully.',
            });
            navigation.navigate(ScreenNames.ADDRESSESS);
          }
          else if (!response.data.status) {
            Toast.show({
              tyep: 'error',
              text1: response?.data?.message,
            });
          }
        }
        else  {
          const response = await Service.postJsonApiWithToken(userToken, Service.ADD_NEW_ADDRESS, { ...shippingAddressDetails, address_line_1: '4009 Marathon Blvd', city: 'Austin', state: 'TX', country: 'US', zip_code: '78756', ...billingAddressDetails, billing_checkbox: Number(isClicked), billing_address_line_1: '4009 Marathon Blvd', billing_city: 'Austin', billing_state: 'TX', billing_country: 'US', billing_zip_code: '78756' });
          if (response.data.status) {
            Toast.show({
              type: 'success',
              text1: 'Address added successfully.',
            });
            navigation.navigate(ScreenNames.ADDRESSESS);
          }
          else if (!response.data.status) {
            Toast.show({
              tyep: 'error',
              text1: response?.data?.message,
            });
          }
        }
      }
     
      else if (!validator) {
        Toast.show({
          type: 'info',
          text1: 'Please fill all required field.',
        });
        return;
      }
    
     
    } catch (err) {
      console.log('add new address err', err.message);
    } finally {
      setLoader(false);
    }
  };

  console.log({ isClicked });
  return (
    <View style={styles.container}>
      <MyHeader isBackButton={true} IsCartIcon={false} style={{ height: hg(13) }} />
        <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.subContainer}>
            <MyText text="Shipping Address" marginBottom={hg(1.5)} fontSize={20} />
            <MyTextInput placeholder="First Name" onChangeText={onChangeFirstName} value={shippingAddressDetails.first_name} isOnChangeText={true} style={{ borderColor: 'red', borderWidth: shippingAddressErr.first_name ? 1 : 0 }} />
            <MyTextInput placeholder="Middle Name (Optional)" onChangeText={onChangeMiddleName} value={shippingAddressDetails.middle_name} isOnChangeText={true} />
            <MyTextInput placeholder="Last Name" onChangeText={onChangeLastName} value={shippingAddressDetails.last_name} isOnChangeText={true}
              style={{ borderColor: 'red', borderWidth: shippingAddressErr.last_name ? 1 : 0 }} />

            {/* <MyTextInput placeholder="Phone Number" onChangeText={onChangePhoneNumber} value={shippingAddressDetails.phone} isOnChangeText={true} keyboardType="numeric" maxLength={10} style={{ borderColor: 'red', borderWidth: shippingAddressErr.phone ? 1 : 0 }} /> */}
            <View style={{ marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.05,
        elevation: 2,
        borderColor: 'red', borderWidth: shippingAddressErr.phone ? 1 : 0 }}>
            <MaskInput
              value={shippingAddressDetails.phone}
              keyboardType="numeric"
              placeholder="Phone Number"
              placeholderTextColor={'#CECECE'}
              style={{color: '#000', padding: 10,
              paddingLeft: 20,
              borderRadius: 5,
              width: '72%',
              height: 58,fontSize:14}}
              onChangeText={(masked, unmasked) => {
                onChangePhoneNumber(masked); // you can use the unmasked value as well

                // assuming you typed "9" all the way:
                console.log(masked); // (99) 99999-9999
                console.log(unmasked); // 99999999999
              }}
              mask={[
                '(',
                /\d/,
                /\d/,
                /\d/,
                ')',
                ' ',
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
            />
            </View>
            

            {/* <Dropdown placeholder="Phone Number" data={[1, 2, 3]} /> */}
            <MyTextInput placeholder="Email Address" onChangeText={onChangeEmail} value={shippingAddressDetails.email} isOnChangeText={true}
              style={{ borderColor: 'red', borderWidth: shippingAddressErr.email ? 1 : 0 }} />
            <MyTextInput placeholder="Company Name (Optional)" onChangeText={onChangeCompanyName} value={shippingAddressDetails.company_name} isOnChangeText={true} />
            <MyTextInput placeholder="Address Line One" onChangeText={onChangeAddressOne} value={shippingAddressDetails.address_line_1} isOnChangeText={true} style={{ borderColor: 'red', borderWidth: shippingAddressErr.address_line_1 ? 1 : 0 }} />
            <MyTextInput placeholder="Address Line Two (Optional)" onChangeText={onChangeAddressTwo} value={shippingAddressDetails.address_line_2} isOnChangeText={true} />
            <MyTextInput placeholder="City" onChangeText={onChangeCity} value={shippingAddressDetails.city} isOnChangeText={true}
              style={{ borderColor: 'red', borderWidth: shippingAddressErr.city ? 1 : 0 }} />
            <MyTextInput placeholder="State" onChangeText={onChangeState} value={shippingAddressDetails.state} isOnChangeText={true}
              style={{ borderColor: 'red', borderWidth: shippingAddressErr.state ? 1 : 0 }} />
            <MyTextInput placeholder="Zip Code" onChangeText={onChangeZipCode} value={shippingAddressDetails.zip_code} isOnChangeText={true} keyboardType="numeric" style={{ borderColor: 'red', borderWidth: shippingAddressErr.zip_code ? 1 : 0 }} />
            <MyTextInput placeholder="Country" onChangeText={onChangeCountry} value={shippingAddressDetails.country} isOnChangeText={true}
              style={{ borderColor: 'red', borderWidth: shippingAddressErr.country ? 1 : 0 }} />
            <View>
              <Text style={{ color: 'gray' }}>Type of address</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: wd(90), height: hg(8) }}>
                <TouchableOpacity style={{ height: '80%', width: wd(35), borderWidth: wd(0.5), borderColor: shippingAddressErr.address_type ? 'red' : (shippingAddressDetails.address_type === 'residential' ? Colors.THEME_GOLD : 'gray'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: wd(5) }} onPress={() => { addressTypeHandler('residential', 'shipping'); }}>
                  <Image source={{ uri: residentialIconPath }} resizeMode="contain" style={{ height: hg(3), width: '30%' }} />
                  <Text style={{ color: 'black' }}>Residential</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ height: '80%', width: wd(35), borderWidth: wd(0.5), borderColor: shippingAddressErr.address_type ? 'red' : (shippingAddressDetails.address_type === 'commercial' ? Colors.THEME_GOLD : 'gray'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: wd(5), marginLeft: wd(4) }} onPress={() => { addressTypeHandler('commercial', 'shipping'); }}>
                  <Image source={{ uri: commercialIconPath }} resizeMode="contain" style={{ height: hg(3), width: '30%' }} />
                  <Text style={{ color: 'black' }}>Commercial</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={{marginVertical: hg(1)}}>
            <Divider />
          </View> */}
            <MyText text="Billing Address" marginBottom={hg(1.5)} fontSize={20} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hg(2) }}>
              <Check onChangeCheckValue={onChangeCheckValue} value={isClicked} />
              <Text style={{ color: 'black', marginLeft: wd(3) }}>Same as shipping address</Text>
            </View>
            {!isClicked && <>
              <MyTextInput placeholder="First Name" onChangeText={onChangeBillingFirstName} value={billingAddressDetails.billing_first_name} isOnChangeText={true} style={{ borderColor: 'red', borderWidth: billingAddressErr.billing_first_name ? 1 : 0 }} />
              <MyTextInput placeholder="Middle Name (Optional)" onChangeText={onChangeBillingMiddleName} value={billingAddressDetails.billing_middle_name} isOnChangeText={true} />
              <MyTextInput placeholder="Last Name" onChangeText={onChangeBillingLastName} value={billingAddressDetails.billing_last_name} isOnChangeText={true} style={{ borderColor: 'red', borderWidth: billingAddressErr.billing_last_name ? 1 : 0 }} />

              {/* <MyTextInput placeholder="Phone Number" onChangeText={onChangeBillingPhoneNumber} value={billingAddressDetails.billing_phone} isOnChangeText={true} keyboardType="numeric" maxLength={10} style={{ borderColor: 'red', borderWidth: billingAddressErr.billing_phone ? 1 : 0 }} /> */}
              <View style={{ marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.05,
        elevation: 2,
        borderColor: 'red', borderWidth: billingAddressErr.billing_phone ? 1 : 0 }}>
            <MaskInput
              value={billingAddressDetails.billing_phone}
              keyboardType="numeric"
              placeholder="Phone Number"
              placeholderTextColor={'#CECECE'}
              style={{color: '#000',  padding: 10,
              paddingLeft: 20,
              borderRadius: 5,
              width: '72%',
              height: 58,fontSize:14}}
              onChangeText={(masked, unmasked) => {
                onChangeBillingPhoneNumber(masked); // you can use the unmasked value as well

                // assuming you typed "9" all the way:
                console.log(masked); // (99) 99999-9999
                console.log(unmasked); // 99999999999
              }}
              mask={[
                '(',
                /\d/,
                /\d/,
                /\d/,
                ')',
                ' ',
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
            />
            </View>

              {/* <Dropdown placeholder="Phone Number" data={[1, 2, 3]} /> */}
              <MyTextInput placeholder="Email Address" onChangeText={onChangeBillingEmail} value={billingAddressDetails.billing_email} isOnChangeText={true} style={{ borderColor: 'red', borderWidth: billingAddressErr.billing_email ? 1 : 0 }} />
              <MyTextInput placeholder="Company Name (Optional)" onChangeText={onChangeBillingCompanyName} value={billingAddressDetails.billing_company_name} isOnChangeText={true} />
              <MyTextInput placeholder="Address Line One" onChangeText={onChangeBillingAddressOne} value={billingAddressDetails.billing_address_line_1} isOnChangeText={true} style={{ borderColor: 'red', borderWidth: billingAddressErr.billing_address_line_1 ? 1 : 0 }} />
              <MyTextInput placeholder="Address Line Two (Optional)" onChangeText={onChangeBillingAddressTwo} value={billingAddressDetails.billing_address_line_2} isOnChangeText={true} />
              <MyTextInput placeholder="City" onChangeText={onChangeBillingCity} value={billingAddressDetails.billing_city} isOnChangeText={true}
                style={{ borderColor: 'red', borderWidth: billingAddressErr.billing_city ? 1 : 0 }} />
              <MyTextInput placeholder="State" onChangeText={onChangeBillingState} value={billingAddressDetails.billing_state} isOnChangeText={true} style={{ borderColor: 'red', borderWidth: billingAddressErr.billing_state ? 1 : 0 }} />
              <MyTextInput placeholder="Zip Code" onChangeText={onChangeBillingZipCode} value={billingAddressDetails.billing_zip_code} isOnChangeText={true} keyboardType="numeric" style={{ borderColor: 'red', borderWidth: billingAddressErr.billing_zip_code ? 1 : 0 }} />
              <MyTextInput placeholder="Country" onChangeText={onChangeBillingCountry} value={billingAddressDetails.billing_country} isOnChangeText={true} style={{ borderColor: 'red', borderWidth: billingAddressErr.billing_country ? 1 : 0 }} />
              <View>
                <Text style={{ color: 'gray' }}>Type of address</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: wd(90), height: hg(8) }}>
                  <TouchableOpacity style={{ height: '80%', width: wd(35), borderWidth: wd(0.5), borderColor: billingAddressErr.billing_address_type ? 'red' : (billingAddressDetails.billing_address_type === 'residential' ? Colors.THEME_GOLD : 'gray'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: wd(5) }} onPress={() => { addressTypeHandler('residential', 'billing'); }}>
                    <Image source={{ uri: residentialIconPath }} resizeMode="contain" style={{ height: hg(3), width: '30%' }} />
                    <Text style={{ color: 'black' }}>Residential</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ height: '80%', width: wd(35), borderWidth: wd(0.5), borderColor: billingAddressErr.billing_address_type ? 'red' : (billingAddressDetails.billing_address_type === 'commercial' ? Colors.THEME_GOLD : 'gray'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: wd(5), marginLeft: wd(4) }} onPress={() => { addressTypeHandler('commercial', 'billing'); }}>
                    <Image source={{ uri: commercialIconPath }} resizeMode="contain" style={{ height: hg(3), width: '30%' }} />
                    <Text style={{ color: 'black' }}>Commercial</Text>
                  </TouchableOpacity>
                </View>
              </View></>}
            <View style={styles.saveAddress}>
              <MyButton text='Save Address' onPress={addAddressHandler} />
            </View>
        </View>
        </KeyboardAwareScrollView>
      {<CustomLoader showLoader={loader} />}
    </View>
  );
};


export default AddAddress;

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  subContainer: {
    padding:20
  },
  dropdownStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    width: '100%',
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
});