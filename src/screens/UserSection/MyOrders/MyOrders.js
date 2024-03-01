/* eslint-disable no-shadow */
//import : react components
import React, { useEffect, useRef, useState } from 'react';
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
  RefreshControl,
  AppState
} from 'react-native';
import { useRoute, useIsFocused } from '@react-navigation/native';
//import : custom components
import MyHeader from 'components/MyHeader/MyHeader';
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
//import : global
import { Colors, Constant, MyIcon, ScreenNames, Service } from 'global/Index';
//import : styles
import { styles } from './MyOrdersStyle';
//import : modal
//import : redux
import { connect, useSelector } from 'react-redux';
import { width, height } from 'global/Constant';
import Divider from 'components/Divider/Divider';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import OrdersFilter from '../../../modals/OrdersFilter/OrdersFilter';
import Review from '../../../modals/Review/Review';
import { createThumbnail } from 'react-native-create-thumbnail';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { responsiveHeight as hg, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultImg from '../../../assets/images/default-content-creator-image.png';


const MyOrders = ({ navigation, dispatch }) => {
  const defaultImgPath = Image.resolveAssetSource(defaultImg).uri;
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedTab, setSelectedTab] = useState('1');
  const [selectedId, setSelectedId] = useState('1');
  const [selectedType, setSelectedType] = useState(null);
  const [review, setReview] = useState('');
  const [isReviewed, setIsReviewed] = useState(false);
  const [tabs, setTabs] = useState([
    {
      id: '1',
      name: 'Courses',
    },
    {
      id: '2',
      name: 'Products',
    },
  ]);
  const [orderTypes, setOrderTypes] = useState([
    {
      id: '1',
      name: 'All',
    },
    {
      id: '2',
      name: 'Ongoing',
    },
    {
      id: '3',
      name: 'Pickup',
    },
  ]);
  const [subjects, setSubjects] = useState([
    {
      id: '1',
      name: 'Permanent Makeup Training',
    },
    {
      id: '2',
      name: 'Tattooing & Piercing Institute',
    },
  ]);
  const [dateUploaded, setDateUploaded] = useState([
    {
      id: '1',
      name: 'This Week',
    },
    {
      id: '2',
      name: 'This Month',
    },
    {
      id: '3',
      name: 'This Year',
    },
  ]);
  const [selectedOrderType, setSelectedOrderType] = useState('1');
  const [selectedSubject, setSelectedSubject] = useState('1');
  const [selectedDateUploaded, setSelectedDateUploaded] = useState('1');
  const [multiSliderValue, setMultiSliderValue] = useState([0, 5000]);
  const [starRating, setStarRating] = useState(1);
  const [courseData, setCourseData] = useState([]);
  const [productData, setProductData] = useState([]);

  const [courseCategries, setCourseCategries] = useState([]);
  const [selectedCourseCategries, setSelectedCourseCategries] = useState([]);
  const [tempSelectedCourseCategries, setTempSelectedCourseCategries] =
    useState([]);
  const [productCategries, setProductCategries] = useState([]);
  const [selectedProductCategries, setSelectedProductCategries] = useState([]);
  const [TempSelectedProductCategries, setTempSelectedProductCategries] =
    useState([]);
  const [selectedRatingValues, setSelectedRatingValues] = useState([]);
  const [tempSelectedRatingValues, setTempSelectedRatingValues] = useState([]);
  const [temporarySelectedTab, setTemporarySelectedTab] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tempStartDate, setTempStartDate] = useState('');
  const [openTempStartDate, setOpenTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [openTempEndDate, setOpenTempEndDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const focused = useIsFocused();

  useEffect(() => {
    getMyOrders();
  }, [navigation]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setSearchValue('')
      setTemporarySelectedTab('1');
      setSelectedCourseCategries([])
      setTempSelectedCourseCategries([])
      setSelectedProductCategries([])
      setTempSelectedProductCategries([])
      setStartDate('')
      setEndDate('')
      setTempStartDate('')
      setTempEndDate('')
    });
    return unsubscribe;
  }, [navigation, focused]);

  useEffect(() => {
    getMyOrderSelectedTabHandler();
    getMyOrders();
  }, [focused]);

  const getMyOrderSelectedTabHandler = async () => {
    const id = await AsyncStorage.getItem('myOrderSelectedTab');
    if (id) {
      setSelectedTab(id);
    }
  };

  const getMyOrders = async (type = '1') => {
    setShowLoader(true);
    const formdata = new FormData();
    formdata.append('type', type);
    console.log({ type })
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.MY_ORDER,
        formdata,
      );
      console.log('getMyOrders resp', resp?.data);
      if (resp?.data?.status) {
        if (type === '1') {
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          // console.log('chal gya')
          setProductData(resp?.data?.data);
        }
        if (resp?.data?.category) {
          setCourseCategries(
            resp?.data?.category?.filter(el => el?.type == '1'),
          );
          setProductCategries(
            resp?.data?.category?.filter(el => el?.type == '2'),
          );
        }
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in getMyOrders', error);
    }
    setShowLoader(false);
  };
  const checkcon = () => {
    getMyOrders();
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
  const generateThumb = async data => {
    console.log('generateThumb');
    let updatedData = [...data];
    try {
      updatedData = await Promise.all(
        data?.map?.(async el => {
          // console.log('el.introduction_video trending', el.introduction_video);
          const thumb = await createThumbnail({
            url: el?.introduction_video,
            timeStamp: 1000,
          });
          return {
            ...el,
            thumb,
          };
        }),
      );
    } catch (error) {
      console.error('Error generating thumbnails:', error);
    }
    // console.log('thumb data SearchAllType', updatedData);
    return updatedData;
  };
  const showDateFilter = () => {
    if (selectedTab == '2') {
      return false;
    } else if (startDate !== '' && endDate !== '') {
      return true;
    }
    return false;
  };
  const isFilterApplied = () => {
    if (showSelectedCategories()) {
      return true;
    }
    return false;
  };
  const showSelectedCategories = () => {
    if (selectedTab === '1' && selectedCourseCategries?.length > 0) {
      return true;
    } else if (selectedTab === '2' && selectedProductCategries?.length > 0) {
      return true;
    }
    return false;
  };
  const ShowSelectedFilters = () => {
    return (
      <View>
        {showSelectedCategories() ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              backgroundColor: '#ede5ca',
              marginRight: 'auto',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              marginTop: 10,
            }}>
            <MyText
              text={'Categorie(s): '}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{}}
            />

            {selectedTab === '1'
              ? selectedCourseCategries?.map((el, index) => (
                <View
                  key={index?.toString()}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <MyText
                    text={el}
                    fontFamily="regular"
                    fontSize={13}
                    textColor={Colors.THEME_BROWN}
                  />
                  <TouchableOpacity
                    onPress={() => removeFilter('cat', el)}
                    style={{
                      marginLeft: 5,
                      marginTop: 3,
                    }}>
                    <Image
                      source={require('assets/images/trash.png')}
                      style={{ height: 16, width: 16 }}
                    />
                  </TouchableOpacity>
                </View>
              ))
              : selectedProductCategries?.map((el, index) => (
                <View
                  key={index?.toString()}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <MyText
                    key={el}
                    text={el}
                    fontFamily="regular"
                    fontSize={13}
                    textColor={Colors.THEME_BROWN}
                  />
                  <TouchableOpacity
                    onPress={() => removeFilter('cat', el)}
                    style={{
                      marginLeft: 5,
                      marginTop: 3,
                    }}>
                    <Image
                      source={require('assets/images/trash.png')}
                      style={{ height: 16, width: 16 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        ) : null}
        {showDateFilter() ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#ede5ca',
              marginRight: 'auto',
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}>
            <MyText
              text={'Selected Dates: '}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{}}
            />
            <MyText
              text={`${moment(startDate).format('DD-MM-YYYY')} - ${moment(
                endDate,
              ).format('DD-MM-YYYY')}`}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
            />
            <TouchableOpacity
              onPress={() => removeFilter('date', '')}
              style={{
                marginLeft: 5,
                marginTop: 3,
              }}>
              <Image
                source={require('assets/images/trash.png')}
                style={{ height: 16, width: 16 }}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };
  const multiSliderValuesChange = values => {
    setMultiSliderValue(values);
  };

  const openFilterModal = () => {
    setShowFilterModal(true);
  };
  const openReviewModal = (id, type, isReviewed = false) => {
    // console.log({ id });
    setSelectedId(id);
    setSelectedType(type);
    setShowReviewModal(true);
    setIsReviewed(isReviewed);
  };

  const onClearFilter = () => { };

  const onApplyFilter = () => { };

  const changeOrderTypes = id => {
    setSelectedOrderType(id);
  };
  const changeSubjects = id => {
    setSelectedSubject(id);
  };
  const changeDateUploaded = id => {
    setSelectedDateUploaded(id);
  };

  const changeSelectedTab = async id => {
    await AsyncStorage.setItem('myOrderSelectedTab', id);
    setSelectedTab(id);
    setSearchValue('')
    getMyOrders(id);
  };

  const gotoStartCourse = () => {
    navigation.navigate(ScreenNames.START_COURSE);
  };
  const gotoOrderDetails = (order_id, item_id) => {
    // console.log('order_id, item_id', order_id, item_id);
    navigation.navigate(ScreenNames.ORDER_DETAILS, { order_id, item_id });
  };

  const submitReview = async () => {
    if (review?.trim()?.length === 0) {
      Toast.show({ text1: 'Please enter review' });
      return;
    }
    const postData = new FormData();
    postData.append('id', selectedId);
    postData.append('type', selectedType);
    postData.append('rating', starRating);
    postData.append('comment', review);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.SUBMIT_REVIEW,
        postData,
      );
      // console.log('submitReview resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({ text1: resp?.data?.message || resp?.data?.Message });
        setStarRating(1);
        setReview('');
        await getMyOrders(2);
      } else {
        Toast.show({ text1: resp?.data?.message || resp?.data?.Message });
      }
    } catch (error) {
      console.log('error in submitReview', error);
    }
    setShowReviewModal(false)
    setShowLoader(false);
  };
  const gotoCourseDetails = (id, type) => {
    // console.log({ id, type })
    navigation.navigate(ScreenNames.COURSE_DETAILS, { id, type, selectedTab });
  };
  const gotoProductDetails = (id, type) => {
    navigation.navigate(ScreenNames.PRODUCT_DETAILS, { id, type, selectedTab });
  };
  const renderCourse = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => gotoCourseDetails(item?.id, '1')}
        style={styles.courseContainer}>
        <View style={styles.courseTopRow}>
          <MyText
            text={`Course Valid Date: ${item.course_valid_date}`}
            fontFamily="medium"
            fontSize={12}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <MyText
              // text={item.status}
              text={item?.course_completed == '1' ? 'Completed' : 'Ongoing'}
              fontFamily="medium"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{ marginLeft: 5 }}
            />
          </View>
        </View>
        <View style={styles.courseSubContainer}>
          <ImageBackground
            source={{ uri: item?.thumb?.path }}
            style={styles.crseImg}
            imageStyle={{ borderRadius: 10 }}></ImageBackground>
          <View style={{ marginLeft: 11, width: width * 0.55 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MyText
                text={'Order number: '}
                fontFamily="regular"
                fontSize={13}
                textColor={Colors.LIGHT_GREY}
                style={{}}
              />
              <MyText
                text={item.order_number}
                fontFamily="regular"
                fontSize={13}
                textColor={Colors.THEME_GOLD}
                style={{}}
              />
            </View>
            <MyText
              text={item.title}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{ width: responsiveWidth(50) }}
            />
            <View style={styles.middleRow}>
              <View style={styles.ratingRow}>
                <Image source={require('assets/images/star.png')} />
                <MyText
                  text={item?.avg_rating}
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
                  source={{ uri: item?.content_creator_image ? item?.content_creator_image : defaultImgPath }}
                  style={styles.createImgStyle}
                />
                <MyText
                  text={item.content_creator_name}
                  fontFamily="regular"
                  fontSize={13}
                  numberOfLines={1}
                  textColor={Colors.THEME_GOLD}
                  letterSpacing={0.13}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </View>
            <MyText
              text={'$' + item?.sale_price?.toFixed(2)}
              fontFamily="bold"
              fontSize={14}
              textColor={Colors.THEME_GOLD}
              letterSpacing={0.14}
              style={{}}
            />
            <MyButton
              text="VIEW ORDER DETAILS"
              style={{
                width: '90%',
                height: 40,
                marginTop: 8,
                backgroundColor: Colors.THEME_BROWN,
              }}
              onPress={() => gotoOrderDetails(item?.order_id, item?.item_id)}
            />
            {/* {item.isReviewed == '0' ? (
              <MyButton
                text="WRITE YOUR REVIEW HERE"
                style={{
                  width: '90%',
                  height: 40,
                  marginTop: 8,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={() => openReviewModal(item?.course_id, '1')}
              />
            ) : null} */}
            {/* <View style={styles.bottomRow}>
              <MyText
                text={'$' + item.courseFee}
                fontFamily="bold"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.14}
                style={{}}
              />
              <View style={styles.iconsRow}>
                <Image source={require('assets/images/heart-selected.png')} />
                <Image
                  source={require('assets/images/share.png')}
                  style={{marginLeft: 10}}
                />
              </View>
            </View> */}
          </View>
        </View>
        <Divider
          style={{ borderColor: '#ECECEC', marginTop: 11, marginBottom: 5 }}
        />
        {/* <MyText
          text={`Course Completed Date: ${item.course_valid_date}`}
          fontFamily="medium"
          fontSize={12}
          textColor={Colors.LIGHT_GREY}
          style={{}}
        /> */}
      </TouchableOpacity>
    );
  };
  const renderProduct = ({ item }) => {
    return (
      <TouchableOpacity
        // onPress={() => gotoProductDetails(item?.order_id, '2')}
        onPress={() => gotoOrderDetails(item?.order_id, item?.item_id)}
        style={styles.courseContainer}>
        <View style={styles.courseTopRow}>
          <MyText
            text={`Order ID: ${item?.order_number}`}
            fontFamily="medium"
            fontSize={12}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <MyText
              text={item.order_status}
              fontFamily="medium"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{ marginLeft: 5 }}
            />
          </View>
        </View>
        <View style={styles.courseSubContainer}>
          <ImageBackground
            source={{ uri: item?.Product_image[0] }}
            style={styles.crseImg}></ImageBackground>
          <View style={{ marginLeft: 11, width: width * 0.5 }}>
            <MyText
              text={item.title}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.middleRow}>
              <View style={styles.ratingRow}>
                <Image source={require('assets/images/star.png')} />
                <MyText
                  text={item?.avg_rating}
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
                  source={{ uri: item?.content_creator_image }}
                  style={styles.createImgStyle}
                />
                <MyText
                  text={item.content_creator_name}
                  fontFamily="regular"
                  fontSize={13}
                  numberOfLines={1}
                  textColor={Colors.THEME_GOLD}
                  letterSpacing={0.13}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </View>
            <View style={styles.bottomRow}>
              <MyText
                text={'$' + item?.sale_price?.toFixed(2)}
                fontFamily="bold"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.14}
                style={{}}
              />
              <View style={styles.iconsRow}>
                {/* <Image source={require('assets/images/heart-selected.png')} /> */}
                <Image
                  source={require('assets/images/share.png')}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </View>
            {/* {item.isReviewed == '0' ? ( */}
            <MyButton
              text={item.isReviewed ? "Edit your review" : "WRITE YOUR REVIEW HERE"}
              style={{
                // width: '90%',
                height: 40,
                marginTop: 8,
                backgroundColor: Colors.THEME_BROWN,
              }}
              onPress={() => openReviewModal(item?.id, '2', item.isReviewed)}
            />
            {/* ) : null} */}
          </View>
        </View>
        <Divider
          style={{ borderColor: '#ECECEC', marginTop: 11, marginBottom: 5 }}
        />
        <MyText
          text={item.order_date}
          fontFamily="medium"
          fontSize={12}
          textColor={Colors.LIGHT_GREY}
          style={{}}
        />
      </TouchableOpacity>
    );
  };
  const setOriginalValues = () => {
    setSelectedTab(temporarySelectedTab);
    setSelectedCourseCategries(tempSelectedCourseCategries);
    setSelectedProductCategries(TempSelectedProductCategries);
    setSelectedRatingValues(tempSelectedRatingValues);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };
  const setOriginalValues2 = () => {
    setSelectedCourseCategries(tempSelectedCourseCategries);
    setSelectedProductCategries(TempSelectedProductCategries);
    setSelectedRatingValues(tempSelectedRatingValues);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };
  const applyFilters = async (searchParam = '') => {
    // console.log({searchParam})
    setOriginalValues();
    const postData = new FormData();
    postData.append('type', temporarySelectedTab);
    let catIds = [];
    if (temporarySelectedTab === '1') {
      catIds = courseCategries
        ?.filter(el => tempSelectedCourseCategries?.includes(el?.name))
        ?.map(el => el?.id);
    } else {
      catIds = productCategries
        ?.filter(el => TempSelectedProductCategries?.includes(el?.name))
        ?.map(el => el?.id);
    }
    if (catIds?.length > 0) {
      catIds?.map(el => postData.append('category[]', el));
    }
    if (temporarySelectedTab === '1') {
      if (tempStartDate !== '' && tempEndDate !== '') {
        postData.append(
          'start_date',
          moment(tempStartDate).format('YYYY-MM-DD'),
        );
        postData.append('end_date', moment(tempEndDate).format('YYYY-MM-DD'));
      }
    }
    if (tempSelectedRatingValues?.length > 0) {
      tempSelectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    const isSearchTermExists = searchParam?.toString()?.trim()?.length > 0;
    const isSearchValueExists = searchValue?.toString()?.trim()?.length > 0;
    // console.log(
    //   'isSearchTermExists, isSearchValueExists',
    //   isSearchTermExists,
    //   isSearchValueExists,
    // );
    // console.log('searchTerm', searchParam);
    // console.log('searchValue', searchValue);
    if (isSearchTermExists || isSearchValueExists) {
      // handling special case: while deleting last character of search, since search state would not update fast, so using searchParam instead of search state (searchValue)
      if (
        searchValue?.toString()?.trim()?.length === 1 &&
        searchParam?.toString()?.trim()?.length === 0
      ) {
        postData.append('title', searchParam?.toString()?.trim());
      } else {
        // preferring to check searchParam first, because it has the most recent search value fast. But it is not always passed, in else case using searchValue
        if (isSearchTermExists) {
          postData.append('title', searchParam?.toString()?.trim());
        } else {
          postData.append('title', searchValue?.toString()?.trim());
        }
      }
    }
    // console.log('applyFilters postData', JSON.stringify(postData));
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.MY_ORDER,
        postData,
      );
      // console.log('applyFilters resp', resp?.data);
      if (resp?.data?.status) {
        // tab is not changed when searching
        if (temporarySelectedTab !== selectedTab) {
          setSelectedTab(temporarySelectedTab);
        }

        setShowFilterModal(false);
        if (temporarySelectedTab === '1') {
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          setProductData(resp?.data?.data);
        }
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in applyFilters', error);
    }
    setShowLoader(false);
  };
  const applyFilters2 = async (searchParam = '') => {
    console.log({ searchParam })
    const isDeletingLastCharacterInSearch =
      searchValue?.toString()?.trim()?.length === 1 &&
      searchParam?.toString()?.trim()?.length === 0;
    const isSearching = isDeletingLastCharacterInSearch || searchParam !== '';
    setOriginalValues2();
    const postData = new FormData();
    postData.append('type', selectedTab);
    let catIds = [];
    if (temporarySelectedTab === '1') {
      catIds = courseCategries
        ?.filter(el => tempSelectedCourseCategries?.includes(el?.name))
        ?.map(el => el?.id);
    } else {
      catIds = productCategries
        ?.filter(el => TempSelectedProductCategries?.includes(el?.name))
        ?.map(el => el?.id);
    }
    if (catIds?.length > 0) {
      catIds?.map(el => postData.append('category[]', el));
    }
    if (temporarySelectedTab === '1') {
      if (tempStartDate !== '' && tempEndDate !== '') {
        postData.append(
          'start_date',
          moment(tempStartDate).format('YYYY-MM-DD'),
        );
        postData.append('end_date', moment(tempEndDate).format('YYYY-MM-DD'));
      }
    }
    if (tempSelectedRatingValues?.length > 0) {
      tempSelectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    const isSearchTermExists = searchParam?.toString()?.trim()?.length > 0;
    const isSearchValueExists = searchValue?.toString()?.trim()?.length > 0;
    // console.log(
    //   'isSearchTermExists, isSearchValueExists',
    //   isSearchTermExists,
    //   isSearchValueExists,
    // );
    // console.log('searchTerm', searchParam);
    // console.log('searchValue', searchValue);
    if (isSearchTermExists || isSearchValueExists) {
      // handling special case: while deleting last character of search, since search state would not update fast, so using searchParam instead of search state (searchValue)
      if (
        searchValue?.toString()?.trim()?.length === 1 &&
        searchParam?.toString()?.trim()?.length === 0
      ) {
        postData.append('title', searchParam?.toString()?.trim());
      } else {
        // preferring to check searchParam first, because it has the most recent search value fast. But it is not always passed, in else case using searchValue
        if (isSearchTermExists) {
          postData.append('title', searchParam?.toString()?.trim());
        } else {
          postData.append('title', searchValue?.toString()?.trim());
        }
      }
    }
    // console.log('applyFilters postData', JSON.stringify(postData));
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.MY_ORDER,
        postData,
      );
      console.log('applyFilters resp shoaib', resp?.data);
      if (resp?.data?.data.length === 0 && selectedTab === '1') {
        console.log("chal gya");
        setCourseData([]);
        return;
      }
      if (resp?.data?.status) {
        setShowFilterModal(false);
        if (selectedTab === '1') {
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          setProductData(resp?.data?.data);
        }
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in applyFilters', error);
    }
    setShowLoader(false);
  };
  const resetFilter = async () => {
    setShowFilterModal(false);
    // emptying all filter states and calling getMyOrders
    setSearchValue('');
    setSelectedTab('1');
    setTemporarySelectedTab('1');
    setSelectedCourseCategries([]);
    setTempSelectedCourseCategries([]);
    setSelectedProductCategries([]);
    setTempSelectedProductCategries([]);
    setSelectedRatingValues([]);
    setTempSelectedRatingValues([]);
    setTempStartDate('');
    setTempEndDate('');
    setStartDate('');
    setEndDate('');
    await getMyOrders();
  };
  const removeFilter = async (filterType, item) => {
    let remainingStartDate = tempStartDate;
    let remainingEndDate = tempEndDate;
    if (filterType === 'date') {
      remainingStartDate = '';
      remainingEndDate = '';
      setTempStartDate('');
      setTempEndDate('');
      setStartDate('');
      setEndDate('');
    }
    if (selectedTab === '1') {
      if (remainingStartDate !== '' && remainingEndDate !== '') {
        postData.append('start_date', remainingStartDate);
        postData.append('end_date', remainingEndDate);
      }
    }
    let remainingSelectedCategories =
      selectedTab === '1'
        ? selectedCourseCategries
        : TempSelectedProductCategries;
    // console.log('selectedCourseCategries', selectedCourseCategries, item);
    if (filterType === 'cat') {
      if (selectedTab === '1') {
        remainingSelectedCategories = selectedCourseCategries?.filter(
          el => el !== item,
        );
        setSelectedCourseCategries([...remainingSelectedCategories]);
        setTempSelectedCourseCategries([...remainingSelectedCategories]);
      } else {
        remainingSelectedCategories = TempSelectedProductCategries?.filter(
          el => el !== item,
        );
        setSelectedProductCategries([...remainingSelectedCategories]);
        setTempSelectedProductCategries([...remainingSelectedCategories]);
      }
    }
    let remainingselectedRatingValues = [...selectedRatingValues];
    if (filterType === 'rating') {
      remainingselectedRatingValues = selectedRatingValues?.filter(
        el => el !== item,
      );
      setSelectedRatingValues(remainingselectedRatingValues);
      setTempSelectedRatingValues(remainingselectedRatingValues);
    }
    selectedRatingValues;
    const postData = new FormData();
    postData.append('type', temporarySelectedTab);
    let catIds = [];
    if (temporarySelectedTab === '1') {
      catIds = courseCategries
        ?.filter(el => remainingSelectedCategories?.includes(el?.name))
        ?.map(el => el?.id);
    } else {
      catIds = productCategries
        ?.filter(el => remainingSelectedCategories?.includes(el?.name))
        ?.map(el => el?.id);
    }
    if (catIds?.length > 0) {
      catIds?.map(el => postData.append('category[]', el));
    }
    if (remainingselectedRatingValues?.length > 0) {
      remainingselectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    // console.log('removeFilter postData', JSON.stringify(postData));
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.MY_ORDER,
        postData,
      );
      // console.log('removeFilter resp', resp?.data);
      if (resp?.data?.status) {
        if (temporarySelectedTab !== selectedTab) {
          setSelectedTab(temporarySelectedTab);
        }
        setShowFilterModal(false);
        if (temporarySelectedTab === '1') {
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          setProductData(resp?.data?.data);
        }
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in removeFilter', error);
    }
    setShowLoader(false);
  };

  // console.log({ selectedTab })
  //UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader style={{ height: hg(17) }} />
        <View style={{ marginTop: -hg(4) }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: '20%' }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.mainView}>
            <View style={styles.tabsContainer}>
              {tabs?.map(item => (
                <TouchableOpacity
                  onPress={() => changeSelectedTab(item.id)}
                  style={[
                    styles.tab,
                    selectedTab === item.id
                      ? { backgroundColor: Colors.THEME_GOLD }
                      : null,
                  ]}>
                  <MyText
                    text={item.name}
                    fontFamily="regular"
                    fontSize={13}
                    textColor={
                      selectedTab === item.id ? 'white' : Colors.THEME_BROWN
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
            <SearchWithIcon
              value={searchValue}
              icon={<Image source={require('assets/images/filter.png')} />}
              placeholder="Search..."
              onPress={openFilterModal}
              onChangeText={e => {
                console.log('SearchWithIcon', e);
                setSearchValue(e);
                applyFilters2(e);
              }}
              style={{ marginTop: 10 }}
              showDot={isFilterApplied}
            />
            <ShowSelectedFilters />
            {selectedTab === '1' ? (
              courseData?.length > 0 ? (
                <FlatList
                  data={courseData}
                  contentContainerStyle={{ paddingBottom: responsiveHeight(8) }}
                  style={{ marginTop: 28 }}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={renderCourse}
                />
              ) : (
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                  <Image source={require('assets/images/no-data.png')} />
                  <MyText
                    text={'No Courses found'}
                    fontFamily="medium"
                    fontSize={40}
                    textAlign="center"
                    textColor={'black'}
                  />
                </View>
              )
            ) : productData?.length > 0 ? (
              <FlatList
                data={productData}
                style={{ marginTop: 18 }}
                contentContainerStyle={{ paddingBottom: responsiveHeight(8) }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderProduct}
              />
            ) : (
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Image source={require('assets/images/no-data.png')} />
                <MyText
                  text={'No Products found'}
                  fontFamily="medium"
                  fontSize={40}
                  textAlign="center"
                  textColor={'black'}
                />
              </View>
            )}
          </ScrollView>
        </View>
        <CustomLoader showLoader={showLoader} />
        <OrdersFilter
          visible={showFilterModal}
          setVisibility={setShowFilterModal}
          onClearFilter={onClearFilter}
          onApplyFilter={onApplyFilter}
          courseCategries={courseCategries}
          productCategries={productCategries}
          tempSelectedCourseCategries={tempSelectedCourseCategries}
          setTempSelectedCourseCategries={setTempSelectedCourseCategries}
          TempSelectedProductCategries={TempSelectedProductCategries}
          setTempSelectedProductCategries={setTempSelectedProductCategries}
          tabs={tabs}
          temporarySelectedTab={temporarySelectedTab}
          setTemporarySelectedTab={setTemporarySelectedTab}
          tempStartDate={tempStartDate}
          setTempStartDate={setTempStartDate}
          openTempStartDate={openTempStartDate}
          setOpenTempStartDate={setOpenTempStartDate}
          tempEndDate={tempEndDate}
          setTempEndDate={setTempEndDate}
          openTempEndDate={openTempEndDate}
          setOpenTempEndDate={setOpenTempEndDate}
          applyFilters={applyFilters}
          resetFilter={resetFilter}
          orderTypes={orderTypes}
          subjects={subjects}
          dateUploaded={dateUploaded}
          changeOrderTypes={changeOrderTypes}
          changeSubjects={changeSubjects}
          changeDateUploaded={changeDateUploaded}
          selectedOrderType={selectedOrderType}
          selectedSubject={selectedSubject}
          selectedDateUploaded={selectedDateUploaded}
          multiSliderValue={multiSliderValue}
          multiSliderValuesChange={multiSliderValuesChange}
        />
        <Review
          visible={showReviewModal}
          setVisibility={setShowReviewModal}
          starRating={starRating}
          setStarRating={setStarRating}
          review={review}
          setReview={setReview}
          submitReview={submitReview}
          isReviewed={isReviewed}
        />
        <DatePicker
          modal
          mode="date"
          // mode="time"
          open={openTempStartDate}
          date={tempStartDate || new Date()}
          onConfirm={time => {
            setOpenTempStartDate(false);
            setTempStartDate(time);
          }}
          onCancel={() => {
            setOpenTempStartDate(false);
          }}
        // minimumDate={new Date()}
        />
        <DatePicker
          modal
          mode="date"
          // mode="time"
          open={openTempEndDate}
          date={tempEndDate || new Date()}
          onConfirm={time => {
            setOpenTempEndDate(false);
            setTempEndDate(time);
          }}
          onCancel={() => {
            setOpenTempEndDate(false);
          }}
        // minimumDate={new Date()}
        />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(MyOrders);
