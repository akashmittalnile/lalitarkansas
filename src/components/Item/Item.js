import React from 'react';
import { View, Image, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MyText from '../MyText/MyText';
import { ScreenNames, Service } from '../../global/Index';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { Colors } from '../../global/Index';
import { styles } from '../../screens/UserSection/Cart/CartStyle';
import { width } from '../../global/Constant';
import deliveryTruckIcon from ".././../assets/images/delivery-truck.png"
import couponIcon from '../../assets/images/coupon.png'
import rightArrowIcon from ".././../assets/images/right-arrow.png"
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCartCount, setUserNotifications } from '../../reduxToolkit/reducer/user';
import { CommonActions } from '@react-navigation/native';


const Item = ({ item, type = 1, onChangeQuantity = () => { }, coupon = { applied: null }, shownShippingBtn = false, shippingBtn = () => { }, containerStyle = {}, shippingDetails = [], disabledBtn = false }) => {
    const userToken = useSelector(state => state.user.userToken);
    const deliveryTruckIconPath = Image.resolveAssetSource(deliveryTruckIcon).uri;
    const couponIconPath = Image.resolveAssetSource(couponIcon).uri;
    const rightArrowIconPath = Image.resolveAssetSource(rightArrowIcon).uri;
    const [isShippingSelected, setIsShippingSelected] = React.useState(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    React.useEffect(() => {
        shippingDetailsHandler();
    }, [shippingDetails]);

    const shippingDetailsHandler = () => {
        if (type === 2) {
            const _shippingDetails = shippingDetails.filter(detail => detail.product_id === item.product_id);
            setIsShippingSelected(_shippingDetails[0]);
        } else {
            const _shippingDetails = shippingDetails.filter(detail => detail?.item?.productId === item.product_id);
            setIsShippingSelected(_shippingDetails[0]);
        }
    };
    const changeQuantity = async (item, change) => {
        if (type === 1) {
            const postData = new FormData();
            postData.append('course_id', item.product_id);
            try {
                const response = await Service.postApiWithToken(
                    userToken,
                    Service.REMOVE_CART_COURSE,
                    postData,
                );
                if (response?.data?.status) {
                    Toast.show({
                        text1: 'Item removed',
                    });
                    const result = await Service.getApiWithToken(userToken, Service.CART_COUNT);
                    if (result?.data?.data === 0) {
                        navigation.navigate(ScreenNames.HOME);
                    }
                    onChangeQuantity();
                }
            } catch (err) {
                console.log('remove course', err.message);
            }
            return;
        }
        const oldQuantity = Number(item?.quantity);
        const isRemoveProduct = oldQuantity === 1 && change === 'minus';
        if (isRemoveProduct) {
            removeFromCart(item?.product_id);
        } else {
            updateQuantity(item, change);
        }
    };

    const removeFromCart = async id => {
        const postData = new FormData();
        postData.append('product_id', id);
        try {
            const resp = await Service.postApiWithToken(
                userToken,
                Service.REMOVE_CART,
                postData,
            );
            if (resp?.data?.status) {
                Toast.show({
                    text1: 'Item removed',
                });
                if (coupon.applied) {
                    await Service.postApiWithToken(userToken, Service.REMOVE_APPLIED_COUPON, {});
                }
                await getCartCount();
                // Toast.show({ text1: "resp?.data?.message" });
                onChangeQuantity();
            } else {
                Toast.show({ text1: resp?.data?.message });
            }
        } catch (error) {
            console.log('error in removeFromCart', error);
        }
    };

    const updateQuantity = async (item, change) => {
        const oldQuantity = Number(item?.quantity);
        const newQuantity = change === 'minus' ? oldQuantity - 1 : oldQuantity + 1;
        const postData = new FormData();
        postData.append('product_id', item?.product_id);
        postData.append('quantity', newQuantity);
        try {
            const resp = await Service.postApiWithToken(
                userToken,
                Service.UPDATE_PRODUCT_QUANTITY,
                postData,
            );
            console.log('updateQuantity resp', resp?.data);
            if (resp?.data?.status) {
                if (coupon.applied) {
                    await Service.postApiWithToken(userToken, Service.REMOVE_APPLIED_COUPON, {});
                }
                onChangeQuantity();
            } else {
                Toast.show({ text1: resp?.data?.message });
            }
        } catch (error) {
            console.log('error in updateQuantity', error);
        }
    };

    const shippingBtnHandler = () => {
        shippingBtn();
    };

    const getCartCount = async () => {
        try {
            const resp = await Service.getApiWithToken(userToken, Service.CART_COUNT);
            console.log('getCartCount resp', resp?.data);
            if (resp?.data?.status) {
                dispatch(setCartCount(resp?.data?.data));
                await AsyncStorage.setItem(
                    'cart_count',
                    JSON.stringify(resp?.data?.data),
                );
                dispatch(setUserNotifications(resp?.data?.notification));
                await AsyncStorage.setItem(
                    'userNotifications',
                    JSON.stringify(resp?.data?.notification),
                );
                if (resp?.data?.data === 0) {
                    navigation.navigate(ScreenNames.HOME);
                    navigation.dispatch(resetIndexGoToBottomTab);
                }
            } else {
                Toast.show({ text1: resp.data.message });
            }
        } catch (error) {
            console.log('error in getCartCount', error);
        }
    };
    const resetIndexGoToBottomTab = CommonActions.reset({
        index: 1,
        routes: [{ name: ScreenNames.BOTTOM_TAB }],
    });
    return (
        <View style={[styles.courseContainer, { flexDirection: 'column', }, { padding: 0 }, containerStyle]}>
            <View style={[{ borderRadius: 0, flexDirection: 'row', }, { padding: 10 }]}>
                <ImageBackground
                    source={{
                        uri:
                            type === 1
                                ? // ? item?.content_creator_image
                                item?.thumb?.path : item.image
                        // : item.Product_image[0],
                    }}
                    style={styles.crseImg} />
                <View style={{ marginLeft: 11, width: width * 0.42 }}>
                    <MyText
                        text={item.name}
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
                        <View style={[styles.crtrRow, { width: '70%', }]}>
                            {type === 2 ? (
                                <Image
                                    source={{ uri: item?.content_creator_image }}
                                    style={styles.createImgStyle}
                                    resizeMode='contain'
                                />
                            ) : null}
                            <MyText
                                text={
                                    item.content_creator_name
                                }
                                // text={
                                //     type === 1 ? item?.category_name : item.content_creator_name
                                // }
                                fontFamily="regular"
                                fontSize={13}
                                numberOfLines={3}
                                textColor={Colors.THEME_GOLD}
                                letterSpacing={0.13}
                                style={{ marginLeft: 6, }}
                            />
                        </View>
                    </View>
                    <View style={styles.bottomRow}>
                        <MyText
                            text={'$' + item.total_amount}
                            fontFamily="bold"
                            fontSize={14}
                            textColor={Colors.THEME_GOLD}
                            letterSpacing={0.14}
                            style={{}}
                        />
                        {/* <View style={styles.iconsRow}>
              <Image source={require('assets/images/heart-selected.png')} />
              <Image
                source={require('assets/images/share.png')}
                style={{marginLeft: 10
              />
            </View> */}
                    </View>
                    <View style={styles.quantityRow}>
                        {/* {!disabledBtn && <TouchableOpacity
                                onPress={() => {
                                    changeQuantity(item, 'minus');
                                }}>
                                <Image source={require('assets/images/minus.png')} />
                            </TouchableOpacity>} */}
                        {type === 2 && <View style={styles.quantityView}>
                            <MyText
                                text={item?.quantity}
                                fontFamily="regular"
                                fontSize={12}
                                textColor={'black'}
                                style={{}}
                            />
                        </View>}
                        <View style={{ height: '100%', width: responsiveWidth(10) }}>
                            <TouchableOpacity
                                onPress={() => {
                                    changeQuantity(item, 'minus');
                                }}>
                                <Image source={require('assets/images/trash.png')} />
                            </TouchableOpacity>
                        </View>
                        {/* {!disabledBtn && <TouchableOpacity
                                onPress={() => {
                                    changeQuantity(item, 'add');
                                }}>
                                <Image source={require('assets/images/add.png')} />
                            </TouchableOpacity>} */}
                    </View>
                </View>
            </View>
            {shownShippingBtn && <View style={{ backgroundColor: "rgba(224, 178, 32, 0.2)", width: '100%', borderBottomRightRadius: 10, borderBottomLeftRadius: 10, padding: responsiveHeight(.5) }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.5} onPress={shippingBtnHandler}>
                    {!isShippingSelected ? <>
                        <Image source={{ uri: (type === 1 ? couponIconPath : deliveryTruckIconPath) }} style={{ height: responsiveHeight(5), width: '15%', }} resizeMode="contain" />
                        <Text style={{ width: '70%', color: Colors.LIGHT_GREY }}>{type === 1 ? '   Select Coupon' : 'Choose Shipping'}</Text>
                        <Image source={{ uri: rightArrowIconPath }} style={{ height: responsiveWidth(4), width: '15%' }} resizeMode="contain" />
                    </> : <View>
                        {type === 2 ? <Text style={{ fontWeight: '500', paddingLeft: responsiveWidth(1), color: Colors.LIGHT_GREY, }}>
                            {`Name: ${isShippingSelected?.name} \nPrice: $${Number(isShippingSelected?.price).toFixed(2)}`}
                        </Text> :
                            <Text style={{ fontWeight: '500', paddingLeft: responsiveWidth(1), color: Colors.LIGHT_GREY }}>
                                {`Coupon code: ${isShippingSelected?.item.code} \nDiscounted price: -$${item?.coupon_discount}`}
                            </Text>}
                    </View>}
                </TouchableOpacity>
            </View>}
        </View>
    );
};


export default Item;
