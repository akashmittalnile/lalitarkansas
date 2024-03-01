//react components
import React from 'react';
import {View, Platform, ActivityIndicator} from 'react-native';
//global
import {Colors} from 'global/Index';
import MyText from 'components/MyText/MyText';

const CustomLoader = ({showLoader, text = 'Loading....'}) => {
  //UI
  return (
    <>
      {showLoader ? (
        <View
          style={{
            position: 'absolute',
            backgroundColor:
              Platform.OS === 'android'
                ? Colors.BLACK + 'aa'
                : Colors.BLACK + '66',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100
          }}>
          <ActivityIndicator
            animating={true}
            size="large"
            color={Colors.WHITE}
          />
          <MyText
            text={text}
            fontSize={16}
            fontFamily="medium"
            textColor="white"
            marginVertical={10}
          />
        </View>
      ) : null}
    </>
  );
};

export default CustomLoader;
