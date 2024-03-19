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
  SafeAreaView,
  StatusBar,
  RefreshControl
} from 'react-native';
//import : custom components
import MyHeader from 'components/MyHeader/MyHeader';
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
import {CommonActions} from '@react-navigation/native';
//import : third parties
import { ScrollView } from 'react-native-virtualized-view';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
//import : global
import { Colors, Constant, MyIcon, ScreenNames, Service } from 'global/Index';
//import : styles
import { styles } from './NotificationsStyle';
//import : modal
//import : redux
import { connect, useSelector } from 'react-redux';
import { width, height } from 'global/Constant';
import Divider from 'components/Divider/Divider';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import OrdersFilter from '../../../modals/OrdersFilter/OrdersFilter';
import Review from '../../../modals/Review/Review';
import { THEME_BROWN } from '../../../global/Colors';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserNotifications } from '../../../reduxToolkit/reducer/user';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const notificationsList = [
  {
    id: '1',
    name: 'Course Successfully Purchased!',
    subtext: 'Order number #8787387',
    ago: '10h ago',
    type: 'purchased',
  },
  {
    id: '2',
    name: 'Course Successfully Purchased!',
    subtext: 'Order number #8787387',
    ago: '10h ago',
    type: 'purchased',
  },
  {
    id: '3',
    name: 'Password Changed Successfully',
    ago: '10h ago',
    type: 'password-changed',
  },
  {
    id: '4',
    name: 'Resume your course',
    subtext: 'Chapter 2: Tattoo Design …',
    ago: '10h ago',
    type: 'resume-course',
  },
  {
    id: '5',
    name: 'Order Placed',
    subtext: `O'Reilly's tattoo machine Motor`,
    ago: '10h ago',
    type: 'order-placed',
  },
  {
    id: '6',
    name: 'Shipped',
    subtext: `O'Reilly's tattoo machine Motor`,
    ago: '10h ago',
    type: 'shipped',
  },
  {
    id: '7',
    name: 'Out of delivery',
    subtext: `O'Reilly's tattoo machine Motor`,
    ago: '10h ago',
    type: 'out-of-delivery',
  },
  {
    id: '8',
    name: 'Delivered',
    subtext: `O'Reilly's tattoo machine Motor`,
    ago: '10h ago',
    type: 'delivered',
  },
];

const Notifications = ({ navigation, dispatch }) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [notificationsData, setNotificationsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getNotifications();
  }, []);
  const checkcon = () => {
    getNotifications();
  };
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    checkcon();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);
  const getNotifications = async () => {
    !showLoader && setShowLoader(true);
    try {
      const resp = await Service.getApiWithToken(
        userToken,
        Service.NOTIFICATIONS,
      );
      console.log('getNotifications resp', JSON.stringify(resp?.data));
      if (resp?.data?.status) {
        setNotificationsData(resp?.data?.data);
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in getNotifications', error);
    }
    setShowLoader(false);
  };
  const clearNotifications = async () => {
    setShowLoader(true);
    try {
      const resp = await Service.getApiWithToken(
        userToken,
        Service.CLEAR_NOTIFICATIONS,
      );
      console.log('clearNotifications resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({
          type: 'info',
          text1: 'Notification cleared successfully',
        });
        const isNotificaton = false;
        dispatch(setUserNotifications(isNotificaton));
        await AsyncStorage.setItem(
          'userNotifications',
          JSON.stringify(isNotificaton),
        );
        getNotifications();
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in clearNotifications', error);
    }
    showLoader && setShowLoader(false);
  };
  const resetIndexGoToHome = CommonActions.reset({
    index: 1,
    routes: [{name: ScreenNames.BOTTOM_TAB}],
  });
  const gotoHome = () => {
    navigation.dispatch(resetIndexGoToHome);
  };

  // const Icon = type => {
  //   let source = '';
  //   if (type.type === 'purchased') {
  //     source = require('assets/images/book.png');
  //   } else if (type.type === 'password-changed') {
  //     source = require('assets/images/password-changed.png');
  //   } else if (type.type === 'resume-course') {
  //     source = require('assets/images/resume-course.png');
  //   } else if (type.type === 'order-placed') {
  //     source = require('assets/images/order-placed.png');
  //   } else if (
  //     type.type === 'shipped' ||
  //     type.type === 'out-of-delivery' ||
  //     type.type === 'delivered'
  //   ) {
  //     source = require('assets/images/shipped.png');
  //   }
  //   return <Image source={source} />;
  // };
  const Icon = ({ type }) => {
    console.log('icon type', type);
    let source = '';
    if (type === 'course') {
      source = require('assets/images/book.png');
    } else if (type === 'password') {
      source = require('assets/images/password-changed.png');
    } else if (type === 'order') {
      source = require('assets/images/order-placed.png');
    }
    // else if (
    //   type === 'shipped' ||
    //   type === 'out-of-delivery' ||
    //   type === 'delivered'
    // ) {
    //   source = require('assets/images/shipped.png');
    // }
    return <Image source={source} />;
  };

  const onClickNotification = () =>{};
  
  const renderNotifucation = notificationsData?.map(item => {
    return (
      <View >
        <TouchableOpacity style={styles.notiContainer} activeOpacity={0.7} onPress={onClickNotification}>
          <Icon type={item?.module_name} />
          <View style={{ marginLeft: 12, width: '65%' }}>
            <MyText
              text={item?.title}
              textColor={Colors.LIGHT_GREY}
              fontSize={14}
              fontFamily="medium"
              style={{}}
            />
            {item?.message ? (
              <MyText
                text={item?.message}
                textColor={Colors.LIGHT_GREY}
                fontSise={13}
                fontFamily="regular"
                style={{}}
              />
            ) : null}
          </View>
        </TouchableOpacity>
        <MyText
          text={getDiff(item.created_at)}
          textColor={Colors.LIGHT_GREY}
          fontSise={14}
          fontFamily="light"
          style={{ position: 'absolute', right: 10,top:6 }}
        />
      </View>
    );
  });
  //UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Notifications" isBackButton IsCartIcon={false} IsNotificationIcon={false} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: '20%' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.mainView}>
          {notificationsData?.length > 0 ? (
            <View style={styles.notificationCountView}>
              <MyText
                text={`${notificationsData?.length} ${notificationsData.length === 1
                  ? 'Unread Notification'
                  : 'Unread Notifications'
                  }`}
                marginVertical={20}
                fontFamily="medium"
              />
              <TouchableOpacity onPress={clearNotifications}>
                <MyText
                  // text={'Mark all as read'}
                  text={'Clear All'}
                  fontSize={16}
                  textColor={Colors.THEME_BROWN}
                  fontFamily="medium"
                  // textColor="white"
                  textAlign="right"
                  marginVertical={10}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          {notificationsData?.length > 0 ? (
            renderNotifucation.reverse()
          ) : (
            <View style={{ marginTop: 80, alignItems: 'center' }}>
              <View style={styles.iconBg}>
                <Image
                  source={require('assets/images/notification-bing.png')}
                />
              </View>
              <MyText
                text={'No Notification Yet'}
                textColor={'black'}
                fontSize={40}
                textAlign="center"
                fontFamily="medium"
                style={{}}
              />
              <MyText
                text={
                  'Stay Connected!  &  Informed with Our Notification Center'
                }
                textColor={Colors.LIGHT_GREY}
                fontSize={18}
                fontFamily="medium"
                textAlign="center"
                style={{ marginTop: 10, marginBottom: 53 }}
              />
              <MyButton
                text="Go Home"
                style={{
                  width: width * 0.9,
                  marginBottom: 10,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={gotoHome}
              />
            </View>
          )}
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(Notifications);

const getDiff = created_date => {
  console.log({ created_date })
  let diff = null;
  const diffYears = moment().diff(created_date, 'years');
  if (diffYears > 0) {
    if (diffYears > 1) {
      diff = diffYears + ' yrs ago';
    } else {
      diff = diffYears + ' yr ago';
    }
    return diff;
  }
  const diffMonths = moment().diff(created_date, 'months');
  if (diffMonths > 0) {
    if (diffMonths > 1) {
      diff = diffMonths + ' months ago';
    } else {
      diff = diffMonths + ' month ago';
    }
    return diff;
  }
  const diffdays = moment().diff(created_date, 'days');
  if (diffdays > 0) {
    if (diffdays > 1) {
      diff = diffdays + ' days ago';
    } else {
      diff = diffdays + ' day ago';
    }
    return diff;
  }
  const diffHours = moment().diff(created_date, 'hours');
  const diffMinutes = moment().diff(created_date, 'minutes');
  const diffOnlyMinutes = diffMinutes % 60;
  if (diffHours > 0) {
    let hr = diffHours > 1 ? ' hrs ' : ' hr ';
    let min = diffOnlyMinutes > 1 ? ' mins' : ' min';
    diff = diffHours + hr + diffOnlyMinutes + min + ' ago';
    return diff;
  }
};
