//import : react components
import React, { useEffect, useRef, useState } from 'react';
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
  ImageBackground,
} from 'react-native';
//import : custom components
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
//import : global
import { Colors, Constant, MyIcon, ScreenNames, Service } from 'global/Index';
//import : styles
import { styles } from './CertificateTabStyle';
//import : modal
//import : redux
import { connect, useSelector } from 'react-redux';
import { width, height } from 'global/Constant';
import Divider from 'components/Divider/Divider';
import NameEnterValue from '../../../../../components/NameEnterValue/NameEnterValue';
import MyButton from '../../../../../components/MyButton/MyButton';
import defaultCreatorImg from "../../../../../assets/images/default-content-creator-image.png";

const CertificateTab = ({
  certificateList,
  downloadCertificate,
  openInBrowser,
  setShowViewPdfModal,
  setPdfLink,
  setPdfTitle,
}) => {
  // console.warn("certificateList",certificateList);
  const defaultCreatorImgPath = Image.resolveAssetSource(defaultCreatorImg).uri;
  const renderCertificate = ({ item }) => {
    return (
      <View style={styles.courseContainer}>
        <View style={styles.courseSubContainer}>
          <ImageBackground
            source={{ uri: item?.thumbnail }}
            style={styles.crseImg}
            imageStyle={{ borderRadius: 10 }}></ImageBackground>
          {/* <View style={styles.crseImg}>
            <Pdf
              source={{uri: item?.download_pdf}}
              trustAllCerts={false}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={error => {
                console.log(error);
              }}
              onPressLink={uri => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={styles.crseImg}
            />
          </View> */}
          <View style={{ marginLeft: 11, width: width * 0.55 }}>
            <MyText
              text={item.title}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.middleRow}>
              <View style={styles.ratingRow}>
              <View style={{height:10,width:10,justifyContent:'center',alignItems:'center'}}>
          <Image resizeMode='contain' source={require('assets/images/star.png')} style={{height:12,minWidth:12}} />
           </View>
                <MyText
                  text={item.avg_rating}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  letterSpacing={0.13}
                  style={{ marginLeft: 5 }}
                />
              </View>
              <View style={styles.crtrRow}>
                {/* <Image
                  source={require('assets/images/profile-circle.png')}
                  // style={styles.crtrImg}
                /> */}
                <Image
                  source={{ uri: item?.creator_image ? item?.creator_image : defaultCreatorImgPath }}
                  style={styles.createImgStyle}
                />
                <MyText
                  text={item.creator_name}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.THEME_GOLD}
                  letterSpacing={0.13}
                  numberOfLines={1}
                  style={{ marginLeft: 10, width: '70%' }}
                />
              </View>
            </View>
            <View style={styles.buttonsRow}>
              <MyButton
                text="VIEW"
                style={{
                  width: '35%',
                  height: 40,
                  marginTop: 8,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={() => {
                  // openInBrowser(item.download_pdf)
                  setShowViewPdfModal(true);
                  setPdfLink(item.download_pdf);
                  setPdfTitle(item.title);
                }}
              />
              <MyButton
                text="DOWNLOAD"
                style={{
                  width: '50%',
                  height: 40,
                  marginTop: 8,
                  marginLeft: 12,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={() =>
                  downloadCertificate(item?.download_pdf, item?.title)
                }
              />
            </View>
          </View>
        </View>
      </View>
    );
  };
  if (certificateList?.length === 0) {
    return (
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <Image source={require('assets/images/no-data.png')} />
        <MyText
          text={'No Certificates found'}
          fontFamily="medium"
          fontSize={40}
          textAlign="center"
          textColor={'black'}
        />
      </View>
    );
  }
  return (
    <FlatList
      data={certificateList}
      style={{ marginTop: 28 }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderCertificate}
    />
  );
};

export default CertificateTab;
