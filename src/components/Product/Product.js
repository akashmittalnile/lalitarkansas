/* eslint-disable react-native/no-inline-styles */
import { View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { width } from '../../global/Constant';
import MyText from '../MyText/MyText';
import { styles } from '../../screens/UserSection/Home/HomeStyle';
import { Colors, ScreenNames } from '../../global/Index';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import MyButton from '../MyButton/MyButton';
import { Service } from '../../global/Index';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCartCount } from '../../reduxToolkit/reducer/user';

const Product = ({ item, showLoader = null, setShowLoader = null, setShowCourseTypeModal = null, onChangeHandler = () => { }, addToCartObject }) => {
    const userToken = useSelector(state => state.user.userToken);
    const navigation = useNavigation();
    const dispatch = useDispatch();

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
                // getHomeData();
                onChangeHandler();
            } else {
                Toast.show({ text1: resp.data.message });
            }
        } catch (error) {
            console.log('error in onLike', error);
        }
        showLoader && setShowLoader(false);
    };

    const gotoProductDetails = (id, type) => {
        navigation.navigate(ScreenNames.PRODUCT_DETAILS, { id, type });
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
                dispatch(setCartCount(resp?.data?.cart_count));
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

    return (
        <TouchableOpacity
            onPress={() => gotoProductDetails(item?.id, '2')}
            style={[styles.productContainer, { height: responsiveHeight(26) }]}>
            <View>
                {item.Product_image[0] ? (
                    <Image
                        source={{ uri: item.Product_image[0] }}
                        style={{ width: (width - 40) * 0.42, height: 136 }}
                    />
                ) : null}
                <TouchableOpacity
                    onPress={() => {
                        onLike('2', item.id, item?.isWishlist);
                    }}
                    style={styles.heartIcon}>
                    <Image
                        source={
                            item?.isWishlist
                                ? require('assets/images/heart-selected.png')
                                : require('assets/images/heart-yellow-outline.png')
                        }
                    />
                </TouchableOpacity>
                <View style={styles.starView}>
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
            </View>
            <View style={styles.bottomView}>
                <MyText
                    text={item.title}
                    numberOfLines={1}
                    fontFamily="regular"
                    fontSize={13}
                    textColor={Colors.LIGHT_GREY}
                    style={{}}
                />
                <View style={{ flexDirection: 'row' }}>
                    <MyText
                        text={'$' + item.price}
                        fontFamily="bold"
                        fontSize={14}
                        textColor={Colors.THEME_GOLD}
                        letterSpacing={0.14}
                        style={{ textDecorationLine: (item.sale_price !== item.price) ? 'line-through' : 'none', }}
                    />
                    {item.sale_price !== item.price && <MyText
                        text={'$' + item.sale_price}
                        fontFamily="bold"
                        fontSize={14}
                        textColor={Colors.THEME_GOLD}
                        letterSpacing={0.14}
                        style={{ marginLeft: responsiveWidth(2) }}
                    />}
                </View>
                <View style={[styles.productButtonsRow, { justifyContent: item.in_stock ? 'space-between' : 'center' }]}>
                    <MyButton
                        text={item.in_stock ? 'Buy Now' : 'Out of stock'}
                        style={{
                            width: item.in_stock ? '70%' : '80%',
                            height: 30,
                            backgroundColor: Colors.THEME_BROWN,
                        }}
                        disabled={item.in_stock ? false : true}
                        onPress={() => {
                            addToCart(item.id, '2', item.price);
                        }}
                    />
                    {item.in_stock && <TouchableOpacity
                        activeOpacity={!item.in_stock ? 1 : 0.5}
                        onPress={() => {
                            item.in_stock ? addToCart(item.id, '2', item.price) : () => { };
                        }}
                        style={styles.prodCartView}>
                        <Image
                            source={require('assets/images/shopping-bag.png')}
                            style={{ height: 18, width: 18 }}
                        />
                    </TouchableOpacity>}
                </View>
                {(item.alert && item.in_stock) && <MyText
                    text={item.alert}
                    // fontFamily="bold"
                    fontSize={14}
                    textColor={'red'}
                    letterSpacing={0.14}
                    style={{ marginTop: responsiveHeight(0.5) }}
                />}
            </View>
        </TouchableOpacity >
    )
}

export default Product;