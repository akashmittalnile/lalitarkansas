import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';
import MyText from 'components/MyText/MyText';
import {Colors, MyIcon} from 'global/Index';

const DateSelector = ({
  Title = 'Today',
  onPress = () => {},
  calenderViewStyle = {},
  dateViewStyle = {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{...styles.calendarView, ...calenderViewStyle}}>
      <View style={{...styles.selectedDateView, ...dateViewStyle}}>
        <MyText text={Title} />
        <MyIcon.AntDesign name="down" />
      </View>
      <TouchableOpacity onPress={onPress} style={styles.calendarIcon}>
        {/* <MyIcon.AntDesign
          name="calendar"
          size={24}
          color={Colors.THEME_GREEN}
        /> */}
        <Image source={require('assets/images/mmyy.png')} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default DateSelector;

const styles = StyleSheet.create({
  calendarView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    backgroundColor: Colors.WHITE,
    shadowRadius: 15,
    elevation: 2,
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
  },
  selectedDateView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '85%',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },

  calendarIcon: {
    backgroundColor: Colors.BG_GREEN,
    borderRadius: 5,
  },
});
