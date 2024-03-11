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
  RefreshControl
} from 'react-native';
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
import { styles } from './SearchAllTypeStyle';
//import : modal
//import : redux
import { connect, useSelector } from 'react-redux';
import { width, height } from 'global/Constant';
import Divider from 'components/Divider/Divider';
import MyButton from '../../../components/MyButton/MyButton';
import { createThumbnail } from 'react-native-create-thumbnail';
import FiltersModal from './components/FiltersModal/FiltersModal';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import VideoModal from '../../../components/VideoModal/VideoModal';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import defaultImg from "../../../assets/images/default-content-creator-image.png"
import { shareItemHandler } from '../../../global/globalMethod';


const SearchAllType = ({ navigation, dispatch }) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState('1');
  const [temporarySelectedTab, setTemporarySelectedTab] = useState('1');
  const [courseData, setCourseData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [courseCategries, setCourseCategries] = useState([]);
  const [selectedCourseCategries, setSelectedCourseCategries] = useState([]);
  const [tempSelectedCourseCategries, setTempSelectedCourseCategries] =
    useState([]);
  const [productCategries, setProductCategries] = useState([]);
  const [selectedProductCategries, setSelectedProductCategries] = useState([]);
  const [TempSelectedProductCategries, setTempSelectedProductCategries] =
    useState([]);
  const [productData, setProductData] = useState([]);
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
  const [priceFilterValues, setPriceFilterValues] = useState([
    {
      id: '1',
      name: 'High to Low',
    },
    {
      id: '2',
      name: 'Low to High',
    },
  ]);
  const [tempSelectedPriceFilter, setTempSelectedPriceFilter] = useState('');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('');
  const [selectedRatingValues, setSelectedRatingValues] = useState([]);
  const [tempSelectedRatingValues, setTempSelectedRatingValues] = useState([]);
  const [showModal, setShowModal] = useState({ isVisible: false, data: null });
  const [refreshing, setRefreshing] = useState(false);
  const defaultImgPath = Image.resolveAssetSource(defaultImg).uri;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllType();
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setSelectedTab('1');
      setSearchValue('')
      setTemporarySelectedTab('1');
      setSelectedCourseCategries([])
      setTempSelectedCourseCategries([])
      setSelectedProductCategries([])
      setTempSelectedProductCategries([])
      setSelectedPriceFilter('')
      setTempSelectedPriceFilter('')
      setSelectedRatingValues('')
      setTempSelectedRatingValues('')
    });
    return unsubscribe;
  }, [navigation]);
  const checkcon = () => {
    getAllType();
  };
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    checkcon();
    setSearchValue('');
    // applyFilters2('');
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);
  const getAllType = async (type = '1') => {
    !showLoader && setShowLoader(true);
    const formdata = new FormData();
    formdata.append('type', type);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ALL_TYPE_LISTING,
        formdata,
      );
      console.log('getAllType resp', resp?.data);
      if (resp?.data?.status) {
        if (type === '1') {
          // only set categories data if getting it from api
          if (resp?.data?.category) {
            setCourseCategries(
              resp?.data?.category?.filter(el => el.type == '1'),
            );
            setProductCategries(
              resp?.data?.category?.filter(el => el.type == '2'),
            );
          }
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          setProductData(resp?.data?.data);
        }
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in getAllType', error);
    }
    setShowLoader(false);
  };
  const generateThumb = async data => {
    // console.log('generateThumb');
    let updatedData = [];
    try {
      updatedData = await Promise.all(
        data?.map?.(async el => {
          // console.log('el.introduction_video trending', el.introduction_video);
          const thumb = await createThumbnail({
            url: el.introduction_video,
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
  const onLike = async (type, id, status) => {
    setShowLoader(true);
    const formdata = new FormData();
    formdata.append('type', type);
    formdata.append('id', id);
    formdata.append('status', status == '1' ? '0' : '1');
    console.log('onLike formdata', formdata);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        status == '1' ? Service.UNLIKE_OBJECT_TYPE : Service.LIKE_OBJECT_TYPE,
        formdata,
      );
      console.log('onLike resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({ text1: resp.data.message });
        getAllType(type);
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in onLike', error);
    }
    showLoader && setShowLoader(false);
  };

  const shareHandler = async (id) => {
    await shareItemHandler(1, id);
  };


  const changeSelectedTab = id => {
    setSelectedTab(id);
    setSearchValue('');
    getAllType(id);
  };

  const openFilterModal = () => {
    setShowFilterModal(true);
  };
  // setOriginalValues will set values for selected filters based on temporary selected filters
  // since we use dont use temporary filter values to show selected filter values on screen
  const setOriginalValues = () => {
    setSelectedTab(temporarySelectedTab);
    setSelectedCourseCategries(tempSelectedCourseCategries);
    setSelectedProductCategries(TempSelectedProductCategries);
    setSelectedPriceFilter(tempSelectedPriceFilter);
    setSelectedRatingValues(tempSelectedRatingValues);
  };
  const setOriginalValues2 = () => {
    setSelectedCourseCategries(tempSelectedCourseCategries);
    setSelectedProductCategries(TempSelectedProductCategries);
    setSelectedPriceFilter(tempSelectedPriceFilter);
    setSelectedRatingValues(tempSelectedRatingValues);
  };
  const applyFilters = async (searchParam = '') => {
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
    if (tempSelectedPriceFilter !== '') {
      postData.append('price', tempSelectedPriceFilter);
    }
    if (tempSelectedRatingValues?.length > 0) {
      tempSelectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    const isSearchTermExists = searchParam?.toString()?.trim()?.length > 0;
    const isSearchValueExists = searchValue?.toString()?.trim()?.length > 0;
    console.log(
      'isSearchTermExists, isSearchValueExists',
      isSearchTermExists,
      isSearchValueExists,
    );
    console.log('searchTerm', searchParam);
    console.log('searchValue', searchValue);
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
    console.log('applyFilters postData', JSON.stringify(postData));
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ALL_TYPE_LISTING,
        postData,
      );
      console.log('applyFilters resp', resp?.data?.length);
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
    if (tempSelectedPriceFilter !== '') {
      postData.append('price', tempSelectedPriceFilter);
    }
    if (tempSelectedRatingValues?.length > 0) {
      tempSelectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    const isSearchTermExists = searchParam?.toString()?.trim()?.length > 0;
    const isSearchValueExists = searchValue?.toString()?.trim()?.length > 0;
    console.log(
      'isSearchTermExists, isSearchValueExists',
      isSearchTermExists,
      isSearchValueExists,
    );
    console.log('searchTerm', searchParam);
    console.log('searchValue', searchValue);
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
    console.log('applyFilters2 postData', JSON.stringify(postData));
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ALL_TYPE_LISTING,
        postData,
      );
      console.log(
        'applyFilters2 resp',
        JSON.stringify(resp?.data?.data?.length),
      );
      if (resp?.data?.status) {
        setShowFilterModal(false);
        if (selectedTab === '1') {
          if (resp?.data?.data?.length === 0) {
            setCourseData(resp?.data?.data);
          } else {
            const updatedData = await generateThumb(resp?.data?.data);
            setCourseData(updatedData);
          }
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
    // emptying all filter states and calling getAllType
    setSearchValue('');
    setSelectedTab('1');
    setTemporarySelectedTab('1');
    setSelectedCourseCategries([]);
    setTempSelectedCourseCategries([]);
    setSelectedProductCategries([]);
    setTempSelectedProductCategries([]);
    setSelectedPriceFilter('');
    setTempSelectedPriceFilter('');
    setSelectedRatingValues([]);
    setTempSelectedRatingValues([]);
    await getAllType();
  };
  const removeFilter = async (filterType, item) => {
    console.log('================removeFilter====================',item);
    console.log(filterType);
    console.log('===================removeFilter in Searchalltypes=================');
    let remainingSelectedCategories =
      selectedTab === '1'
        ? selectedCourseCategries
        : TempSelectedProductCategries;
    console.log('selectedCourseCategries', selectedCourseCategries, item);
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
    // const remainingPriceFilter = '';
    if (filterType === 'price') {
      setTempSelectedPriceFilter('');
      setSelectedPriceFilter('');
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
    // priceFilterValues?.find(el => el.id === selectedPriceFilter);
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
    console.log("catIdscatIds---SeachAllTypes",catIds);
    if (catIds?.length > 0) {
      catIds?.map(el => postData.append('category[]', el));
    }
    if (tempSelectedPriceFilter !== '') {
      postData.append('price', tempSelectedPriceFilter);
    }
    if (remainingselectedRatingValues?.length > 0) {
      remainingselectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    
    console.log('removeFilter postData-Search-alltype', JSON.stringify(postData));
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ALL_TYPE_LISTING,
        postData,
      );
      console.log('removeFilter resp', resp?.data);
      if (resp?.data?.status) {
        if (temporarySelectedTab !== selectedTab) {
          setSelectedTab(temporarySelectedTab);
        }
        setShowFilterModal(false);
        if (temporarySelectedTab === '1') {
          const updatedData = await generateThumb(resp?.data?.data);
          console.log('here');
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
    console.log('here2');
    setShowLoader(false);
  };
  const gotoCourseDetails = (id, type) => {
    navigation.navigate(ScreenNames.COURSE_DETAILS, { id, type });
  };
  const gotoProductDetails = (id, type) => {
    navigation.navigate(ScreenNames.PRODUCT_DETAILS, { id, type });
  };
  const toggleModal = state => {
    setShowModal({
      isVisible: state.isVisible,
      data: state.data,
    });
  };
  const renderCourse = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => gotoCourseDetails(item?.id, '1')}
        style={styles.courseContainer}>
        <ImageBackground
          // source={item.courseImg}
          source={{ uri: item?.thumb?.path }}
          style={styles.crseImg}
          imageStyle={{ borderRadius: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setShowModal({
                isVisible: true,
                data: item,
              });
            }}>
            <Image source={require('assets/images/play-icon.png')} />
          </TouchableOpacity>
        </ImageBackground>
        <View style={{ marginLeft: 11, width: width * 0.42 }}>
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
                source={{ uri: item?.content_creator_image ? item?.content_creator_image : defaultImgPath }}
                style={styles.createImgStyle}
              />
              <MyText
                text={item?.content_creator_name}
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
              text={'$' + item.course_fee}
              fontFamily="bold"
              fontSize={14}
              textColor={Colors.THEME_GOLD}
              letterSpacing={0.14}
              style={{}}
            />
            <View style={styles.iconsRow}>
              <TouchableOpacity
                onPress={() => {
                  onLike('1', item.id, item?.isWishlist);
                }}>
                <Image
                  source={
                    item?.isWishlist
                      ? require('assets/images/heart-selected.png')
                      : require('assets/images/heart-yellow-outline.png')
                  }
                  style={{ width: 14, height: 14 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { shareHandler(item?.id); }}>
                <Image
                  source={require('assets/images/share.png')}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderProduct = ({ item }) => {
    // console.log('wishlist item.Product_image', item.Product_image);
    return (
      <TouchableOpacity
        onPress={() => gotoProductDetails(item?.id, '2')}
        style={styles.courseContainer}>
        <ImageBackground
          source={{ uri: item.Product_image[0] }}
          style={styles.crseImg}>
          {/* <TouchableOpacity>
            <Image source={require('assets/images/play-icon.png')} />
          </TouchableOpacity> */}
        </ImageBackground>
        <View style={{ marginLeft: 11, width: width * 0.42 }}>
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
                source={{ uri: item?.creator_image ? item?.creator_image : defaultImgPath }}
                style={styles.createImgStyle}
              />
              <MyText
                text={item?.creator_name}
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
              text={'$' + item.price}
              fontFamily="bold"
              fontSize={14}
              textColor={Colors.THEME_GOLD}
              letterSpacing={0.14}
              style={{ textDecorationLine: (item?.sale_price !== item.price) ? 'line-through' : 'none' }}
            />
            {item?.sale_price !== item.price && <MyText
              text={'$' + item.sale_price}
              fontFamily="bold"
              fontSize={14}
              textColor={Colors.THEME_GOLD}
              letterSpacing={0.14}
              style={{ marginLeft: responsiveWidth(-8) }}
            />}
            <View style={styles.iconsRow}>
              <TouchableOpacity
                onPress={() => {
                  onLike('2', item.id, item?.isWishlist);
                }}>
                <Image
                  source={
                    item?.isWishlist
                      ? require('assets/images/heart-selected.png')
                      : require('assets/images/heart-yellow-outline.png')
                  }
                  style={{ width: 14, height: 14 }}
                />
              </TouchableOpacity>
              <Image
                source={require('assets/images/share.png')}
                style={{ marginLeft: 10 }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const isFilterApplied = () => {
    if (showSelectedCategories()) {
      return true;
    } else if (selectedPriceFilter !== '') {
      return true;
    } else if (selectedRatingValues?.length > 0) {
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
      <View style={{flexWrap:'wrap', flexDirection: 'row',paddingVertical:10}}>
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
        {selectedPriceFilter !== '' ? (
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
              text={'Price: '}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{}}
            />
            <MyText
              text={
                priceFilterValues?.find(el => el.id === selectedPriceFilter)
                  ?.name
              }
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
            />
            <TouchableOpacity
              onPress={() => removeFilter('price', selectedPriceFilter)}
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
        {selectedRatingValues?.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              backgroundColor: '#ede5ca',
              marginRight: 'auto',
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}>
            <MyText
              text={'Rating: '}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{}}
            />
            {selectedRatingValues?.map((el, index) => (
              <View
                key={index?.toString()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                <MyText
                  key={el}
                  text={`${el} and more`}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.THEME_BROWN}
                />
                <TouchableOpacity
                  onPress={() => removeFilter('rating', el)}
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
      </View>
    );
  };

  //UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Search by Title" isBackButton />
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
            placeholder="Search by Title"
            value={searchValue}
            onChangeText={e => {
              console.log('SearchWithIcon', e);
              setSearchValue(e);
              applyFilters2(e);
            }}
            onPress={openFilterModal}
            icon={<Image source={require('assets/images/filter.png')} />}
            style={{ marginTop: 10 }}
            showDot={isFilterApplied}
          />
          <ShowSelectedFilters />
          {showModal.isVisible ? (
            <VideoModal
              isVisible={showModal.isVisible}
              toggleModal={toggleModal}
              videoDetail={{
                ...showModal?.data,
                url: showModal?.data?.introduction_video,
              }}
            // {...props}
            />
          ) : null}
          {selectedTab === '1' ? (
            <>
              {courseData?.length > 0 ? (
                <FlatList
                  // data={courseList}
                  data={courseData}
                  style={{ marginTop: 10 }}
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
              )}
            </>
          ) : (
            <>
              {productData?.length > 0 ? (
                <FlatList
                  // data={productList}
                  data={productData}
                  style={{ marginTop: 10 }}
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
            </>
          )}
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
        <FiltersModal
          visible={showFilterModal}
          setVisibility={setShowFilterModal}
          tabs={tabs}
          courseCategries={courseCategries}
          productCategries={productCategries}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          temporarySelectedTab={temporarySelectedTab}
          setTemporarySelectedTab={setTemporarySelectedTab}
          tempSelectedCourseCategries={tempSelectedCourseCategries}
          setTempSelectedCourseCategries={setTempSelectedCourseCategries}
          TempSelectedProductCategries={TempSelectedProductCategries}
          setTempSelectedProductCategries={setTempSelectedProductCategries}
          priceFilterValues={priceFilterValues}
          tempSelectedPriceFilter={tempSelectedPriceFilter}
          setTempSelectedPriceFilter={setTempSelectedPriceFilter}
          tempSelectedRatingValues={tempSelectedRatingValues}
          setTempSelectedRatingValues={setTempSelectedRatingValues}
          applyFilters={applyFilters}
          resetFilter={resetFilter}
        />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(SearchAllType);
