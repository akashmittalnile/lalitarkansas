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
import { useIsFocused } from '@react-navigation/native';
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
import { styles } from './TrendingCoursesStyle';
//import : modal
//import : redux
import { connect, useSelector } from 'react-redux';
import { width, height } from 'global/Constant';
import Divider from 'components/Divider/Divider';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import TrendingFiltersModal from './components/TrendingFiltersModal/TrendingFiltersModal';
import { createThumbnail } from 'react-native-create-thumbnail';
import VideoModal from '../../../components/VideoModal/VideoModal';
import { shareItemHandler } from '../../../global/globalMethod';
import { responsiveHeight } from 'react-native-responsive-dimensions';

let timeoutId;
let count = 0;
const TrendingCourses = ({ navigation, dispatch }) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [courseData, setCourseData] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [courseCategries, setCourseCategries] = useState([]);
  const [selectedCourseCategries, setSelectedCourseCategries] = useState([]);
  const [tempSelectedCourseCategries, setTempSelectedCourseCategries] =
    useState([]);
  useState([]);
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
  const [paginationDetails, setPaginationDetails] = useState({
    last_page_no: 1,
    current_page: 1,
  });
  const [isDataLoading, setIsDataLoading] = useState(false);
  const focused = useIsFocused();

  const renderFooter = () => {
    return isDataLoading ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : null;
  };

  useEffect(() => {
    getCourses();
  }, [focused]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setSearchValue('')
      setSelectedCourseCategries([])
      setTempSelectedCourseCategries([])
      setSelectedPriceFilter('')
      setTempSelectedPriceFilter('')
      setSelectedRatingValues('')
      setTempSelectedRatingValues('')
    });
    return unsubscribe;
  }, [navigation, focused]);
  const checkcon = () => {
    getCourses();
  };
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setSearchValue('');
    getCourses();
    checkcon();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);
  const getCourses = async () => {
    // if (isDataLoading) {
    //   return;
    // }
    // setIsDataLoading(true);
    const postData = new FormData();
    postData.append('limit', 1);
    // postData.append('tag', '')
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        `trending-course?page=${paginationDetails.current_page}`,
        postData,
      );
      // console.log('getCourses resp', resp?.data);
      if (resp?.data?.status) {
        setPaginationDetails({
          last_page_no: resp?.data?.last_page_no,
          current_page: paginationDetails.current_page + 1,
        });

        if (courseCategries.length > 0) {
          setCourseCategries([
            ...courseCategries, ...resp?.data?.category?.map(el => ({
              id: el?.id,
              name: el?.category_name,
            })),
          ]
          );
        }
        else if (courseCategries.length === 0) {
          setCourseCategries(
            resp?.data?.category?.map(el => ({
              id: el?.id,
              name: el?.category_name,
            })),
          );
        }
        const updatedData = await generateThumb(resp?.data?.data);
        if (courseData.length > 0) {
          setCourseData(preData => ([
            ...preData,
            ...updatedData,
          ]));
        }
        else if (courseData.length === 0) {
          setCourseData(updatedData);
        }
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in getCourses', error);
    } finally {
      setIsDataLoading(false);
      setShowLoader(false);
    }
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
    const endPoint =
      status == '1' ? Service.UNLIKE_OBJECT_TYPE : Service.LIKE_OBJECT_TYPE;
    console.log('onLike endPoint', endPoint);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        endPoint,
        formdata,
      );
      console.log('onLike resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({ text1: resp.data.message });
        getCourses();
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in onLike', error);
    }
    showLoader && setShowLoader(false);
  };
  const gotoCourseDetails = (id, type) => {
    navigation.navigate(ScreenNames.COURSE_DETAILS, { id, type });
  };
  const isFilterApplied = () => {
    if (selectedCourseCategries?.length > 0) {
      return true;
    } else if (selectedPriceFilter !== '') {
      return true;
    } else if (selectedRatingValues?.length > 0) {
      return true;
    }
    return false;
  };
  const ShowSelectedFilters = () => {
    return (
      <View>
        {selectedCourseCategries?.length > 0 ? (
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
            {selectedCourseCategries?.map((el, index) => (
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
  const openFilterModal = () => {
    setShowFilterModal(true);
  };
  const setOriginalValues = () => {
    setSelectedCourseCategries(tempSelectedCourseCategries);
    setSelectedPriceFilter(tempSelectedPriceFilter);
    setSelectedRatingValues(tempSelectedRatingValues);
  };
  const setOriginalValues2 = () => {
    setSelectedCourseCategries(tempSelectedCourseCategries);
    setSelectedPriceFilter(tempSelectedPriceFilter);
    setSelectedRatingValues(tempSelectedRatingValues);
  };
  const applyFilters = async (searchParam = '') => {
    console.log("apply filter 1")
    setShowLoader(true);
    setOriginalValues();
    const postData = new FormData();
    let catIds = [];
    catIds = courseCategries
      ?.filter(el => tempSelectedCourseCategries?.includes(el?.name))
      ?.map(el => el?.id);
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
    postData.append('limit', 10);
    console.log('applyFilters postData', JSON.stringify(postData));
    // setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.TRENDING_COURSE,
        postData,
      );
      console.log('applyFilters resp', resp?.data);
      if (resp?.data?.status) {
        setShowFilterModal(false);
        const updatedData = await generateThumb(resp?.data?.data);
        setCourseData(updatedData);
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
    let catIds = [];
    catIds = courseCategries
      ?.filter(el => tempSelectedCourseCategries?.includes(el?.name))
      ?.map(el => el?.id);

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
    postData.append('limit', 10);
    try {
      setShowLoader(true);
      const resp = await Service.postApiWithToken(
        userToken,
        Service.TRENDING_COURSE,
        postData,
      );
      console.log('applyFilters resp', resp?.data);
      if (resp?.data?.status) {
        setShowFilterModal(false);
        const updatedData = await generateThumb(resp?.data?.data);
        console.log({ updatedData })
        setCourseData(updatedData);
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in applyFilters', error);
    } finally {
      setShowLoader(false);
    }
  };
  const resetFilter = async () => {
    console.log("reset filter")
    setShowFilterModal(false);
    // emptying all filter states and calling getAllType
    setSearchValue('');
    setSelectedCourseCategries([]);
    setTempSelectedCourseCategries([]);
    setSelectedPriceFilter('');
    setTempSelectedPriceFilter('');
    setSelectedRatingValues([]);
    setTempSelectedRatingValues([]);
    await getCourses();
  };
  const removeFilter = async (filterType, item) => {
    let remainingSelectedCategories = selectedCourseCategries;
    console.log('selectedCourseCategries', selectedCourseCategries, item);
    if (filterType === 'cat') {
      remainingSelectedCategories = selectedCourseCategries?.filter(
        el => el !== item,
      );
      setSelectedCourseCategries([...remainingSelectedCategories]);
      setTempSelectedCourseCategries([...remainingSelectedCategories]);
    }
    const remainingPriceFilter = '';
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
    let catIds = [];
    catIds = courseCategries
      ?.filter(el => remainingSelectedCategories?.includes(el?.name))
      ?.map(el => el?.id);

    if (catIds?.length > 0) {
      catIds?.map(el => postData.append('category[]', el));
    }
    if (remainingPriceFilter !== '') {
      postData.append('price', tempSelectedPriceFilter);
    }
    if (remainingselectedRatingValues?.length > 0) {
      remainingselectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    console.log('removeFilter postData', JSON.stringify(postData));
    postData.append('limit', 10);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.TRENDING_COURSE,
        postData?._parts?.length === 0 ? {} : postData,
      );
      console.log('removeFilter resp', resp?.data);
      if (resp?.data?.status) {
        setShowFilterModal(false);
        const updatedData = await generateThumb(resp?.data?.data);
        setCourseData(updatedData);
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in removeFilter', error);
    }
    setShowLoader(false);
  };

  const renderCourse = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => gotoCourseDetails(item?.id, '1')}
        style={styles.courseContainer}>
        {item?.thumb?.path && <ImageBackground
          source={{ uri: item?.thumb?.path }}
          style={styles.crseImg}
          imageStyle={{ borderRadius: 10 }}>
          <TouchableOpacity onPress={() => {
            setShowModal({
              isVisible: true,
              data: item,
            });
          }}>
            <Image source={require('assets/images/play-icon.png')} />
          </TouchableOpacity>
        </ImageBackground>}
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
              {item?.content_creator_image && <Image
                source={{ uri: item?.content_creator_image }}
                style={styles.createImgStyle}
              />}
              <MyText
                text={item?.content_creator_name}
                fontFamily="regular"
                fontSize={13}
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
                      : require('assets/images/heart.png')
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { shareItemHandler(1, item?.id); }}>
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
  const toggleModal = state => {
    setShowModal({
      isVisible: state.isVisible,
      data: state.data,
    });
  };

  const paginationHandler = () => {
    if (paginationDetails.current_page <= paginationDetails.last_page_no && searchValue.length === 0) {
      getCourses();
    }
  };

  const debounceHandler = (getData, delay = 400) => {

    return function (args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (searchValue.length === 0) {
        setPaginationDetails(preData => ({
          ...preData,
          current_page: 2,
        }));
        return;
      }

      timeoutId = setTimeout(() => {
        getData(args);
      }, delay);
    };
  };


  const debounce = debounceHandler(applyFilters2, 400);
  // console.log(count++, showLoader);
  //UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Trending Courses" isBackButton />
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.mainView}>
            <SearchWithIcon
              value={searchValue}
              setValue={setSearchValue}
              placeholder="Search by Title"
              onChangeText={e => {
                setSearchValue(e);
                debounce(e);
              }}
              onPress={openFilterModal}
              icon={<Image source={require('assets/images/filter.png')} />}
              style={{ marginTop: 10 }}
              showDot={isFilterApplied}
            />
            {showModal.isVisible ? (
              <VideoModal
                isVisible={showModal.isVisible}
                toggleModal={toggleModal}
                videoDetail={{ ...showModal?.data, url: showModal?.data?.introduction_video }}
              // {...props}
              />
            ) : null}
            <ShowSelectedFilters />
          </ScrollView>
          <FlatList
            data={courseData}
            style={{ marginTop: responsiveHeight(-5), height: responsiveHeight(65), }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderCourse}
            onEndReached={paginationHandler}
            onEndReachedThreshold={0.3}
            ListFooterComponent={courseData.length > 0 && renderFooter}
            ListEmptyComponent={() => (
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Image source={require('assets/images/no-data.png')} />
                <MyText
                  text={'No Trending Courses found'}
                  fontFamily="medium"
                  fontSize={40}
                  textAlign="center"
                  textColor={'black'}
                />
              </View>
            )}
          />
        </View>
        <TrendingFiltersModal
          visible={showFilterModal}
          setVisibility={setShowFilterModal}
          courseCategries={courseCategries}
          tempSelectedCourseCategries={tempSelectedCourseCategries}
          setTempSelectedCourseCategries={setTempSelectedCourseCategries}
          priceFilterValues={priceFilterValues}
          tempSelectedPriceFilter={tempSelectedPriceFilter}
          setTempSelectedPriceFilter={setTempSelectedPriceFilter}
          tempSelectedRatingValues={tempSelectedRatingValues}
          setTempSelectedRatingValues={setTempSelectedRatingValues}
          applyFilters={applyFilters}
          resetFilter={resetFilter}
        />
      </View>
      {courseData.length === 0 && <CustomLoader showLoader={showLoader} />}
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(TrendingCourses);
