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
  Platform,
  RefreshControl,
  PermissionsAndroid
} from 'react-native';
//import : custom components
import MyHeader from 'components/MyHeader/MyHeader';
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
import { shareItemHandler } from '../../../global/globalMethod';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
//import : global
import { Colors, Constant, MyIcon, ScreenNames, Service } from 'global/Index';
//import : styles
import { styles } from './OrderDetailsStyle';
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
import RNFetchBlob from 'react-native-blob-util';
import defaultImg from "../../../assets/images/default-content-creator-image.png"

const OrderDetails = ({ navigation, dispatch, route }) => {
  const defaultImgPath = Image.resolveAssetSource(defaultImg).uri;
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [orderData, setOrderData] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState('');
  const [starRating, setStarRating] = useState(1);
  const [selectedId, setSelectedId] = useState('1');
  const [selectedType, setSelectedType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    getOrderDetail();
  }, []);
  const checkcon = () => {
    getOrderDetail();
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
  const getOrderDetail = async () => {
    setShowLoader(true);
    const formdata = new FormData();
    console.log({ 'order_id': route?.params?.order_id, 'item_id': route?.params?.item_id, userToken });
    formdata.append('order_id', route?.params?.order_id);
    formdata.append('item_id', route?.params?.item_id);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ORDER_DETAIL,
        formdata,
      );
      console.log('getOrderDetail resp', resp?.data);
      if (resp?.data?.status) {
        const isCourseExist = resp.data.items?.find(el => el.type == '1');
        if (isCourseExist) {
          resp.data.items = await generateThumb(resp?.data?.items);
          setOrderData(resp?.data);
        } else {
          setOrderData(resp?.data);
        }
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in getOrderDetail', error);
    }
    setShowLoader(false);
  };
  const generateThumb = async data => {
    console.log('generateThumb', JSON.stringify(data));
    let updatedData = [...data];
    try {
      updatedData = await Promise.all(
        data?.map?.(async el => {
          if (el?.type == '2') {
            return el;
          }
          // console.log('here', JSON.stringify(el));
          const thumb = await createThumbnail({
            url: el?.video,
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
    console.log('thumb data order details', updatedData);
    return updatedData;
  };


  const requestDownloadingPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Downloading Permission',
          message:
            'Arkansas needs access to your downloading manager ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        downloadInvoice();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const downloadInvoice = async () => {
    console.log('downloadInvoice', orderData?.invoice);
    let pdfUrl = orderData?.invoice;
    let DownloadDir =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    const { dirs } = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: 'Arkansas',
      path: `${dirToSave}.pdf`,
    };
    console.log('here');
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: 'pdf',
      },
      android: configfb,
    });
    Platform.OS == 'android'
      ? RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${DownloadDir}/.pdf`,
          description: 'Arkansas',
          title: `${orderData?.data?.order_number} invoice.pdf`,
          mime: 'application/pdf',
          mediaScannable: true,
        },
      })
        .fetch('GET', `${pdfUrl}`)
        .catch(error => {
          console.warn(error.message);
        })
      : RNFetchBlob.config(configOptions)
        .fetch('GET', `${pdfUrl}`, {})
        .then(res => {
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
            RNFetchBlob.ios.previewDocument(configfb.path);
          }
          console.log('The file saved to ', res);
        })
        .catch(e => {
          console.log('The file saved to ERROR', e.message);
        });
  };

  const RenderItem = ({ item }) => {
    console.log('item', item);
    return (
      <View style={styles.courseContainer}>
        <View style={styles.courseTopRow}>
          <MyText
            text={`Order ID: ${orderData?.data?.order_number}`}
            fontFamily="medium"
            fontSize={12}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <MyText
              // text={item?.order_status == '1' ? 'Paid' : 'Not Paid'}
              text={'Paid'}
              fontFamily="medium"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{ marginLeft: 5 }}
            />
          </View>
        </View>
        <View style={styles.courseSubContainer}>
          <ImageBackground
            source={
              item?.type == '1' ? { uri: item?.thumb?.path } : { uri: item?.image }
            }
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
                  source={{ uri: item?.creator_image ? item?.creator_image : defaultImgPath }}
                  style={styles.createImgStyle}
                />
                <MyText
                  text={item.creator_name}
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
                text={'$' + item?.total_amount_paid}
                fontFamily="bold"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.14}
                style={{}}
              />
               <TouchableOpacity onPress={() => {
                  shareItemHandler(item?.type, item?.id);
                }}>
              <View style={styles.iconsRow}>
                {/* <Image source={require('assets/images/heart-selected.png')} /> */}
                <Image
                  source={require('assets/images/share.png')}
                  style={{ marginLeft: 10 }}
                />
              </View>
              </TouchableOpacity>
            </View>
            {item?.type == '1' ? (
              <MyButton
                text="WRITE YOUR REVIEW HERE"
                style={{
                  // width: '90%',
                  height: 40,
                  marginTop: 8,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={() => openReviewModal(item?.id, '1')}
              />
            ) : null}
          </View>
        </View>
        <Divider
          style={{ borderColor: '#ECECEC', marginTop: 11, marginBottom: 5 }}
        />
        <MyText
          text={orderData?.data?.order_date}
          fontFamily="medium"
          fontSize={12}
          textColor={Colors.LIGHT_GREY}
          style={{}}
        />
      </View>
    );
  };
  const Summary = ({ }) => {
    return (
      <View style={styles.summaryContainer}>
        <View style={[styles.row, { marginBottom: 10 }]}>
          <MyText
            // text={`Total Amount (1)`}
            text={`Subtotal`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
          <MyText
            text={orderData?.data?.sub_total != undefined ? '$'+ orderData?.data?.sub_total : '0'}
            fontSize={14}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
        </View>
        {orderData?.data?.order_for === 2 && <View style={[styles.row, { marginBottom: 10 }]}>
          <MyText
            text={`Shipping Cost`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          <MyText
            text={Number(orderData?.data?.shipping_cost) > 0 ? '+ $' + orderData?.data?.shipping_cost : '$0'}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
        </View>}
        <View style={[styles.row, { marginBottom: 7 }]}>
          <MyText
            text={`Tax`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          <MyText
            text={Number(orderData?.data?.taxes) > 0 ? '+ $' + orderData?.data?.taxes : '$0'}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
        </View>
        <View style={[styles.row, { marginBottom: 19 }]}>
          <MyText
            text={`Coupon Discount`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          <MyText
            text={Number(orderData?.data?.coupon_discount_price) > 0 ? '- $' + orderData?.data?.coupon_discount_price : '$0'}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
        </View>
        {/* <Divider style={{ borderColor: '#E0E0E0' }} />
        <View style={[styles.row, { marginTop: 14 }]}>
          <MyText
            text={`Coupon Discount`}
            fontSize={18}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
          <MyText
            text={'$' + orderData?.data?.shipping_cost}
            fontSize={18}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
        </View> */}
      </View>
    );
  };

  const UserDetails = ({ }) => {
    return (
      <View style={styles.summaryContainer}>
        <View style={[styles.row, { marginBottom: 10 }]}>
          <MyText
            // text={`Total Amount (1)`}
            text={`Name`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />{
            orderData?.shipping_address?.first_name && orderData?.shipping_address?.last_name != undefined ?
            <MyText
            text={orderData?.shipping_address?.first_name + "  " + orderData?.shipping_address?.last_name}
            fontSize={14}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
          :
          <MyText
          text={"not available"}
          fontSize={14}
          fontFamily="medium"
          textColor={'#455A64'}
          style={{}}
        />
          }
         
        </View>
        {orderData?.data?.order_for === 2 && <View style={[styles.row, { marginBottom: 10 }]}>
          <MyText
            text={`Email`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          {
            orderData?.shipping_address?.email != undefined ?
            <MyText
            text={orderData?.shipping_address?.email}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          :
          <MyText
          text={"not available"}
          fontSize={14}
          fontFamily="medium"
          textColor={'#8F93A0'}
          style={{}}
        />
          }
         
        </View>}
        <View style={[styles.row, { marginBottom: 7 }]}>
          <MyText
            text={`Phone`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          {
            orderData?.shipping_address?.phone != undefined ? 
            <MyText
            text={orderData?.shipping_address?.phone}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />:
          <MyText
          text={"not available"}
          fontSize={14}
          fontFamily="medium"
          textColor={'#8F93A0'}
          style={{}}
        />
          }
           
        </View>
        <View style={[styles.row, { marginBottom: 19 }]}>
          <MyText
            text={`Address`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
           {
            orderData?.shipping_address?.address_line_1 != undefined ? 
            <MyText
            text={orderData?.shipping_address?.address_line_1 + ", " + orderData?.shipping_address?.city + ", " + orderData?.shipping_address?.state + ", " + orderData?.shipping_address?.country }
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          :
          <MyText
          text={'not available'}
          fontSize={14}
          fontFamily="medium"
          textColor={'#8F93A0'}
          style={{}}
        />
           }
         
        </View>
        {/* <Divider style={{ borderColor: '#E0E0E0' }} />
        <View style={[styles.row, { marginTop: 14 }]}>
          <MyText
            text={`Coupon Discount`}
            fontSize={18}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
          <MyText
            text={'$' + orderData?.data?.shipping_cost}
            fontSize={18}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
        </View> */}
      </View>
    );
  };
  const openReviewModal = (id, type) => {
    setSelectedId(id);
    setSelectedType(type);
    setShowReviewModal(true);
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
    console.log('submitReview postData', postData);
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

  console.log("shoaib", orderData?.shipping_address)
  //UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Order Details" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: '20%' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.mainView}>
          {orderData?.items && Array.isArray(orderData?.items) ? (
            <>
              <RenderItem item={orderData?.items?.find(el => el.is_primary)} />
              {orderData?.items?.length > 1 ? (
                <>
                  <MyText
                    text={'Other Items'}
                    fontFamily="medium"
                    fontSize={16}
                    textColor={Colors.THEME_BROWN}
                    style={{ marginBottom: 10 }}
                  />
                  {orderData?.items
                    ?.filter(el => !el.is_primary)
                    ?.map(item => (
                      <RenderItem item={item} />
                    ))}
                </>
              ) : null}
            </>
          ) : null}
          <Summary />
          <UserDetails />

          <View style={styles.amountContainer}>
            <ImageBackground
              source={require('assets/images/amount-bg.png')}
              style={styles.amountContainer}>
              <View style={styles.whiteCircle3}>
                <View style={styles.whiteCircle2}>
                  <Image source={require('assets/images/amount-icon.png')} />
                </View>
              </View>
              <View style={{ marginLeft: 12 }}>
                <MyText
                  text={'Total Amount'}
                  fontFamily="regular"
                  fontSize={14}
                  textColor={Colors.WHITE}
                  textAlign={'center'}
                  style={{}}
                />
              
                <MyText
                  text={orderData?.data?.total_amount_paid != undefined ? "$" + `${orderData?.data?.total_amount_paid}` : "0"}
                  fontFamily="bold"
                  fontSize={16}
                  textColor={Colors.WHITE}
                  style={{ marginTop: 5 }}
                />
             
              </View>
            </ImageBackground>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.cardContainerLeftRow}>
              {/* <Image
                source={
                  item.card_id === selectedCard
                    ? require('assets/images/selected.png')
                    : require('assets/images/not-selected.png')
                }
              /> */}
              <Image
                source={getCardImage(orderData?.data?.transaction?.card_type)}
                style={{ marginLeft: 15 }}
              />
              <View style={{ marginLeft: 12 }}>
                <MyText
                  text={
                    '**** **** **** ' + orderData?.data?.transaction?.card_no != undefined ? orderData?.data?.transaction?.card_no : ""
                  }
                  // text={'**** **** **** '}
                  fontSize={16}
                  fontFamily="medium"
                  textColor={'#261313'}
                />
                <MyText
                  text={`Expires ${orderData?.data?.transaction?.expiry != undefined ? orderData?.data?.transaction?.expiry : ""}`}
                  fontSize={14}
                  fontFamily="light"
                  textColor={Colors.LIGHT_GREY}
                />
              </View>
            </View>
          </View>
          <MyButton
            text="DOWNLOAD INVOICE"
            style={{
              width: width * 0.9,
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
              marginTop: 32,
            }}
            onPress={requestDownloadingPermission}
          />
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
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(OrderDetails);

const itemData = {
  order_id: '32',
  order_date: '11 Oct, 2023 05:17AM',
  order_number: 'AKS32653321',
  product_id: '4',
  title: 'Activated charcoal',
  description:
    'Commonly used in emergency rooms across the world as an antidote to the ingestion of toxic amounts of illegal or prescription drugs, charcoal is given in an attempt to minimize the number of toxins that are absorbed into the gut. In theory, it may also be useful in preventing toxins that may be absorbed through diet. Available in tablet or powder form.',
  total_amount_paid: '200',
  price: '200',
  category_id: '7',
  category_name: 'Body detox',
  avg_rating: '4.7',
  order_status: 'Paid',
  content_creator_image:
    'http://nileprojects.in/arkansas/public/upload/profile-image/1696397010.jpg',
  content_creator_name: 'Arkansas ',
  content_creator_id: 1,
  isReviewed: 0,
};

const getCardImage = type => {
  console.log('getCardImage', type);
  if (type === 'Visa') {
    return require('assets/images/visa.png');
  } else if (type === 'Mastercard') {
    return require('assets/images/mastercard.png');
  }
};
