//react components
import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {Colors} from '../../global/Index';

const SafeView = props => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      {props.children}
    </SafeAreaView>
  );
};

export default SafeView;
