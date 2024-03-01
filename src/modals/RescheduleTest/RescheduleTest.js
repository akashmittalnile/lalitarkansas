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
import {styles} from './RescheduleTestStyle';
import Modal from 'react-native-modal';
import MyButton from '../../components/MyButton/MyButton';
import {width} from '../../global/Constant';
import DateSelector from '../../components/DateSelector/DateSelector';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import DatePicker from 'react-native-date-picker';

const RescheduleTest = ({visible, setVisibility}) => {
  const [issueDate, setIssueDate] = useState(new Date());
  const [openIssueDate, setOpenIssueDate] = useState(false);
  const [testDate, setTestDate] = useState(new Date());
  const [openTestDate, setOpenTestDate] = useState(false);
  //variables : navigation
  const navigation = useNavigation();
  //function : navigation function
  //function : modal function
  const closeModal = () => {
    setVisibility(false);
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
        <MyText
          text="Reschedule Test"
          fontSize={20}
          fontFamily="regular"
          textColor={'black'}
          style={{marginBottom: 15}}
        />
        <DateSelector
          Title={
            moment(issueDate).format('YYYY-MM-DD') ==
            moment(new Date()).format('YYYY-MM-DD')
              ? 'Select Date'
              : // : moment(date).format('MMMM Do YYYY')
                moment(issueDate).format('DD-MM-YYYY')
          }
          onPress={() => {
            setOpenIssueDate(true);
          }}
          calenderViewStyle={{width: '100%'}}
          dateViewStyle={{borderWidth: 0}}
        />
        <View style={styles.infoView}>
          <Image source={require('assets/images/info-circle.png')} />
          <MyText
            text="Select date you want to restart this course study"
            fontSize={14}
            fontFamily="regular"
            textColor={'white'}
            style={{marginLeft: 5}}
          />
        </View>
        <DateSelector
          Title={
            moment(testDate).format('YYYY-MM-DD') ==
            moment(new Date()).format('YYYY-MM-DD')
              ? 'Select Expiry Date'
              : // : moment(date).format('MMMM Do YYYY')
                moment(testDate).format('DD-MM-YYYY')
          }
          onPress={() => setOpenTestDate(true)}
          calenderViewStyle={{width: '100%'}}
          dateViewStyle={{borderWidth: 0}}
        />
        <View style={styles.infoView}>
          <Image source={require('assets/images/info-circle.png')} />
          <MyText
            text="Select date you want to attempt test again You will receive notification to start you test again!"
            fontSize={14}
            fontFamily="regular"
            textColor={'white'}
            style={{marginLeft: 5}}
          />
        </View>
        <MyButton
          text="RESCHEDULE TEST"
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
      <DatePicker
        modal
        mode="date"
        // mode="time"
        open={openIssueDate}
        date={issueDate}
        onConfirm={time => {
          setOpenIssueDate(false);
          setIssueDate(time);
        }}
        onCancel={() => {
          setOpenIssueDate(false);
        }}
        minimumDate={new Date()}
      />
      <DatePicker
        modal
        mode="date"
        // mode="time"
        open={openTestDate}
        date={testDate}
        onConfirm={time => {
          setOpenTestDate(false);
          setTestDate(time);
        }}
        onCancel={() => {
          setTestDate(false);
        }}
        minimumDate={new Date()}
      />
    </Modal>
  );
};

export default RescheduleTest;
