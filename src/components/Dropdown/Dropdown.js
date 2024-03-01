import React, { useState } from 'react';
import { View, Platform, ActivityIndicator, TouchableOpacity, Image, Text, TouchableWithoutFeedback } from 'react-native';
//global
import { Colors } from 'global/Index';
import MyText from 'components/MyText/MyText';
import { styles } from './DropdownStyle';
import { AntDesign } from 'global/MyIcon';

import { Dropdown as ElDropdown } from 'react-native-element-dropdown';


const Dropdown = ({value, setValue, data, placeholder, isCallFunc = false, callFunc = () => {}, isCustomIsFocus = false, customIsFocus = () => {},style = {}}) => {
    const [isFocus, setIsFocus] = useState(false);
    return (
        <ElDropdown
        //   style={[styles.dropdown, style, isFocus && { borderColor: Colors.THEME_ORANGE }]}
          style={[styles.dropdown, style]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          itemTextStyle={styles.itemTextStyle}
          iconStyle={styles.iconStyle}
          data={data}
        //   search
          maxHeight={300}
          labelField="label"
          valueField="value"
        //   placeholder={!isFocus ? placeholder : '...'}
          placeholder={placeholder}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => {
            if(isCustomIsFocus){
              customIsFocus()
            }
            setIsFocus(true)
          }}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            if(isCallFunc){
                callFunc(item.value)
            }else{
              setValue(item.value)
            }
            setIsFocus(false);
          }}
        //   renderLeftIcon={() => (
        //     <AntDesign
        //       style={styles.icon}
        //       color={isFocus ? 'blue' : 'black'}
        //       name="Safety"
        //       size={20}
        //     />
        //   )}
        />
    )
}

export default Dropdown
