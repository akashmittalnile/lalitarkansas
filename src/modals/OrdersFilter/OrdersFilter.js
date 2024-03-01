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
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import : custom components
import MyText from 'components/MyText/MyText';
//import : globals
import {Colors, Constant, MyIcon, ScreenNames} from 'global/Index';
//import : styles
import {styles} from './OrdersFilterStyle';
import Modal from 'react-native-modal';
import MyButton from '../../components/MyButton/MyButton';
import {width} from '../../global/Constant';
import moment from 'moment';
import MyMultiSelect from '../../components/MyMultiSelect/MyMultiSelect';
import DateSelector from '../../components/DateSelector/DateSelector';
import Toast from 'react-native-toast-message';

const sliderRadius = 3;
const someWidth = 50;

const OrdersFilter = ({
  visible,
  setVisibility,
  onClearFilter,
  onApplyFilter,
  orderTypes,
  subjects,
  dateUploaded,
  changeOrderTypes,
  changeSubjects,
  changeDateUploaded,
  selectedOrderType,
  selectedSubject,
  selectedDateUploaded,
  multiSliderValue,
  multiSliderValuesChange,

  tabs,
  courseCategries,
  productCategries,
  temporarySelectedTab,
  setTemporarySelectedTab,
  tempSelectedCourseCategries,
  setTempSelectedCourseCategries,
  TempSelectedProductCategries,
  setTempSelectedProductCategries,
  tempStartDate,
  setOpenTempStartDate,
  tempEndDate,
  setOpenTempEndDate,
  applyFilters,
  resetFilter,
}) => {
  //variables : navigation
  const navigation = useNavigation();
  //function : navigation function
  //function : modal function
  const closeModal = () => {
    setVisibility(false);
  };
  const CustomLabel = props => {
    console.log('props', props);
    return (
      <View style={{position: 'relative'}}>
        <TouchableOpacity
          onPress={props.oneMarkerPressed}
          style={{
            left:
              props.oneMarkerLeftPosition - someWidth / 2 + sliderRadius + 15,
            position: 'absolute',
            bottom: -60,
            minWidth: someWidth,
          }}>
          <MyText
            text={`$${props.oneMarkerValue}`}
            textColor={Colors.LIGHT_GREY}
            fontSize={12}
            fontFamily="medium"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.oneMarkerPressed}
          style={{
            left:
              props.twoMarkerLeftPosition - someWidth / 2 + sliderRadius - 2,
            position: 'absolute',
            bottom: -60,
            minWidth: someWidth,
          }}>
          <MyText
            text={`$${props.twoMarkerValue}`}
            textColor={Colors.LIGHT_GREY}
            fontSize={12}
            fontFamily="medium"
          />
        </TouchableOpacity>
      </View>
    );
  };
  const getCategoryDropdownData = () => {
    // console.log('getCategoryDropdownData', temporarySelectedTab);
    const data =
      temporarySelectedTab === '1' ? courseCategries : productCategries;
    return data?.map(el => ({label: el.name, value: el.name}));
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
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
      <View style={styles.modalContent}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={closeModal}>
              <Image source={require('assets/images/arrow-left-black.png')} />
            </TouchableOpacity>
            <MyText
              text="Filters"
              textColor={Colors.DARK_GREY}
              fontSize={16}
              fontFamily="medium"
              style={{position: 'absolute', left: '45%'}}
            />
          </View>
          {/* <MyText
            text="Choose Order Type"
            textColor={Colors.DARK_GREY}
            fontSize={16}
            fontFamily="medium"
            style={{marginTop: 47, marginBottom: 14}}
          />
          <View style={styles.row}>
            {orderTypes?.map((item, index) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => {
                  changeOrderTypes(item.id);
                }}>
                <View
                  style={[
                    styles.row,
                    index === 1 || index === 2 ? {marginLeft: 30} : null,
                  ]}>
                  <Image
                    source={
                      selectedOrderType === item.id
                        ? require('assets/images/selected-2.png')
                        : require('assets/images/not-selected.png')
                    }
                    style={{height: 22, width: 22}}
                  />
                  <MyText
                    text={item.name}
                    textColor={Colors.DARK_GREY}
                    fontSize={16}
                    fontFamily="medium"
                    style={{marginLeft: 10}}
                  />
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View> */}
          <MyText
            text={'Select Type'}
            textColor={Colors.DARK_GREY}
            fontSize={16}
            fontFamily="medium"
            marginBottom={14}
            marginTop={40}
          />
          {tabs?.map((el, index) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setTemporarySelectedTab(el?.id);
                // on change type, remove older selected category data
                if (temporarySelectedTab !== el?.id) {
                  el?.id == '2'
                    ? setTempSelectedCourseCategries([])
                    : setTempSelectedProductCategries([]);
                }
              }}>
              <View style={styles.statusView}>
                <Image
                  source={
                    temporarySelectedTab === el?.id
                      ? require('assets/images/selected-2.png')
                      : require('assets/images/not-selected.png')
                  }
                  style={{width: 22, height: 22}}
                />
                <MyText
                  text={el?.name}
                  textColor={Colors.DARK_GREY}
                  fontSize={14}
                  marginLeft={10}
                />
              </View>
            </TouchableWithoutFeedback>
          ))}
          <MyText
            text="Choose Category"
            textColor={Colors.DARK_GREY}
            fontSize={16}
            fontFamily="medium"
            style={{marginTop: 25, marginBottom: 14}}
          />
          <MyMultiSelect
            data={getCategoryDropdownData()}
            value={
              temporarySelectedTab == '1'
                ? tempSelectedCourseCategries
                : TempSelectedProductCategries
            }
            setValue={
              temporarySelectedTab == '1'
                ? setTempSelectedCourseCategries
                : setTempSelectedProductCategries
            }
            placeholder={'Select Categories'}
            style={{marginBottom: 0, backgroundColor: 'white'}}
          />
          {temporarySelectedTab == '1' ? (
            <>
              <MyText
                text="Select Start Date and End Date"
                textColor={Colors.DARK_GREY}
                fontSize={16}
                fontFamily="medium"
                style={{marginTop: 35, marginBottom: 14}}
              />
              <View style={styles.datesRow}>
                <DateSelector
                  Title={
                    tempStartDate == ''
                      ? 'Select Date'
                      : moment(tempStartDate).format('DD-MM-YYYY')
                  }
                  onPress={() => {
                    setOpenTempStartDate(true);
                  }}
                  calenderViewStyle={{
                    width: '48%',
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                  dateViewStyle={{borderWidth: 0}}
                />
                <DateSelector
                  Title={
                    tempEndDate == ''
                      ? 'Select Date'
                      : moment(tempEndDate).format('DD-MM-YYYY')
                  }
                  onPress={() => {
                    setOpenTempEndDate(true);
                  }}
                  calenderViewStyle={{
                    width: '48%',
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                  dateViewStyle={{borderWidth: 0}}
                />
              </View>
            </>
          ) : null}
          {/* <View style={styles.row}>
            {dateUploaded?.map((item, index) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => {
                  changeDateUploaded(item.id);
                }}>
                <View
                  style={[
                    styles.row,
                    index === 1 || index === 2 ? {marginLeft: 30} : null,
                  ]}>
                  <Image
                    source={
                      selectedDateUploaded === item.id
                        ? require('assets/images/selected-2.png')
                        : require('assets/images/not-selected.png')
                    }
                    style={{height: 22, width: 22}}
                  />
                  <MyText
                    text={item.name}
                    textColor={Colors.DARK_GREY}
                    fontSize={16}
                    fontFamily="medium"
                    style={{marginLeft: 10}}
                  />
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View> */}
          <MyButton
            text="APPLY"
            style={{
              width: width * 0.9,
              marginTop: 41,
              marginBottom: 10,
              backgroundColor: Colors.THEME_GOLD,
            }}
            onPress={() => {
              if (temporarySelectedTab == '1') {
                if (tempStartDate == '' && tempEndDate != '') {
                  Toast.show({
                    text1: `Please select both Start Date and End Date`,
                  });
                  return;
                }
                if (tempStartDate != '' && tempEndDate == '') {
                  Toast.show({
                    text1: `Please select both Start Date and End Date`,
                  });
                  return;
                }
              }
              applyFilters();
            }}
          />
          <MyButton
            text="CLEAR"
            style={{
              width: width * 0.9,
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
            }}
            onPress={resetFilter}
          />
        </ScrollView>
      </View>
      {/* </KeyboardAvoidingView> */}
    </Modal>
  );
};

export default OrdersFilter;
