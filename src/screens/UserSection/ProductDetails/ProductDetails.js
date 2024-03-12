/* eslint-disable comma-dangle */
/* eslint-disable react-native/no-inline-styles */
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
import { styles } from './ProductDetailsStyle';
//import : modal
//import : redux
import { connect, useSelector } from 'react-redux';
import { width, height } from 'global/Constant';
import Divider from 'components/Divider/Divider';
import MyButton from '../../../components/MyButton/MyButton';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import AccordionItem from '../../../components/AccordionItem/AccordionItem';
import ViewAll from '../../../components/ViewAll/ViewAll';
import FAB_Button from '../../../components/FAB_Button/FAB_Button';
import Review from '../../../modals/Review/Review';
import VideoModal from '../../../components/VideoModal/VideoModal';
import Carousel from '../../../components/Carousel/Carousel';
import { setCartCount } from 'src/reduxToolkit/reducer/user';
import { ImageSlider, ImageCarousel } from 'react-native-image-slider-banner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CourseTypeModal from '../../../modals/CourseType/CourseTypeModal';
import { shareItemHandler } from '../../../global/globalMethod';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const data = [
  {
    id: 1,
    title: 'New Methods to try',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
  {
    id: 3,
    title: 'How to use coding ',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
  {
    id: 4,
    title: 'What is coding about',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
  {
    id: 5,
    title: 'How to create animations',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
  {
    id: 6,
    title: 'Possible to create layout animations?',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
  {
    id: 7,
    title: 'How to Create Swipe Buttons',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
];
const reviewsData = [
  {
    id: '1',
    name: 'Annete Black',
    img: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
    msg: `Perfectly packed all products received as said...but when connected with power supply it doesn't work, After some adjustments it worked perfectly felt very happy with the product. Thank you`,
  },
  {
    id: '2',
    name: 'Annete Black',
    img: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
    msg: `Perfectly packed all products received as said...but when connected with power supply it doesn't work, After some adjustments it worked perfectly felt very happy with the product. Thank you`,
  },
];
const tags = [
  { name: 'Tatoos', id: '1' },
  { name: 'Tatoos Course', id: '2' },
  { name: 'Tatoos 2023', id: '3' },
  { name: 'Body Piercing', id: '4' },
];

const addToCartObject = {};
const ProductDetails = ({ navigation, dispatch, route }) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedTag, setSelectedTag] = useState('1');
  const [productDetails, setProductDetails] = useState({});
  const [sliderData, setSliderData] = useState([]);
  const [review, setReview] = useState('');
  const [starRating, setStarRating] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showModal, setShowModal] = useState({ isVisible: false, data: null });
  const [documents, setDocuments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCourseTypeModal, setShowCourseTypeModal] = useState(false)

  useEffect(() => {
    getProductDetails();
  }, [route?.params?.id]);
  const checkcon = () => {
    getProductDetails();
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
  const getProductDetails = async () => {
    const postData = new FormData();
    postData.append('type', route?.params?.type);
    postData.append('id', route?.params?.id);
    // postData.append('id', 3);
    console.log('getProductDetails postData', postData);
    setShowLoader(true);
    if (route?.params?.deepLinking) {
      var token = await AsyncStorage.getItem('userToken');
    }
    try {
      const resp = await Service.postApiWithToken(
        route?.params?.deepLinking ? token : userToken,
        Service.OBJECT_TYPE_DETAILS,
        postData,
      );
      console.log('getProductDetails resp', resp?.data);
      if (resp?.data?.status) {
        setProductDetails(resp?.data?.data);
        let sliData = [];
        sliData = resp?.data?.data?.Product_image?.map(el => ({
          // slider: el,
          img: el,
        }));
        setSliderData([...sliData]);
        // Toast.show({text1: resp?.data?.message})
      } else {
        Toast.show({ text1: resp?.data?.message });
      }
    } catch (error) {
      console.log('error in getProductDetails', error);
    }
    setShowLoader(false);
  };

  const changeSelectedTag = id => {
    setSelectedTag(id);
  };

  const renderTags = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => changeSelectedTag(item.id)}
        style={[
          styles.courseTypeContainer,
          selectedTag === item?.id
            ? { backgroundColor: Colors.THEME_BROWN }
            : null,
        ]}>
        <MyText
          text={item?.name}
          fontFamily="regular"
          fontSize={14}
          textColor={selectedTag === item.id ? Colors.THEME_GOLD : 'black'}
        />
      </TouchableOpacity>
    );
  };

  const gotoAllReviews = () => {
    navigation.navigate(ScreenNames.ALL_REVIEWS, {
      id: productDetails?.id,
      type: route?.params?.type,
      isPurchased: productDetails?.isPurchased
    });
  };

  const submitReview = async () => {
    if (review?.trim()?.length === 0) {
      Toast.show({ text1: 'Please enter review' });
      return;
    }
    const postData = new FormData();
    postData.append('id', route?.params?.id);
    postData.append('type', route?.params?.type);
    postData.append('comment', review);
    postData.append('rating', starRating);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.SUBMIT_REVIEW,
        postData,
      );
      console.log('submitReview resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({ text1: resp?.data?.message || resp?.data?.Message });
        setStarRating(1);
        setReview('');
      } else {
        Toast.show({ text1: resp?.data?.message || resp?.data?.Message });
      }
    } catch (error) {
      console.log('error in submitReview', error);
    }
    setShowReviewModal(false);
    setShowLoader(false);
  };

  const openReviewModal = () => {
    setShowReviewModal(true);
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
        getProductDetails();
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in onLike', error);
    }
    setShowLoader(false);
  };
  const toggleModal = state => {
    setShowModal({
      isVisible: state.isVisible,
      data: state.data,
    });
  };
  const deleteDocument = id => {
    const documentsCopy = [...documents];
    const updatedData = documentsCopy?.filter(el => el.id !== id);
    setDocuments([...updatedData]);
  };
  const documentValidation = chapter_step_id => {
    if (documents.find(el => el.id === chapter_step_id)) {
      return true;
    } else {
      Toast.show({ text1: 'Please select assignment file' });
      return false;
    }
  };
  const uploadDocument = async chapter_step_id => {
    console.log('uploadDocument called', documents);
    if (documentValidation(chapter_step_id)) {
      const documentWithId = documents.find(el => el.id === chapter_step_id);
      setShowLoader(true);
      try {
        const postData = new FormData();
        postData.append('chapter_step_id', chapter_step_id);
        postData.append('file', {
          name: documentWithId?.resp?.name,
          type: documentWithId?.resp?.type,
          uri: documentWithId?.resp?.uri,
        });
        console.log('uploadDocument postData', postData);
        const resp = await Service.postApiWithToken(
          userToken,
          Service.ASSIGNMENT_UPLOAD_FILE,
          postData,
        );
        console.log('uploadDocument resp', resp?.data);
        if (resp.data.status) {
          Toast.show({ text1: resp.data.message });
          deleteDocument(item?.id);
          getProductDetails();
        } else {
          Toast.show({ text1: resp.data.message });
        }
      } catch (error) {
        console.log('error in uploadDocument', error);
      }
      setShowLoader(false);
    }
  };
  const gotoCart = () => navigation.navigate(ScreenNames.CART);
  const addToCart = async (object_id, object_type, cart_value) => {
    const postData = new FormData();
    postData.append('object_id', object_id);
    postData.append('object_type', object_type);
    postData.append('cart_value', cart_value);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ADD_TO_CART,
        postData,
      );
      console.log('addToCart resp', resp?.data);
      if ((!resp?.data?.status && resp?.data?.error === 1) || (!resp?.data?.status && resp?.data?.error === 2)) {
        addToCartObject.object_id = object_id;
        addToCartObject.object_type = object_type;
        addToCartObject.cart_value = cart_value;
        addToCartObject.type = resp?.data?.error;
        setShowLoader(false);
        setShowCourseTypeModal(true);
        return;
      }
      if (resp?.data?.status) {
        dispatch(setCartCount(resp?.data?.cart_count))
        await AsyncStorage.setItem(
          'cart_count',
          JSON.stringify(resp?.data?.cart_count),
        );
        Toast.show({ text1: resp?.data?.message });
        gotoCart();
      } else {
        Toast.show({ text1: resp?.data?.message });
      }
    } catch (error) {
      console.log('error in addToCart', error);
    }
    setShowLoader(false);
  };

  const yesBtnHandler1 = async () => {
    const response = await Service.postApiWithToken(userToken, Service.EMPTY_CART, {});
    if (response?.data?.status) {
      addToCart(addToCartObject.object_id, addToCartObject.object_type, addToCartObject.cart_value);
      setShowCourseTypeModal(false);
    }
  };

  const noBtnHandler1 = () => {
    setShowCourseTypeModal(false);
  };

  console.log({ productDetails })
  //UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Product Details" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: '20%' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.mainView}>
          {typeof productDetails === 'object' ? (
             <View
             style={{
               overflow: 'hidden',
               width: '100%',
               alignSelf: 'center',
               zIndex: -999,
               borderRadius: 20,
             }}>
              {
            sliderData?.length > 0 ? (
              <ImageSlider
                data={sliderData}
                autoPlay={false}
                closeIconColor="#ED1C24"
                // onItemChanged={handleItemChanged}
                activeIndicatorStyle={{ backgroundColor: Colors.THEME_GOLD }}
                inActiveIndicatorStyle={{ backgroundColor: '#fff', }}
                indicatorContainerStyle={{top: -5}}
                caroselImageStyle={{
                  resizeMode: 'stretch',
                  // height: '100%',
                  width: width *0.98 ,
                  height: height * 0.30,
                  borderRadius: 20
                }}
              />
            ) : null}
            </View>  
          ) : null} 
          {/* {typeof productDetails === 'object' ? (
            sliderData?.length > 0 ? (
              <Carousel data={sliderData} />
            ) : null
          ) : null} */}

          <View style={styles.topRow}>
            <MyText
              text={productDetails?.title}
              fontFamily="regular"
              fontSize={16}
              textColor={'black'}
              style={{ width: '65%' }}
            />
            <View style={{ flexDirection: 'row' }}>
              <MyText
                text={'$' + productDetails.price}
                fontFamily="bold"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.14}
                style={{ textDecorationLine: (productDetails.sale_price !== productDetails.price) ? 'line-through' : 'none', }}
              />
              {productDetails.sale_price !== productDetails.price && <MyText
                text={'$' + productDetails.sale_price}
                fontFamily="bold"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.14}
                style={{ marginLeft: responsiveWidth(2) }}
              />}
            </View>
          </View>
          <View style={styles.middleRow}>
            <View style={styles.middleLeftRow}>
              <View style={styles.ratingRow}>
                <Image source={require('assets/images/star.png')} />
                <MyText
                  text={productDetails?.avg_rating}
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
                  source={{ uri: productDetails?.creator_image }}
                  style={styles.createImgStyle}
                />
                <MyText
                  text={productDetails?.creator_name}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.THEME_GOLD}
                  letterSpacing={0.13}
                  style={{ marginLeft: 10 }}
                />
              </View>
              <View style={styles.iconsRow}>
                <TouchableOpacity
                  onPress={() => {
                    onLike('2', productDetails.id, productDetails.isWishlist);
                  }}>
                  <Image
                    source={
                      productDetails?.isWishlist
                        ? require('assets/images/heart-selected.png')
                        : require('assets/images/heart.png')
                    }
                    style={{ height: 14, width: 14 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  shareItemHandler(route?.params?.type, route?.params?.id);
                }}>
                  <Image
                    source={require('assets/images/share.png')}
                    style={{ marginLeft: 10, height: 14, width: 14 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <MyText
              text={productDetails?.category_name}
              fontFamily="medium"
              fontSize={16}
              numberOfLines={1}
              textColor={'black'}
              textAlign={'right'}
              style={{ width: '30%' }}
            />
          </View>

          {showModal.isVisible ? (
            <VideoModal
              isVisible={showModal.isVisible}
              toggleModal={toggleModal}
              videoDetail={{ ...showModal?.data, url: showModal?.data?.file }}
            // {...props}
            />
          ) : null}

          {productDetails?.description ? (
            <MyText
              text={productDetails?.description}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{ width: '100%', marginTop: 17 }}
            />
          ) : null}

          <ViewAll text="Tags" showSeeAll={false} style={{ marginTop: 20 }} />
          {productDetails?.tags?.length > 0 ? (
            <FlatList
              data={productDetails?.tags}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 11 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderTags}
            />
          ) : (
            <MyText
              text={'No Tags found!'}
              fontFamily="medium"
              fontSize={18}
              textAlign="center"
              textColor={'black'}
            />
          )}
          <View style={{ height: 37 }}></View>
          <ViewAllSub
            text="Ratings & Reviews"
            rating={productDetails?.rating}
            reviews={productDetails?.review_count}
            onPress={gotoAllReviews}
            showButton={productDetails?.review?.length > 0}
            style={{ marginBottom: 17 }}
          />
          {productDetails?.review?.length > 0 ? (
            productDetails?.review?.map((item, index) => (
              <View key={item.index?.toString()} style={styles.reviewContainer}>
                <View style={styles.reviewTopRow}>
                  <View style={styles.reviewTopLeftRow}>
                    <Image
                      source={
                        item?.profile_image
                          ? { uri: item?.profile_image }
                          : require('assets/images/user-default.png')
                      }
                      style={styles.reviewImg}
                    />
                    <MyText
                      text={`${item.first_name} ${item.last_name}`}
                      fontFamily="medium"
                      fontSize={13}
                      textColor={Colors.LIGHT_GREY}
                      style={{ marginLeft: 10 }}
                    />
                  </View>
                  <Image source={require('assets/images/message-text.png')} />
                </View>
                <MyText
                  text={item.review}
                  fontFamily="medium"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  style={{ marginTop: 10 }}
                />
              </View>
            ))
          ) : (
            <MyText
              text={'No Reviews found'}
              fontFamily="medium"
              fontSize={18}
              textAlign="center"
              textColor={'black'}
            />
          )}
          <View style={styles.buttonsRow}>
            {productDetails.in_stock ? <>
              <MyButton
                text="Add to Cart"
                onPress={() => {
                  addToCart(productDetails?.id, '2', productDetails?.price);
                }}
                style={{
                  width: '48%',
                  height: 50,
                  backgroundColor: Colors.THEME_BROWN,
                }}
              />
              <MyButton
                text="Buy Now"
                onPress={() => {
                  addToCart(productDetails?.id, '2', productDetails?.price);
                }}
                style={{
                  width: '48%',
                  height: 50,
                  backgroundColor: Colors.THEME_GOLD,
                }}
              /></> : <MyButton
              text="Out of stock"
              disabled={productDetails.in_stock ? false : true}
              onPress={() => {
                addToCart(productDetails?.id, '2', productDetails?.price);
              }}
              style={{
                width: '100%',
                height: 50,
                backgroundColor: Colors.THEME_BROWN,
              }}
            />}
          </View>
          {productDetails?.isPurchased &&
            <FAB_Button onPress={openReviewModal} bottom={responsiveHeight(10)} />}
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
        <Review
          visible={showReviewModal}
          setVisibility={setShowReviewModal}
          starRating={starRating}
          setStarRating={setStarRating}
          review={review}
          setReview={setReview}
          submitReview={submitReview}
        />
      </View>
      {showCourseTypeModal && <CourseTypeModal yesBtnHandler={yesBtnHandler1} noBtnHandler={noBtnHandler1} type={addToCartObject.type} />}
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(ProductDetails);

const ViewAllSub = ({
  text,
  rating,
  reviews,
  onPress,
  style = {},
  buttonText = 'See All',
  showButton = true,
}) => {
  return (
    <View style={[styles.viewAllContainer, style]}>
      <View>
        <MyText
          text={text}
          fontFamily="medium"
          fontSize={18}
          textColor={'#455A64'}
        />
        <View style={styles.ratingView}>
          <Image
            source={require('assets/images/selected-star.png')}
            style={{ height: 10, width: 10 }}
          />
          <MyText
            text={rating}
            fontSize={13}
            fontFamily="regular"
            textColor={Colors.LIGHT_GREY}
            style={{ marginLeft: 5 }}
          />
          <MyText
            text={'Reviews' + ' (' + reviews + ')'}
            fontSize={13}
            fontFamily="regular"
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
        </View>
      </View>
      {showButton ? (
        <TouchableOpacity onPress={onPress} style={styles.viewAll}>
          <MyText
            text={buttonText}
            fontFamily="regular"
            fontSize={13}
            textColor={Colors.THEME_GOLD}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
