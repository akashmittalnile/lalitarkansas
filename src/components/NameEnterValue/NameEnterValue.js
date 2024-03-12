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
  StyleSheet,
} from 'react-native';
import MyText from 'components/MyText/MyText';
import MyTextInput from '../MyTextInput/MyTextInput';

const NameEnterValue = ({
  name,
  value,
  setValue,
  editable = true,
  inputStyle = {},
  textInputstyle = {},
  multiline = false,
  height = 50,
  inputRef,
  onSubmitEditing = () => {},
  placeholder = '',
  secureTextEntry,
}) => {
  return (
    <View style={[styles.serialNumContainer]}>
      <MyText text={name} fontSize={14} fontFamily="medium" textColor="black" />
      <MyTextInput
        inputRef={inputRef}
        value={value}
        setValue={setValue}
        style={{...{marginTop: 5, width: '100%'}, ...inputStyle}}
        textInputstyle={textInputstyle}
        placeholder={placeholder}
        editable={editable}
        multiline={multiline}
        height={height}
        secureTextEntry={secureTextEntry}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

export default NameEnterValue;

const styles = StyleSheet.create({
  serialNumContainer: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 4,
  },
});
