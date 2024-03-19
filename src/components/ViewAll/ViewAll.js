//import : react components
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
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
import MyText from '../MyText/MyText';
import {styles} from './ViewAllStyle';

const ViewAll = ({
  text,
  onPress,
  showSeeAll = true,
  style = {},
  buttonText = 'See All',
}) => {
  return (
    <View style={[styles.container, style]}>
      <MyText
        text={text}
        fontFamily="medium"
        fontSize={18}
        textColor={'#455A64'}
      />
      {showSeeAll ? (
        <TouchableOpacity onPress={onPress} style={styles.viewAll}>
          <MyText
            text={buttonText}
            fontFamily="regular"
            fontSize={13}
            textColor={Colors.THEME_GOLD}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ViewAll;
