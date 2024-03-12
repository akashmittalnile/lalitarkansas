//import : react components
import React, {useEffect, useRef, useState} from 'react';
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
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
//import : custom components
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
//import : global
import {Colors, Constant, MyIcon, ScreenNames, Service} from 'global/Index';
//import : styles
import {styles} from './NotificationsTabStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
import NameEnterValue from '../../../../../components/NameEnterValue/NameEnterValue';
import MyButton from '../../../../../components/MyButton/MyButton';

const NotificationsTab = ({notificationsEnabled, setNotificationsEnabled}) => {
  return (
    <View style={{}}>
      <View style={styles.settingsContainer}>
        <MyText
          text={'General Notification Settings My Courses'}
          fontSize={18}
          fontFamily="semiBold"
          textColor={Colors.LIGHT_GREY}
          style={{marginBottom: 12}}
        />
        <TouchableWithoutFeedback
          onPress={() => setNotificationsEnabled(!notificationsEnabled)}>
          <View style={styles.checkBoxRow}>
            <Image
              source={
                notificationsEnabled
                  ? require('assets/images/checked.png')
                  : require('assets/images/unchecked.png')
              }
            />
            <MyText
              text={'Receive an email when someone replies to my discussion'}
              fontSize={13}
              fontFamily="regular"
              textColor={Colors.LIGHT_GREY}
              style={{marginLeft: 10}}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <MyButton
        text="SAVE CHANGES"
        style={{
          marginTop: 15,
          marginBottom: 10,
          backgroundColor: Colors.THEME_GOLD,
        }}
      />
      <MyButton
        text="CLEAR ALL"
        style={{
          marginBottom: 10,
          backgroundColor: Colors.THEME_BROWN,
        }}
      />
    </View>
  );
};

export default NotificationsTab;
