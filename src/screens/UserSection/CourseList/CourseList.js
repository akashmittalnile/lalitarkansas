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
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from 'react-native';
//import : custom components
import MyHeader from 'components/MyHeader/MyHeader';
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
//import : global
import {Colors, Constant, MyIcon, ScreenNames, Service} from 'global/Index';
//import : styles
import {styles} from './CourseListStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import OrdersFilter from '../../../modals/OrdersFilter/OrdersFilter';
import Review from '../../../modals/Review/Review';
import {THEME_BROWN} from '../../../global/Colors';

const courseData = [
  {
    id: '1',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 1,
  },
  {
    id: '2',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 2,
  },
  {
    id: '3',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 1,
  },
  {
    id: '4',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 5,
  },
  {
    id: '5',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 1,
  },
  {
    id: '6',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 4,
  },
  {
    id: '7',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 2,
  },
  {
    id: '8',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 2,
  },
];

const CourseList = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);

  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Course List" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={styles.mainView}>
          <View style={{height: 22}}></View>
          {courseData?.map(item => (
            <View style={styles.pdfContainer}>
              <Image source={require('assets/images/book.png')} />
              <View style={{marginLeft: 12, width: '80%'}}>
                <View style={styles.courseCompletionNumRow}>
                  <MyText
                    text={item.completedLessons}
                    textColor={Colors.THEME_GOLD}
                    fontSise={13}
                    fontFamily="regular"
                    style={{}}
                  />
                  <MyText
                    text={'/' + item.totalLessons}
                    textColor={Colors.THEME_BROWN}
                    fontSise={13}
                    fontFamily="regular"
                    style={{}}
                  />
                </View>
                <MyText
                  text={item.name}
                  textColor={Colors.LIGHT_GREY}
                  fontSise={14}
                  fontFamily="medium"
                  style={{}}
                />
                <View style={styles.courseCompletionLine}>
                  <Divider
                    style={{
                      borderWidth: 1,
                      backgroundColor: Colors.THEME_BROWN,
                      borderColor: Colors.THEME_BROWN,
                      flex: item.completedLessons,
                    }}
                  />
                  <Divider
                    style={{
                      borderWidth: 1,
                      backgroundColor: Colors.THEME_GOLD,
                      borderColor: Colors.THEME_GOLD,
                      flex: item.totalLessons - item.completedLessons,
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(CourseList);
