//import : react components
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
//import : custom components
import MyHeader from 'components/MyHeader/MyHeader';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import { WebView } from 'react-native-webview';
//import : styles
import { styles } from './SideMenuLinksStyle';
//import : redux

const SideMenuLinks = ({ navigation, route }) => {
  //variables : redux variables
  //variables : route variables

  const [showLoader, setShowLoader] = useState(false);
  const [showLoader2, setShowLoader2] = useState(false);

  //UI
  return (
    <View style={styles.container}>
      <MyHeader
        Title={route?.params?.name}
        isBackButton
        IsCartIcon={false}
        IsNotificationIcon={false}
      />

      <WebView
        source={{ uri: route?.params?.link }}
        contentMode="mobile"
        style={styles.webViewStyle}
      />
      <CustomLoader showLoader={showLoader} />
    </View>
  );
};

export default SideMenuLinks;
