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
import {styles} from './OrderHistoryTabStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
import NameEnterValue from '../../../../../components/NameEnterValue/NameEnterValue';
import MyButton from '../../../../../components/MyButton/MyButton';

const OrderHistoryTab = ({orderHistoryData, viewDetails}) => {
  const renderOrder = ({item}) => {
    return (
      <View style={styles.courseContainer}>
        <View style={styles.courseTopRow}>
          <MyText
            text={`Order ID: ${item.orderId}`}
            fontFamily="medium"
            fontSize={12}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <View style={styles.statusRow}>
            <MyText
              text={item.ago}
              fontFamily="medium"
              fontSize={12}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
          </View>
        </View>
        <View style={styles.courseSubContainer}>
          <ImageBackground source={item.courseImg} style={styles.crseImg}>
            {/* <TouchableOpacity>
            <Image source={require('assets/images/play-icon.png')} />
          </TouchableOpacity> */}
          </ImageBackground>
          <View style={{marginLeft: 11, width: width * 0.5}}>
            <MyText
              text={item.courseName}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.middleRow}>
              <View style={styles.ratingRow}>
                <Image source={require('assets/images/star.png')} />
                <MyText
                  text={item.courseRating}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  letterSpacing={0.13}
                  style={{marginLeft: 5}}
                />
              </View>
              <View style={styles.crtrRow}>
                <Image
                  source={require('assets/images/profile-circle.png')}
                  // style={styles.crtrImg}
                />
                <MyText
                  text={item.creatorName}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.THEME_GOLD}
                  letterSpacing={0.13}
                  style={{marginLeft: 10}}
                />
              </View>
            </View>
            <View style={styles.bottomRow}>
              <MyText
                text={'$' + item.courseFee}
                fontFamily="bold"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.14}
                style={{}}
              />
              <MyButton
                text="View Details"
                style={{
                  width: '50%',
                  height: 35,
                  marginTop: 8,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                textColor={Colors.THEME_GOLD}
                onPress={viewDetails}
              />
            </View>
            <View style={styles.tickRow}>
              <Image source={require('assets/images/small-tick.png')} />
              <MyText
                text={'Course Successfully Purchased!'}
                fontFamily="medium"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                style={{}}
              />
            </View>
          </View>
        </View>
        <Divider
          style={{borderColor: '#ECECEC', marginTop: 11, marginBottom: 5}}
        />
        <TouchableOpacity style={{alignSelf: 'center'}}>
          <MyText
            text={'Download Payment Invoice'}
            fontFamily="medium"
            fontSize={14}
            textColor={Colors.THEME_GOLD}
            style={{}}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <FlatList
      data={orderHistoryData}
      style={{marginTop: 28}}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderOrder}
    />
  );
};

export default OrderHistoryTab;
