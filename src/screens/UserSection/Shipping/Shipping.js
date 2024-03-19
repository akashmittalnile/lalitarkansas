import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import MyHeader from '../../../components/MyHeader/MyHeader';
import { responsiveHeight as hg, responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Item from '../../../components/Item/Item';
import ShippingModal from '../../../modals/ShippingModal/ShippingModal';
import { Service } from '../../../global/Index';
import CustomLoader from '../../../components/CustomLoader/CustomLoader';
import BorderLessBtn from '../../../components/Button/BorderLessBtn';
import discountIcon from "../../../assets/images/discount.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, ScreenNames } from '../../../global/Index';
import { styles } from "../Cart/CartStyle"
import MyButton from '../../../components/MyButton/MyButton';
import MyText from '../../../components/MyText/MyText';
import ViewAll from '../../../components/ViewAll/ViewAll';
import Divider from '../../../components/Divider/Divider';
import { width } from '../../../global/Constant';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-virtualized-view';

const Shipping = () => {
    const navigation = useNavigation();
    // const focused = useIsFocused();
    const { params } = useRoute();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cartListData, setCartListData] = useState(null);
    const userToken = useSelector(state => state.user.userToken);
    const [coupon, setCoupon] = useState({
        applied: false,
        item: null,
    });
    const [loader, setLoader] = useState(false);
    const [modalProductId, setModalProductId] = useState(null);
    const [selectedShippingService, setSelectedShippingService] = useState([]);
    const discountIconPath = Image.resolveAssetSource(discountIcon).uri;


    useEffect(() => {
        getShippingRates();
    }, [params]);

    const getShippingRates = async () => {
        try {
            setLoader(true);
            const response = await Service.postApiWithToken(userToken, Service.GET_SHIPPING_RATES, {});
            if (response?.data?.status) {
                getCartList();
            }
        } catch (err) {
            console.log('shipping_rates err', err.message);
        } finally {
            setTimeout(() => {
                setLoader(false);
            }, 500);
        }
    };

    const getCartList = async () => {
        try {
            const resp = await Service.getApiWithToken(userToken, Service.CART_LIST);
            if (resp?.data?.status) {
                setCartListData(resp.data);
                if (resp.data?.data?.couponCode) {
                    setCoupon({
                        applied: true,
                        item: {
                            code: resp.data.data.couponCode,
                            discount_amount: resp?.data?.data?.couponPrice,
                        },
                    });
                }
                else {
                    getAllCoupon(resp.data);
                }
                const temp1 = resp?.data?.data?.items.filter(item => item.shippment_id !== null);
                if (temp1?.length > 0) {
                    const temp2 = temp1.map(item => ({
                        product_id: item.product_id,
                        service_code: item.service_code,
                        name: item?.compare_rate_list[0]?.name,
                        price: item?.compare_rate_list[0]?.price,
                    }));
                    setSelectedShippingService(temp2);
                }
                else {
                    setSelectedShippingService([]);
                }
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const modalHandler = (product_id = null) => {
        console.log("SHIPPING-ID",product_id);
        setModalProductId(product_id);
        setIsModalVisible(preData => (!preData));
    };

    const selectedProductShippingIdHandler = (value, product_id) => {
        const temp1 = selectedShippingService.filter(item => (item.product_id === product_id && item.service_code === value?.service_code));
        if (temp1.length > 0) {
            setIsModalVisible(false);
            return;
        }
        setSelectedShippingService(preData => ([
            ...preData,
            {
                service_code: value?.service_code,
                product_id,
                name: value?.name,
                price: value?.price,
            },
        ]));
        setIsModalVisible(false);
    };

    const applyCouponHandler = async () => {
        try {
            setLoader(true);
            if (!coupon.applied) {
                const response = await Service.postApiWithToken(userToken, Service.COUPON_APPLIED, { code: coupon.item?.code });
                if (response?.data?.status) {
                    getCartList();
                }
            }
            else {
                const response = await Service.postApiWithToken(userToken, Service.REMOVE_APPLIED_COUPON, {});
                if (response?.data?.status) {
                    getCartList();
                }
            }
        } catch (err) {
            console.log('coupon applied err', err.message);
        } finally {
            setTimeout(() => {
                setLoader(false);
            }, 1000);
        }
    };

    const showAllCoupons = async () => {
        navigation.navigate(ScreenNames.COUPONS, { subTotal: cartListData?.data?.subTotal, coupon });
    };

    const gotoShippingScreen = () => {
        // navigation.navigate(ScreenNames.PROCEED_TO_PAYMENT);
        if (selectedShippingService.length === cartListData?.data?.items.length) {
            navigation.navigate(ScreenNames.PROCEED_TO_PAYMENT);
        } else {
            Toast.show({
                type: 'info',
                text1: 'Please select shipping for all product',
            });
        }
    };

    const getAllCoupon = async (_cartListData) => {
        try {
            // if (params?.coupon?.applied) {
            //   setCoupon({ applied: params.coupon.applied, item: params.coupon.item });
            // }
            // else {
            let maxDiscount = 0;
            let myCoupon = {};
            const _userToken = await AsyncStorage.getItem('userToken');
            const response = await Service.getApiWithToken(_userToken, Service.ALL_COUPON);
            if (response?.data?.status) {
                const tempArr = response.data?.data.filter((item) => (_cartListData?.data?.subTotal >= item.min_order));
                if (tempArr.length > 0) {
                    for (let i = 0; i < tempArr.length; i++) {
                        if (Number(tempArr[i]?.discount_amount) > maxDiscount) {
                            maxDiscount = Number(tempArr[i]?.discount_amount);
                            myCoupon = tempArr[i];
                        }
                    }
                    setCoupon({
                        applied: false,
                        item: myCoupon,
                    });
                }
                else if (tempArr.length === 0) {
                    setCoupon({
                        applied: false,
                        item: null,
                    });
                }
            }
            // }
        } catch (err) {
            console.log('cart address err', err.message);
        }
    };

    // console.log({ selectedShippingService });
    return (
        <>
            <View>
                <MyHeader Title="Shipping" isBackButton={true} />
                <View style={styless.flatListContainer}>
                    <ScrollView contentContainerStyle={{ paddingBottom: responsiveHeight(10) }} showsVerticalScrollIndicator={false}>
                        <View style={{ paddingTop: responsiveHeight(2), width: responsiveWidth(95) }}>
                            {cartListData?.data?.items.map((item, index) => (<Item key={index.toString()} item={item} type={cartListData.type} coupon={coupon} shownShippingBtn={true} onChangeQuantity={getCartList} shippingBtn={() => { modalHandler(item?.product_id); }} shippingDetails={selectedShippingService} disabledBtn={true} />))}
                        </View>
                        {/* promocode section */}
                        {cartListData?.data?.items.length > 0 && (
                            <>
                                <View style={styles.promocodeHeader}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={{ uri: discountIconPath }} style={{ height: hg(2.5), width: hg(3), marginRight: hg(0.8) }} resizeMode="contain" />
                                        <Text style={styles.heading}>Best offers for you</Text>
                                    </View>
                                </View>
                                <View style={styles.promocodeContainer}>
                                    {(coupon.item !== null && cartListData?.data?.items?.length > 0) && <>
                                        <View style={styles.promoSubContainer}>
                                            <View>
                                                <View>
                                                    {/* <Text style={styles.txtSave}>{coupon.applied ? `You saved $${coupon.item?.discount_amount > 0 ? Number(coupon.item?.discount_amount)?.toFixed(2) : 0} with this code` : `Save $${coupon.item?.discount_amount > 0 ? Number(coupon.item?.discount_amount)?.toFixed(2) : 0} on this order`}</Text> */}
                                                    <Text style={styles.txtSave}>{coupon.applied ? `You saved $${coupon.item?.discount_amount > 0 ? Number(coupon.item?.discount_amount)?.toFixed(2) : 0} with this code` : (coupon.item?.discount_amount > 0 ? (coupon?.item?.discount_type === 1 ? `Save $${Number(coupon.item?.discount_amount)?.toFixed(2)} ` : `Save ${Number(coupon.item?.discount_amount)?.toFixed(0)}% ` + 'on this order') : 0)}</Text>
                                                </View>
                                                <View><Text style={styles.txtCode}>{`Code: ${coupon.item?.code}`}</Text></View>
                                            </View>
                                            <View>
                                                <BorderLessBtn text={coupon.applied ? 'Remove' : 'Apply'} textStyle={styles.couponBtn} onPress={applyCouponHandler} />
                                            </View>
                                        </View>
                                        <View style={styles.dashedLine} /></>}
                                    <View style={{ marginTop: hg(2), alignItems: 'center' }}>
                                        <BorderLessBtn text="View all coupons" textStyle={{ color: Colors.THEME_GOLD, fontSize: responsiveFontSize(1.8), fontWeight: '500' }} onPress={showAllCoupons} />
                                    </View>
                                </View>
                            </>
                        )}

                        {(cartListData?.data) && (cartListData.type === 2 ? <>
                            <ViewAll
                                text="Order Summary"
                                showSeeAll={false}
                                style={{ marginTop: 41 }}
                            />
                            <View style={styles.summaryContainer}>
                                <View style={[styles.row, { marginBottom: 10 }]}>
                                    <MyText
                                        text={`Subtotal (${cartListData?.data?.totalQty ? cartListData?.data?.totalQty : 0})`}
                                        fontSize={14}
                                        fontFamily="medium"
                                        textColor={'#455A64'}
                                        style={{}}
                                    />
                                    <MyText
                                        // text={`$${Number(cartListData?.sub_total).toFixed(2)}`}
                                        text={cartListData?.data?.subTotal ? ('$' + Number(cartListData?.data?.subTotal)?.toFixed(2)) : ('$' + 0)}
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
                                        // text={`$${Number(cartListData?.discount).toFixed(2)}`}
                                        text={(cartListData?.data?.couponPrice > 0 ? `-$${Number(cartListData?.data?.couponPrice)?.toFixed(2)}` : '$' + 0)}
                                        fontSize={14}
                                        fontFamily="medium"
                                        textColor={'#8F93A0'}
                                        style={{}}
                                    />
                                </View>
                                <View style={[styles.row, { marginBottom: 10 }]}>
                                    <MyText
                                        text={`Shipping Cost`}
                                        fontSize={14}
                                        fontFamily="medium"
                                        textColor={'#8F93A0'}
                                        style={{}}
                                    />
                                    <MyText
                                        text={'$' + (Number(cartListData?.data?.shippingPrice)?.toFixed(2) || 0)}
                                        fontSize={14}
                                        fontFamily="medium"
                                        textColor={'#8F93A0'}
                                        style={{}}
                                    />
                                </View>
                                <View style={[styles.row, { marginBottom: 19 }]}>
                                    <MyText
                                        text={`Tax`}
                                        fontSize={14}
                                        fontFamily="medium"
                                        textColor={'#8F93A0'}
                                        style={{}}
                                    />
                                    <MyText
                                        // text={`$${Number(cartListData?.discount).toFixed(2)}`}
                                        text={Number(cartListData?.data?.tax)?.toFixed(2) ? ('$' + Number(cartListData?.data?.tax)?.toFixed(2)) : ('$' + 0)}
                                        fontSize={14}
                                        fontFamily="medium"
                                        textColor={'#8F93A0'}
                                        style={{}}
                                    />
                                </View>
                                {/* <View style={[styles.row, { marginBottom: 19 }]}>
                    <MyText
                      text={`Shipping`}
                      fontSize={14}
                      fontFamily="medium"
                      textColor={'#455A64'}
                      style={{}}
                    />
                    <MyText
                      text={`$${Number(cartListData?.shipping).toFixed(2)}`}
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
                                        // text={`$${Number(cartListData?.total).toFixed(2)}`}
                                        text={Number(cartListData?.data?.totalPrice)?.toFixed(2) ? ('$' + Number(cartListData?.data?.totalPrice)?.toFixed(2)) : ('$' + 0)}
                                        fontSize={18}
                                        fontFamily="medium"
                                        textColor={'#455A64'}
                                        style={{}}
                                    />
                                </View>
                            </View>
                            <MyButton
                                text={'Proceed to payment'}
                                style={{
                                    width: responsiveWidth(95),
                                    marginBottom: 10,
                                    backgroundColor: Colors.THEME_BROWN,
                                    marginTop: 32,
                                }}
                                onPress={gotoShippingScreen}
                            /></> : <MyButton
                            text={'Choose Shipping'}
                            style={{
                                width: width * 0.9,
                                marginBottom: 10,
                                backgroundColor: Colors.THEME_BROWN,
                                marginTop: 32,
                            }}
                            onPress={gotoShippingScreen}
                        />)}
                    </ScrollView>
                </View>
            </View>
            {isModalVisible && <ShippingModal onSelect={getCartList} modalHandler={modalHandler} data={cartListData?.data?.items} currentProductId={modalProductId} selectedShippingService={selectedShippingService} selectedProductShippingIdHandler={selectedProductShippingIdHandler} />}
            <CustomLoader showLoader={loader} />
        </>
    );
};

export default Shipping;


const styless = StyleSheet.create({
    flatListContainer: {
        alignItems: 'center',
        width: responsiveWidth(100),
        height: responsiveHeight(90),
    },
});