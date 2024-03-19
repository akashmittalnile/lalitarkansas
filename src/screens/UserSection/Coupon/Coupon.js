import { View, StyleSheet, TextInput, TouchableOpacity, Text ,ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import MyHeader from '../../../components/MyHeader/MyHeader';
import Discount from '../../../components/Discount/Discount';
import { Service, Colors, ScreenNames } from '../../../global/Index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveHeight as hg, responsiveFontSize, responsiveHeight, responsiveWidth as wd } from 'react-native-responsive-dimensions';
import MyText from '../../../components/MyText/MyText';
import BackBtn from '../../../components/Button/BackBtn';
import Toast from 'react-native-toast-message';
 

const Coupon = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const [allCoupons, setAllCoupons] = useState([]);
    const [promoCode, setPromoCode] = useState(null);
    const [selectedPromo, setSelectedPromo] = useState({ applied: false, item: {} });

    useEffect(() => {
        allCouponsRender();
        if (params.coupon.applied) {
            setSelectedPromo((preData) => ({
                applied: true,
                item: { ...preData.item, code: params.coupon.item.code },
            }));
        }
    }, [params]);

    const allCouponsRender = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const response = await Service.getApiWithToken(userToken, Service.ALL_COUPON);
            console.log('all coupons res', response?.data);
            setAllCoupons(response?.data?.data);
        } catch (err) {
            console.log('coupon err', err.message);
        }
    };

    const onSelectCoupon = async (item) => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (item.code !== selectedPromo?.item?.code) {
                if (selectedPromo.applied) {
                    const response = await Service.postApiWithToken(userToken, Service.REMOVE_APPLIED_COUPON, { code: selectedPromo.item.code });
                    if (response?.data.status) {
                        const resp = await Service.postApiWithToken(userToken, Service.COUPON_APPLIED, { code: item.code });
                        if (resp?.data?.status) {
                            setSelectedPromo({ applied: true, item });
                            // navigation.navigate(ScreenNames.CART, { coupon: { applied: true, item } });
                            navigation.navigate(ScreenNames.SHIPPING, { promoCode: item.code });
                        }
                    }
                }
                else {
                    const resp = await Service.postApiWithToken(userToken, Service.COUPON_APPLIED, { code: item.code });
                    if (resp?.data?.status) {
                        setSelectedPromo({ applied: true, item });
                        // navigation.navigate(ScreenNames.CART, { coupon: { applied: true, item } });
                        navigation.navigate(ScreenNames.SHIPPING, { promoCode: item.code });
                    }
                }
            }
        } catch (err) {
            console.log('promocode err', err.message);
        }
    };

    const userEnteredCouponCodeHandler = async () => {
        try {
            if (!promoCode) {
                Toast.show({
                    type: 'info',
                    text1: 'Please enter the promocode',
                });
                return;
            }
            const userToken = await AsyncStorage.getItem('userToken');
            if (selectedPromo.applied) {
                const response = await Service.postApiWithToken(userToken, Service.REMOVE_APPLIED_COUPON, { code: selectedPromo.item.code });
                if (response?.data.status) {
                    const resp = await Service.postApiWithToken(userToken, Service.COUPON_APPLIED, { code: promoCode });
                    if (resp?.data?.status) {
                        setSelectedPromo({ applied: true, item: { code: promoCode } });
                        // navigation.navigate(ScreenNames.CART, { coupon: { applied: true, item } });
                        navigation.navigate(ScreenNames.SHIPPING, { promoCode });
                    }
                    if (!resp?.data?.status) {
                        setSelectedPromo({ applied: false, item: { code: null } });
                        Toast.show({
                            type: 'error',
                            text1: 'Invalid promocode',
                        });
                    }
                }
            }
            else if (!selectedPromo.applied) {
                const response = await Service.postApiWithToken(userToken, Service.COUPON_APPLIED, { code: promoCode });
                if (response?.data?.status) {
                    setSelectedPromo({
                        applied: true,
                        item: { code: promoCode },
                    });
                    // navigation.navigate(ScreenNames.CART, { coupon: { applied: true, item: { code: promoCode } } });
                    navigation.navigate(ScreenNames.SHIPPING, { promoCode });
                }
                else if (!response?.data?.status) {
                    Toast.show({
                        type: 'error',
                        text1: 'Invalid promocode',
                    });
                }
            }
        } catch (err) {
            console.log('promocode err', err.message);
        }
    };

    console.log({ allCoupons })

    return (
        <View>
            <MyHeader isBackButton={true} IsCartIcon={false} IsNotificationIcon={false} Title="Coupon" />
            <View style={styles.couponsContainer} >
                <ScrollView style={styles.scrollview} contentContainerStyle={{ paddingBottom: hg(30) }} showsVerticalScrollIndicator={false}>
                    <View style={styles.applyCouponRow}>
                        <TextInput
                            value={promoCode}
                            placeholder="Promo Code"
                            placeholderTextColor="#C0C0C0"
                            onChangeText={value => setPromoCode(value)}
                            style={styles.promoInput}
                        />
                        <TouchableOpacity style={styles.applyButton} onPress={userEnteredCouponCodeHandler}>
                            <MyText
                                text={'Apply'}
                                fontFamily="regular"
                                fontSize={14}
                                textColor={Colors.THEME_GOLD}
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                    {allCoupons?.length > 0 ? allCoupons.map((item, index) => (
                        <Discount item={item} key={index} total={params.subTotal} onSelectCoupon={onSelectCoupon} applied={(item.code === selectedPromo?.item?.code)} />
                    )) : <Text style={{ fontSize: responsiveFontSize(2.5), textAlign: 'center', marginTop: responsiveHeight(15),color:'#000000' }}>
                        No Coupons Available</Text>}
                </ScrollView>
            </View>
        </View>
    );
};

export default Coupon;

const styles = StyleSheet.create({
    couponsContainer: {
        width: wd(100),
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: hg(8),
        backgroundColor: Colors.THEME_BROWN,
    },
    backBtnContainer: {
        position: 'absolute',
        top: hg(2.5),
        left: wd(4),
        width: wd(10),
    },
    heading: {
        textAlign: 'center',
        fontSize: responsiveFontSize(2.5),
        fontWeight: '500',
        color: 'white',
    },
    scrollview: {
        width: wd(95),
    },
    applyCouponRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 22,
        height: 50,
        marginBottom: hg(2),
    },
    promoInput: {
        height: 50,
        width: '70%',
        color: Colors.LIGHT_GREY,
        backgroundColor: 'white',
        paddingLeft: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.05,
        elevation: 2,
    },
    applyButton: {
        backgroundColor: Colors.THEME_BROWN,
        width: '30%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
