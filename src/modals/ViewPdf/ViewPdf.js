//import : react components
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import : custom components
import MyText from 'components/MyText/MyText';
//import : globals
import {Colors, Constant, MyIcon, ScreenNames} from 'global/Index';
//import : styles
import {styles} from './ViewPdfStyle';
// import Modal from 'react-native-modal';
import MyButton from '../../components/MyButton/MyButton';
import {width} from '../../global/Constant';
import Pdf from 'react-native-pdf';
import FAB_Button from '../../components/FAB_Button/FAB_Button';

const ViewPdf = ({visible, setVisibility, pdfLink, handleDownload}) => {
  const [pdfHeight, setPdfHeight] = useState(null);
  const [pdfWidth, setPdfWidth] = useState(null);
  //variables : navigation
  const navigation = useNavigation();
  //function : navigation function
  //function : modal function
  const closeModal = () => {
    setVisibility(false);
  };
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={closeModal} style={{flex: 1}}>
          <Image
            source={require('assets/images/back-arrow.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <View style={styles.titleView}>
          <MyText
            text="PDF"
            textColor={Colors.DARK_GREY}
            textAlign="center"
            fontSize={16}
            fontFamily="medium"
          />
        </View>
        <View style={{flex: 1}} />
      </View>
    );
  };
  //UI
  return (
    <Modal
      isVisible={visible}
      onRequestClose={closeModal}
      animationType="fade"
      transparent>
      <View style={styles.container}>
        <TouchableOpacity style={styles.blurView} onPress={closeModal} />
        <View style={styles.mainView}>
          {renderHeader()}
          <View
            style={[
              styles.pdfContainer,
              // pdfHeight === null ? {} : {height: pdfHeight}
            ]}>
            <Pdf
              source={{uri: pdfLink}}
              // source={{uri: `http://samples.leanpub.com/thereactnativebook-sample.pdf`}}
              trustAllCerts={false}
              onLoadComplete={(
                numberOfPages,
                path,
                {width, height},
                tableContents,
              ) => {
                console.log(`Number of pages: ${numberOfPages}`);
                console.log(`{width, height}`, {width, height});
                setPdfHeight(height);
                setPdfWidth(width);
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
              style={[
                styles.crseImg,
                // pdfHeight === null ? {} : {height: pdfHeight, width: pdfWidth}
              ]}
            />
          </View>
          <FAB_Button
            icon={<Image source={require('assets/images/download-icon.png')} />}
            bottom={50}
            onPress={()=>{
              closeModal()
              handleDownload()
            }}
          />
          {/* <MyButton
            text="Download Certificate"
            style={{
              width: '100%',
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
              alignSelf: 'center',
              position: 'absolute',
              bottom: 50,
            }}
            onPress={handleDownload}
          /> */}
        </View>
      </View>
    </Modal>
  );
};

export default ViewPdf;
