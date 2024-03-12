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
  TextInput,
  SafeAreaView,
  StatusBar,
  Keyboard,
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
import {  Constant, MyIcon, ScreenNames, Service } from 'global/Index';
//import : styles
import { styles } from './ProceedToPaymentStyle';
//import : modal
//import : redux
import { connect, useSelector } from 'react-redux';
import { width, height } from 'global/Constant';
import Divider from 'components/Divider/Divider';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import ViewAll from '../../../components/ViewAll/ViewAll';
import SuccessfulyPurchased from '../../../modals/SuccessfulyPurchased/SuccessfulyPurchased';
import { CommonActions } from '@react-navigation/native';
import AddCard from '../../../modals/AddCard/AddCard';
import {
  CardField,
  CardFieldInput,
  useStripe,
  StripeContainer,
} from '@stripe/stripe-react-native';
import { clearCart } from 'src/reduxToolkit/reducer/user';
import { setCartCount } from '../../../reduxToolkit/reducer/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../global/Index';

const ProceedToPayment = ({ navigation, dispatch }) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccessfulyPurchasedModal, setShowSuccessfulyPurchasedModal] =
    useState(false);
  const [selectedCard, setSelectedCard] = useState('');
  const [cardList, setCardList] = useState([
    {
      id: '1',
      img: require('assets/images/mastercard.png'),
      cardNum: '1111 1111 1111 5967',
      expires: '24/22',
    },
    {
      id: '2',
      img: require('assets/images/visa.png'),
      cardNum: '1111 1111 1111 5967',
      expires: '24/22',
    },
  ]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [screenData, setScreenData] = useState({});
  const [card, setCard] = useState(CardFieldInput.Details | null);
  const { initPaymentSheet, createToken, presentPaymentSheet } = useStripe();
  const [madePayment, setMadePayment] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    getData();
  }, []);
  const checkcon = () => {
    getData();
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
  const getData = async () => {
    setShowLoader(true);
    try {
      const resp = await Service.getApiWithToken(
        userToken,
        Service.CART_DETAILS_PAYMENT,
      );
      console.log('getData userToken', userToken);
      console.log('getData resp', resp?.data);
      if (resp?.data?.status) {
        // show message only when no cards found
        resp?.data?.data?.length === 0 &&
          Toast.show({ text1: resp.data.message });
        setScreenData(resp?.data);
      } else {
        Toast.show({ text1: resp.data.message });
      }
    } catch (error) {
      console.log('error in getData', error);
    }
    setShowLoader(false);
  };
  const resetIndexGoToUserBottomTab = CommonActions.reset({
    index: 1,
    routes: [{ name: ScreenNames.BOTTOM_TAB }],
  });
  const handlePayClick = async (order_id, total_amount, stripeToken) => {
    !showLoader && setShowLoader(true);
    try {
      const myData = new FormData();
      myData.append('stripeToken', stripeToken);
      myData.append('order_id', order_id);
      myData.append('total_amount', Number(total_amount));
      console.log('handlePayClick postData', myData);
      const resp = await Service.postApiWithToken(
        userToken,
        Service.MAKE_PAYMENT,
        myData,
      );
      console.log('handlePayClick resp', resp?.data);
      if (resp?.data?.status) {
        setMadePayment(true);
        dispatch(setCartCount(resp?.data?.cart_count));
        await AsyncStorage.setItem(
          'cart_count',
          JSON.stringify(resp?.data?.cart_count),
        );
        Toast.show({ text1: resp?.data?.message });
        openSuccessfulyPurchasedModal();
        dispatch(clearCart());
      } else {
        Toast.show({ text1: resp?.data?.message });
      }
    } catch (error) {
      console.log('error in handlePayClick', error);
    }
    setShowLoader(false);
  };
  const onConfirm = async () => {
    if (madePayment) {
      Toast.show({ text1: 'You have already made payment' });
      return;
    } else if (card === 0) {
      Toast.show({ text1: 'Please enter card details' });
      return;
    } else if (!card?.complete) {
      Toast.show({ text1: 'Please enter a valid card details' });
      return;
    }
    const postData = new FormData();
    // postData.append('card_id', 5);
    console.log('onConfirm postData', postData);
    setShowLoader(true);
    try {
      console.log('card', card);
      const res = await createToken({ card, type: 'Card' });
      console.log('res stripe', res?.token?.id);
      // return
      if (res?.error) {
        if (res?.error?.message) {
          Toast.show({ text1: res?.error?.message });
        } else {
          Toast.show({ text1: 'Incorrect Card details' });
        }
        return;
      }
      // const resp = {};
      const resp = await Service.postApiWithToken(
        userToken,
        Service.SAVE_ORDER,
        {},
      );
      console.log('onConfirm resp', resp?.data);
      if (resp?.data?.status) {
        handlePayClick(
          resp?.data?.order_id,
          resp?.data?.total_amount,
          res?.token?.id,
        );
        // Toast.show({text1: resp.data.message});
        // openSuccessfulyPurchasedModal();
        // navigation.dispatch(resetIndexGoToUserBottomTab);
      } else {
        Toast.show({
          text1: resp.data?.message,
        });
      }
    } catch (error) {
      setShowLoader(false);
      console.log('error in onConfirm', error);
    } finally {
      setShowLoader(false);
    }
  };

  const openSuccessfulyPurchasedModal = () => {
    setShowSuccessfulyPurchasedModal(true);
  };
  const openAddCardModal = () => {
    setShowAddCardModal(true);
  };
  const resetIndexGoToMyOrders = CommonActions.reset({
    index: 1,
    // routes: [{name: ScreenNames.MY_ORDERS}],
    routes: [
      {
        name: ScreenNames.BOTTOM_TAB,
        state: {
          routes: [{ name: ScreenNames.MY_ORDERS }],
        },
      },
    ],
  });
  const gotoMyCourses = () => {
    navigation.dispatch(resetIndexGoToMyOrders);
  };
  const changeSelectedCard = id => {
    setSelectedCard(id);
  };
  const deleteCard = id => {
    const cardListCopy = [...cardList];
    const updatedData = cardListCopy.filter(el => el.id !== id);
    setCardList([...updatedData]);
    // setSelectedCard(id);
  };

  // console.log({screenData})
  //UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <StripeContainer>
          <MyHeader Title="Select payment method" isBackButton />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: '20%' }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.mainView}>
            <View style={styles.summaryContainer}>
              <View style={[styles.row, { marginBottom: 10 }]}>
                <MyText
                  text={`Subtotal (${screenData?.order_count ? screenData?.order_count : 0})`}
                  fontSize={14}
                  fontFamily="medium"
                  textColor={'#455A64'}
                  style={{}}
                />
                <MyText
                  // text={`$${Number(screenData?.sub_total).toFixed(2)}`}
                  text={'$' + (screenData?.sub_total ? screenData?.sub_total : 0)}
                  fontSize={14}
                  fontFamily="medium"
                  textColor={'#455A64'}
                  style={{}}
                />
              </View>
              <View style={[styles.row, { marginBottom: 10 }]}>
                <MyText
                  text={`Discount`}
                  fontSize={14}
                  fontFamily="medium"
                  textColor={'#8F93A0'}
                  style={{}}
                />
                <MyText
                  // text={`$${Number(screenData?.discount).toFixed(2)}`}
                  text={screenData?.discount > 0 ? ('-$' + screenData?.discount) : '$0'}
                  fontSize={14}
                  fontFamily="medium"
                  textColor={'#8F93A0'}
                  style={{}}
                />
              </View>
              {screenData.type === 2 && <View style={[styles.row, { marginBottom: 10 }]}>
                <MyText
                  text={`Shipping Cost`}
                  fontSize={14}
                  fontFamily="medium"
                  textColor={'#8F93A0'}
                  style={{}}
                />
                <MyText
                  text={screenData?.shipping_cost > 0 ? ('+$' + screenData?.shipping_cost?.toFixed(2)) : '$0'}
                  fontSize={14}
                  fontFamily="medium"
                  textColor={'#8F93A0'}
                  style={{}}
                />
              </View>}
              <View style={[styles.row, { marginBottom: 19 }]}>
                <MyText
                  text={`Tax`}
                  fontSize={14}
                  fontFamily="medium"
                  textColor={'#8F93A0'}
                  style={{}}
                />
                <MyText
                  text={screenData?.tax > 0 ? ('+$' + screenData?.tax) : '$0'}
                  fontSize={14}
                  fontFamily="medium"
                  textColor={'#8F93A0'}
                  style={{}}
                />
              </View>
              {/* <View style={[styles.row, {marginBottom: 19}]}>
                <MyText
                  text={`Shipping`}
                  fontSize={14}
                  fontFamily="medium"
                  textColor={'#455A64'}
                  style={{}}
                />
                <MyText
                  text={`$${Number(screenData?.shipping).toFixed(2)}`}
                  fontSize={14}
                  fontFamily="medium"
                  textColor={'#455A64'}
                  style={{}}
                />
              </View> */}
              <Divider style={{ borderColor: '#E0E0E0' }} />
              <View style={[styles.row, { marginTop: 14 }]}>
                <MyText
                  text={`Total`}
                  fontSize={18}
                  fontFamily="medium"
                  textColor={'#455A64'}
                  style={{}}
                />
                <MyText
                  // text={`$${Number(screenData?.total).toFixed(2)}`}
                  text={'$' + (screenData?.total ? screenData?.total : 0)}
                  fontSize={18}
                  fontFamily="medium"
                  textColor={'#455A64'}
                  style={{}}
                />
              </View>
            </View>
            <ViewAll
              text="Please enter card details"
              showSeeAll={false}
              // buttonText="Add New"
              // onPress={openAddCardModal}
              style={{
                justifyContent: 'center',
                marginTop: 25,
                marginBottom: 21,
              }}
            />
            <CardField
              accessible={true}
              postalCodeEnabled={false}
              placeholder={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                borderRadius: 20,
                backgroundColor: 'white',
                borderColor: Colors.THEME_GOLD,
                borderWidth: 1,
                textColor: Colors.WHITE,
                placeholderColor: '#c9c9c9',
              }}
              style={{
                width: '100%',
                height: 200,
                marginTop: 20,
                marginBottom: 30,
              }}
              onCardChange={cardDetails => {
                console.log('shoaib', cardDetails)
                setCard(cardDetails);
                if (cardDetails?.complete) {
                  Keyboard.dismiss();
                }
              }}
              onFocus={focusedField => {
                console.log('focusField', focusedField);
              }}
            />
            {/* {screenData?.data?.length > 0 ? (
              screenData?.data?.map(item => (
                <TouchableOpacity
                  key={item.card_id}
                  onPress={() => {
                    changeSelectedCard(item.card_id);
                  }}
                  style={[
                    styles.cardContainer,
                    item.card_id === selectedCard
                      ? {borderWidth: 1, borderColor: Colors.THEME_GOLD}
                      : null,
                  ]}>
                  <View style={styles.cardContainerLeftRow}>
                    <Image
                      source={
                        item.card_id === selectedCard
                          ? require('assets/images/selected.png')
                          : require('assets/images/not-selected.png')
                      }
                    />
                    <Image
                      source={getCardImage(item.type)}
                      style={{marginLeft: 15}}
                    />
                    <View style={{marginLeft: 12}}>
                      <MyText
                        text={'**** **** **** ' + item.card_number.slice(-5)}
                        // text={item.card_number}
                        fontSize={16}
                        fontFamily="medium"
                        textColor={'#261313'}
                      />
                      <MyText
                        text={`Expires ${item.valid_upto}`}
                        fontSize={14}
                        fontFamily="light"
                        textColor={Colors.LIGHT_GREY}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      deleteCard(item.id);
                    }}>
                    <Image source={require('assets/images/trash.png')} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <MyText
                text={`No Cards found`}
                fontFamily="medium"
                fontSize={18}
                textColor={'#455A64'}
                style={{textAlign: 'center', marginTop: 20}}
              />
            )} */}
            <MyButton
              text="CONFIRM"
              style={{
                width: width * 0.9,
                marginBottom: 10,
                backgroundColor: Colors.THEME_BROWN,
                marginTop: 32,
              }}
              // onPress={openSuccessfulyPurchasedModal}
              onPress={onConfirm}
            // onPress={handlePayClick}
            />
          </ScrollView>
        </StripeContainer>
        <CustomLoader showLoader={showLoader} />
        <SuccessfulyPurchased
          visible={showSuccessfulyPurchasedModal}
          setVisibility={setShowSuccessfulyPurchasedModal}
          gotoMyCourses={gotoMyCourses}
        />
        <AddCard
          visible={showAddCardModal}
          setVisibility={setShowAddCardModal}
          // setShowLoader={setShowLoader}
          userToken={userToken}
          callFunctionAfterAddingcard={getData}
        />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(ProceedToPayment);

const getCardImage = type => {
  if (type === 'VISA') {
    return require('assets/images/visa.png');
  } else if (type === 'MASTERCARD') {
    return require('assets/images/mastercard.png');
  } else {
    return require('assets/images/mastercard.png');
  }
};
