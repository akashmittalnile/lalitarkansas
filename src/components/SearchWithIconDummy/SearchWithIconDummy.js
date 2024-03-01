//react components
import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
//global
import {Colors, MyIcon} from 'global/Index';
import MyText from 'components/MyText/MyText';
//import : styles
import {styles} from './SearchWithIconDummyStyle';

const SearchWithIconDummy = ({
  placeholder,
  icon = <MyIcon.AntDesign name="search1" color={Colors.WHITE} size={24} />,
  onPress = () => {},
  style = {},
}) => {
  //UI
  return (
    <TouchableOpacity onPress={onPress} style={{...styles.searchContainer, ...style}}>
      <View style={styles.textViewStyle}>
        <MyText text={placeholder} textAlign='center' fontSize={14} textColor='#8F93A0' />
      </View>
      <View style={styles.iconView}>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

export default SearchWithIconDummy;
