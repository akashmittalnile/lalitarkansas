import React, {useState} from 'react';
import {
  View,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
//global
import {Colors} from 'global/Index';
import MyText from 'components/MyText/MyText';
import {styles} from './MyMultiSelectStyle';
import {AntDesign} from 'global/MyIcon';

import {MultiSelect} from 'react-native-element-dropdown';

const MyMultiSelect = ({value, setValue, data, placeholder, style = {}}) => {
  const [isFocus, setIsFocus] = useState(false);
  const renderItem = item => {
    console.log('item', item);
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        {value.find(el => el === item.value) && (
          <Image source={require('assets/images/checkbox-selected.png')} />
        )}
        {/* <AntDesign style={styles.icon} color="black" name="Safety" size={20} /> */}
      </View>
    );
  };
  return (
    <MultiSelect
      //   style={[styles.dropdown, style, isFocus && { borderColor: Colors.THEME_ORANGE }]}
      style={[styles.dropdown, style]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      itemTextStyle={styles.itemTextStyle}
      iconStyle={styles.iconStyle}
      data={data}
      selectedStyle={{backgroundColor: 'green'}}
      //   search
      maxHeight={300}
      labelField="label"
      valueField="value"
      //   placeholder={!isFocus ? placeholder : '...'}
      placeholder={placeholder}
      searchPlaceholder="Search..."
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={item => {
        setValue(item);
        setIsFocus(false);
      }}
      renderItem={renderItem}
      renderSelectedItem={(item, unSelect) => (
        <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
          <View style={styles.selectedStyle}>
            <MyText
              text={item.label}
              textColor="black"
              fontSize={14}
              style={styles.textSelectedStyle}
            />
            {/* <Text style={styles.textSelectedStyle}>{item.label}</Text> */}
            {/* <AntDesign color="black" name="delete" size={17} /> */}
            <Image
              source={require('assets/images/volume-mute.png')}
              style={styles.closeIcon}
            />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default MyMultiSelect;
