import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import ChooseShipping from '../../components/ChooseShipping/ChooseShipping';
import { Service } from '../../global/Index';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../components/CustomLoader/CustomLoader';
import MyText from '../../components/MyText/MyText';

const ShippingModal = ({ modalHandler = () => { }, onSelect = () => { }, data = [], currentProductId = null, selectedShippingService = [], selectedProductShippingIdHandler = () => { }, type = 2, loader = false }) => {
    // const [chooseShipping, setChooseShipping] = useState({
    //     product_id: null,
    //     service_code: '',
    //     shipping_price: null,
    //     shipping_id: null,
    // });
    const [shippingCostRateListArr, setShippingCostRateListArr] = useState([]);
    const translateY = useSharedValue(responsiveHeight(0));
    const opacityStyle = useSharedValue(0);
    const userToken = useSelector(state => (state.user.userToken));
    // const [loader, setLoader] = useState(false);
    const [flatListData, setFlatlistData] = useState([]);
    const [coupon, setCoupon] = useState({
        applied: false,
        item: null,
    });

    useEffect(() => {
        startTranslateYanimation(-responsiveHeight(70));
        startOpacityanimation(1);
        flatlistDataHandler();
        appliedCouponHandler();
    }, [data]);

    const animatedYStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const animatedOpacity = useAnimatedStyle(() => ({
        opacity: opacityStyle.value,
    }));

    const startTranslateYanimation = (Y) => {
        translateY.value = withTiming(Y, {
            duration: 500,
        });
    };

    const startOpacityanimation = (value) => {
        opacityStyle.value = withTiming(value, {
            duration: 500,
        });
    };

    const shippingCostHandler = async (value, product_id) => {
        try {
            // setLoader(true);
            if (type === 2) {
                const postData = { product_id, service_code: value.service_code, shipping_price: value.price, carrier_id: value.carrier_id };
                const response = await Service.postApiWithToken(userToken, Service.CHOOSE_SHIPPING_OPTION, postData);
                if (response?.data?.status) {
                    selectedProductShippingIdHandler(value, product_id);
                    onSelect();
                    return;
                    // disableModal();
                }
                else if (!response?.data?.status) {
                    Toast.show({
                        type: 'error',
                        text1: 'Something went wrong',
                    });
                }
            }
            else {
                if (!coupon.applied) {
                    const response = await Service.postApiWithToken(userToken, Service.COUPON_APPLIED_COURSE, { code: value?.code, course_id: product_id });
                    if (response?.data?.status) {
                        setCoupon({ applied: true, item: { ...value, productId: product_id } });
                        onSelect();
                        modalHandler();
                        return true;
                    }
                } else {
                    if (value.code === coupon?.item?.code) {
                        const response = await Service.postApiWithToken(userToken, Service.REMOVE_APPLIED_COUPON_COURSE, { course_id: product_id });
                        if (response?.data?.status) {
                            setCoupon({ applied: false, item: null });
                            onSelect();
                            return true;
                        }
                    }
                    else {
                        const response = await Service.postApiWithToken(userToken, Service.REMOVE_APPLIED_COUPON_COURSE, { course_id: product_id });
                        if (response?.data?.status) {
                            const resp = await Service.postApiWithToken(userToken, Service.COUPON_APPLIED_COURSE, { code: value?.code, course_id: product_id });
                            if (resp?.data?.status) {
                                setCoupon({ applied: true, item: { ...value, productId: product_id } });
                                onSelect();
                                modalHandler();
                                return true;
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.log(`choose ${type === 2 ? 'shipping' : 'coupon'} option err`, err.message);
            return false;
        } finally {
            setTimeout(() => {
                // setLoader(false);
            }, 500);
        }
    };

    const flatlistDataHandler = () => {
        if (type === 1) {
            const tempShippingCostRateListArr = data.filter(item => item.product_id === currentProductId);
            setShippingCostRateListArr(tempShippingCostRateListArr);
            setFlatlistData(tempShippingCostRateListArr[0]?.coupons);
        } else {
            const tempShippingCostRateListArr = data.filter(item => item.product_id === currentProductId);
            setShippingCostRateListArr(tempShippingCostRateListArr);
            setFlatlistData(tempShippingCostRateListArr[0]?.compare_rate_list);
        }
    };


    const appliedCouponHandler = () => {
        const temp = data.filter(pro => pro.product_id === currentProductId);
        if (temp.length > 0) {
            if (temp[0].is_coupon_applied) {
                const temp2 = temp[0].coupons.filter(e => e.code === temp[0].coupon_code);
                setCoupon({
                    applied: true,
                    item: { ...temp2[0], productId: currentProductId },
                });
            }
        }
    };

    const disableModal = () => {
        startTranslateYanimation(responsiveHeight(0));
        startOpacityanimation(0);
        setTimeout(() => {
            modalHandler();
        }, 500);
    };
    const selectedShippingServiceFinder = selectedShippingService.filter(item => (item.product_id === currentProductId));

    const clickHandler = async (item) => {
        const resp = await shippingCostHandler(item, shippingCostRateListArr[0].product_id);
        return resp;
    };

    const renderItem = ({ item }) => (<ChooseShipping isSelected={type === 2 ? (item.service_code === selectedShippingServiceFinder[0]?.service_code ? true : false) : (item?.code === coupon?.item?.code ? true : false)} clickHandler={clickHandler} data={type === 2 ? item : { ...item, _coupon: coupon }} type={type} couponData={coupon} totalDiscount={data.filter(item => item.product_id === currentProductId)[0]?.coupon_discount} />);

    return (
        <>
            <SafeAreaView style={styles.safeareaview}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={disableModal}>
                        <Animated.View style={[styles.animatedView, animatedYStyle, animatedOpacity]}>
                            <Text style={styles.heading}>{type === 2 ? 'Choose Shipping' : 'Select Coupon'}</Text>
                            <View style={styles.sheepingChargeContainer}>
                                {flatListData?.length > 0 ? <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: responsiveHeight(10) }}
                                    data={flatListData}
                                    renderItem={renderItem}
                                    keyExtractor={(_, index) => index.toString()}
                                /> : <MyText text={`${type === 1 ? 'No coupons available' : 'No Shipping Found'}`} fontSize={responsiveFontSize(2.6)} textAlign="center" marginTop={responsiveHeight(10)} />}
                                {/* <ChooseShipping isSelected={true} clickHandler={shippingCostHandler}  /> */}
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {loader && <View style={styles.loader}>
                <CustomLoader showLoader={loader} /></View>}
        </>
    );
};

export default React.memo(ShippingModal);

const styles = StyleSheet.create({
    safeareaview: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.5)',
    },
    animatedView: {
        height: responsiveHeight(70),
        position: 'absolute',
        bottom: responsiveHeight(-72),
        left: 0,
        right: 0,
        zIndex: 1000,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: responsiveWidth(8),
        borderTopRightRadius: responsiveWidth(8),
    },
    heading: {
        marginTop: responsiveHeight(3),
        marginBottom: responsiveHeight(1),
        fontSize: responsiveFontSize(2),
        fontWeight: '700',
        textAlign: 'center',
    },
    sheepingChargeContainer: {
        width: responsiveWidth(90),
    },
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
    },
});