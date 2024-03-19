//import : react components
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import : custom components
import MyText from 'components/MyText/MyText';
//import : globals
import {Colors, Constant, MyIcon, ScreenNames} from 'global/Index';
//import : styles
import {styles} from './CourseCompletedStyle';
import Modal from 'react-native-modal';
import MyButton from '../../components/MyButton/MyButton';
import {width} from '../../global/Constant';
// import ProgressCircle from 'react-native-progress-circle';

const courseData = {
  id: '1',
  creatorName: `Max Bryrant`,
  courseImg: '',
  courseName: 'Tattoo Cover-Ups & Transformations',
  courseRating: '4.7',
  courseFee: '399.00',
  status: 'Completed',
  courseValidDate: '26 Juny 2023',
  courseCompletedDate: '26 Juny 2023 9:30AM',
};

const CourseCompleted = ({visible, setVisibility}) => {
  //variables : navigation
  const navigation = useNavigation();
  //function : navigation function
  //function : modal function
  const closeModal = () => {
    setVisibility(false);
  };
  const RenderCourse = ({item}) => {
    return (
      <View style={[styles.courseContainer, {marginTop: 18}]}>
        <View style={styles.courseSubContainer}>
          <ImageBackground
            source={item.courseImg}
            style={styles.crseImg}
            imageStyle={{borderRadius: 10}}></ImageBackground>
          <View style={{marginLeft: 11, width: width * 0.55}}>
            <MyText
              text={item.courseName}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.middleRow}>
              <View style={styles.ratingRow}>
              <View style={{height:10,width:10,justifyContent:'center',alignItems:'center'}}>
          <Image resizeMode='contain' source={require('assets/images/star.png')} style={{height:12,minWidth:12}} />
           </View>
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
            {item.status === 'Completed' ? (
              <MyButton
                text="SUBMIT RATING & REVIEW"
                style={{
                  width: '90%',
                  height: 40,
                  marginTop: 8,
                  backgroundColor: Colors.THEME_BROWN,
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  };
  //UI
  return (
    <Modal
      isVisible={visible}
      swipeDirection="down"
      onBackdropPress={() => setVisibility(false)}
      onSwipeComplete={e => {
        setVisibility(false);
      }}
      scrollTo={() => {}}
      scrollOffset={1}
      propagateSwipe={true}
      coverScreen={false}
      backdropColor="transparent"
      style={styles.modal}>
      {/* <KeyboardAvoidingView
        style={{}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
      <View style={styles.modalContent}>
        <View style={{height: 10}}></View>
        {/* <ProgressCircle
          percent={95}
          radius={100}
          borderWidth={8}
          color={Colors.THEME_GOLD}
          shadowColor="#ECECEC"
          bgColor="#fff">
          <MyText
            text="95%"
            textColor="black"
            fontSize={27}
            fontFamily="medium"
          />
          <MyText
            text="OVERALL SCORE"
            textColor="black"
            fontSize={14}
            fontFamily="medium"
          />
        </ProgressCircle> */}
        <MyText
          text="Congratulations!"
          fontSize={24}
          fontFamily="medium"
          textColor={Colors.THEME_GOLD}
          style={{marginTop: 5}}
        />
        <MyText
          text="You Have Successfully Completed & Passed The Course Download Your Course Now!"
          fontSize={18}
          fontFamily="regular"
          textColor={Colors.LIGHT_GREY}
        />
        <RenderCourse item={courseData} />
        <MyButton
          text="VIEW YOUR CERTIFICATE"
          style={{
            width: width * 0.9,
            marginTop: 10,
            marginBottom: 20,
            backgroundColor: Colors.THEME_BROWN,
          }}
          onPress={closeModal}
        />
      </View>
      {/* </KeyboardAvoidingView> */}
    </Modal>
  );
};

export default CourseCompleted;
