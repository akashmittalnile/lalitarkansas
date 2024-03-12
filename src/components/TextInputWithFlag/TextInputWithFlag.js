//import : react components
import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
//import : custom
import MyText from 'components/MyText/MyText';
//import : global
import {Colors, MyIcon} from 'global/Index';
//import : styles
import {styles} from './TextInputWithFlagStyle';

const TextInputWithFlag = ({
  inputRef,
  value,
  placeholder = '',
  maxLength,
  onSubmitEditing,
  onChangeText,
  keyboardType,
  placeholderTextColor = '#c9c9c9',
  color = Colors.BLACK,
  Flag = '🇺🇸',
  CountryCode = '+1',
  style = {},
  onPress = () => {},
}) => {
  //states
  //variables
  // //function : imp function
  // const validateLength = () => {
  //   if (value.length > 0) {
  //     if (value.length >= 10) {
  //       return true;
  //     }
  //   } else if (placeholder.length >= 10) {
  //     return true;
  //   } else return false;
  // };
  //UI
  return (
    <View style={{...styles.flagNumberView, ...style}}>
      <View style={styles.flexRowView}>
        <TouchableOpacity
          onPress={onPress}
          style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 12}}>
          {/* <Image
            resizeMode="contain"
            source={{uri: flag_url}}
            style={{height: 24, width: 24, borderRadius: 5}}
          /> */}
          <MyText text={Flag} />
          <MyIcon.AntDesign
            name="caretdown"
            color="black"
            style={{marginHorizontal: 10}}
          />
        </TouchableOpacity>

        <View style={{borderLeftWidth: 0.5, height: 24, marginRight: 10}} />
        <MyText text={CountryCode} marginHorizontal={10} />
        <TextInput
          ref={inputRef}
          value={value}
          allowFontScaling={false}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
          keyboardType={keyboardType}
          color={color}
        />
      </View>
      {/* {validateLength() ? (
        <MyIcon.AntDesign
          name="checkcircleo"
          size={24}
          color={Colors.THEME_GREEN}
        />
      ) : (
        <MyIcon.Feather name="x-circle" size={24} color={Colors.RED} />
      )} */}
    </View>
  );
};

export default TextInputWithFlag;
