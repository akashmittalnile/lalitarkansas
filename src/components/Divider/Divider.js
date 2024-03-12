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
} from 'react-native';
import {Colors} from '../../global/Index';

const Divider = ({style = {}}) => {
  return (
    <View
      style={[{borderColor: Colors.THEME_GOLD, borderWidth: 1}, style]}></View>
  );
};

export default Divider;
