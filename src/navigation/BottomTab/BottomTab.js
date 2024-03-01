/* eslint-disable react/no-unstable-nested-components */
//react components
import React from 'react';
import {View, Image, Text} from 'react-native';
//custom components
import MyText from 'components/MyText/MyText';
//Bottom Tab
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
//global
import {Colors, ScreenNames, MyIcon, Images} from 'global/Index';
//styles
import {styles} from './BottomTabStyle';
//screens
import Home from 'screens/UserSection/Home/Home';
import Wishlist from 'screens/UserSection/Wishlist/Wishlist';
import MyOrders from 'screens/UserSection/MyOrders/MyOrders';
import Profile from 'screens/UserSection/Profile/Profile';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

const BottomTab = ({userToken}) => {
  const userInfo = useSelector(state => state.user.userInfo);
  //variables
  const Tab = createBottomTabNavigator();
  const screenOptions = {
    showLabel: false,
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: styles.navigatorStyle,
  };
  // backBehavior = order - return to previous tab (in the order they are shown in the tab bar)
  // backBehavior = history - return to last visited tab
  console.log('Bottom Tab');
  return (
    <Tab.Navigator backBehavior="history" screenOptions={screenOptions}>
      <Tab.Screen
        name={ScreenNames.HOME}
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.tabStyle}>
              {focused ? (
                <Image source={require('assets/images/home-2.png')} />
              ) : (
                <Image source={require('assets/images/home.png')} />
              )}
              <MyText
                text="Home"
                fontSize={14}
                fontFamily="medium"
                textColor={focused ? Colors.THEME_BLUE : Colors.LIGHT_GRAY}
                marginTop={5}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={ScreenNames.WISHLIST}
        component={Wishlist}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.tabStyle}>
              {focused ? (
                <Image source={require('assets/images/wishlist-2.png')} />
              ) : (
                <Image source={require('assets/images/wishlist.png')} />
              )}
              <MyText
                text="Wishlist"
                fontSize={14}
                fontFamily="medium"
                textColor={focused ? Colors.THEME_BLUE : Colors.LIGHT_GRAY}
                marginTop={5}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={ScreenNames.MY_ORDERS}
        component={MyOrders}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.tabStyle}>
              {focused ? (
                <Image source={require('assets/images/my-orders-2.png')} />
              ) : (
                <Image source={require('assets/images/my-orders.png')} />
              )}
              <MyText
                text="My Orders"
                fontSize={14}
                fontFamily="medium"
                textColor={focused ? Colors.THEME_BLUE : Colors.LIGHT_GRAY}
                marginTop={5}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={ScreenNames.PROFILE}
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.tabStyle}>
              {focused ? (
                <Image source={require('assets/images/profile-2.png')} />
              ) : (
                <Image source={require('assets/images/profile.png')} />
              )}
              <MyText
                text="Profile"
                fontSize={14}
                fontFamily="medium"
                textColor={focused ? Colors.THEME_BLUE : Colors.LIGHT_GRAY}
                marginTop={5}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
