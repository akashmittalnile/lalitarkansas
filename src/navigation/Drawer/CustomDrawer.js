//import : react components
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';
import { CommonActions } from '@react-navigation/core';
//import : custom components
import MyText from 'components/MyText/MyText';
import CustomLoaderLogout from 'components/CustomLoader/CustomLoaderLogout';
//import : global
import { Colors, ScreenNames, Service } from 'global/Index';
//import : styles
import { styles } from './CustomDrawerStyle';
//import : modal
//import : third parties
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
//import : redux
import { useSelector, useDispatch } from 'react-redux';
import { logOutUser, setUser } from 'src/reduxToolkit/reducer/user';
import CustomLoader from '../../components/CustomLoader/CustomLoader';

const CustomDrawer = ({ navigation }) => {
  //variables
  const userToken = useSelector(state => state.user.userToken);
  const dispatch = useDispatch();
  //hook : states
  const [showLoader, setShowLoader] = useState(false);
  //function : imp function
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  //function : navigation function
  const closeDrawer = () => navigation.closeDrawer();

  const resetIndexGoToSignup = CommonActions.reset({
    index: 1,
    routes: [{ name: ScreenNames.SIGN_UP_1 }],
  });
  const gotoSignUp = () => {
    closeDrawer();
    navigation.dispatch(resetIndexGoToSignup);
  };
  const gotoHome = () => {
    navigation.navigate(ScreenNames.BOTTOM_TAB, { screen: ScreenNames.HOME });
  };
  const gotoSuperAdminCourses = () => {
    navigation.navigate(ScreenNames.SUPER_ADMIN_COURSES);
  };
  const gotoAllProducts = () => {
    navigation.navigate(ScreenNames.ALL_PRODUCTS);
  };
  const gotoMyWhishlist = () => {
    navigation.navigate(ScreenNames.BOTTOM_TAB, {
      screen: ScreenNames.WISHLIST,
    });
  };
  const gotoMyOrders = () => {
    navigation.navigate(ScreenNames.MY_ORDERS);
  };
  const gotoWelcome = () =>
    CommonActions.reset({
      index: 1,
      routes: [{ name: ScreenNames.WELCOME }],
    });
// Function to handle logout
  const logout = async () => {
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.LOGOUT,
        {},
      );
      console.log('logout resp', resp?.data);
      if (resp?.data?.status) {
        closeDrawer();
        navigation.dispatch(gotoWelcome);
        dispatch(logOutUser());
        await AsyncStorage.clear();
      }
    } catch (error) {
      console.log('error in logout', error);
    }
    setShowLoader(false);
  };
  //UI
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: '20%' }}>
        <View style={styles.mainView}>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={require('../../assets/images/logo.png')}
          />
          <TouchableOpacity
            style={styles.crossImage}
            onPress={() => {
              closeDrawer();
            }}>
            <Image
              resizeMode="contain"
              // style={styles.image}
              source={require('../../assets/images/close-circle.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={{ padding: 20, paddingLeft: 28, paddingRight: 24 }}>
          <DrawerItemList
            Title="Home"
            image={require('assets/images/home-sb.png')}
            onPress={gotoHome}
          />
          <DrawerItemList
            Title="My Wishlist"
            image={require('assets/images/wishlist-sb.png')}
            onPress={gotoMyWhishlist}
          />
          <DrawerItemList
            Title="My Courses"
            image={require('assets/images/my-courses-sb.png')}
            onPress={gotoMyOrders}
          />
          <DrawerItemList
            Title="Arkansas Courses"
            image={require('assets/images/my-courses-sb.png')}
            onPress={gotoSuperAdminCourses}
          />
          <DrawerItemList
            Title="Products"
            image={require('assets/images/products-img.png')}
            onPress={gotoAllProducts}
          />
          <DrawerItemList
            Title="About Us"
            image={require('assets/images/about-us-sb.png')}
            onPress={() => { }}
          />
          <DrawerItemList
            Title="Help & Support"
            image={require('assets/images/help-and-support-sb.png')}
          />
          <DrawerItemList
            Title="Terms & Conditions"
            image={require('assets/images/terms-sb.png')}
          />
          <DrawerItemList
            Title="Privacy Policy"
            image={require('assets/images/privacy-sb.png')}
          />
          <DrawerItemList
            Title="Logout"
            image={require('assets/images/logout-sb.png')}
            onPress={logout}
          />
        </View>
        <View style={styles.socialMediaContainer}>
          <MyText
            text={'Follow Us!'}
            fontSize={12}
            textColor="black"
            fontFamily="regular"
            style={{ marginBottom: 15 }}
          />
          <View style={styles.socialRow}>
            <Image
              source={require('assets/images/fb.png')}
              style={{ height: 18, width: 18 }}
            />
            <Image
              source={require('assets/images/youtube.png')}
              style={{ marginLeft: 5 }}
            />
            <Image
              source={require('assets/images/instagram.png')}
              style={{ marginLeft: 5 }}
            />
            <Image
              source={require('assets/images/twitter.png')}
              style={{ marginLeft: 5 }}
            />
          </View>
        </View>

        <MyText
          text={'App Version: V1.0.0.12'}
          fontSize={14}
          textColor="#C0C0C0"
          fontFamily="regular"
          style={{ marginLeft: 26, marginTop: 36 }}
        />

        {/* <Text style={styles.versionText}>App Version: V1.0.0.12</Text> */}
      </ScrollView>
      <CustomLoader text="Logging Out...." showLoader={showLoader} />
    </View>
  );
};

export default CustomDrawer;

export const DrawerItemList = ({ Title = '', image, onPress = () => { } }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        // width: '90%',
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={image} />
        <MyText
          text={Title}
          fontSize={14}
          textColor="white"
          fontFamily="medium"
          style={{ marginLeft: 14 }}
        />
      </View>
      <Image source={require('assets/images/white-right.png')} />
    </TouchableOpacity>
  );
};
