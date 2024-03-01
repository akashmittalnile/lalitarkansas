import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { Colors, Service } from '../../global/Index';
import { styles } from '../../screens/UserSection/Cart/CartStyle';
import BorderLessBtn from '../Button/BorderLessBtn';

const ChooseShipping = ({ data, clickHandler, isSelected = false, onClick, type = 2, couponData, totalDiscount }) => {

    const applyCouponHandler = async () => {
        try {
            const resp = await clickHandler(data);
            if (resp) {
                return;
            }
        } catch (err) {
            console.log('chooseShipping coupon applied err', err.message);
        }
    };

    const onClickHandler = async () => {
        clickHandler(data);
    };


    return (
        (type === 2 ? (
            <View>
                <TouchableOpacity style={[styless.shippingRateContainer, { borderColor: isSelected ? Colors.THEME_GOLD : 'gray' }]} activeOpacity={0.6} onPress={onClickHandler}>
                    <View style={styless.circleContainer} >
                        <View style={[styless.outerCircle, { borderColor: isSelected ? Colors.THEME_GOLD : 'gray' }]}>
                            <View style={[styless.innerCircle, { backgroundColor: isSelected ? Colors.THEME_GOLD : 'transparent' }]} />
                        </View>
                    </View>
                    <View>
                        <Text style={styless.title}>
                            {data.name}
                        </Text>
                        <Text style={styless.description} >
                            {data.service_code}
                        </Text>
                        <Text style={styless.price}>
                            {'$' + Number(data.price).toFixed(2)}
                        </Text>
                        <Text style={styless.description} >
                            {'Delivery date: ' + data.estimated_delivery_date}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        ) : (<>
            <View style={[styles.promocodeContainer, { marginBottom: responsiveHeight(3) }]}>
                <View style={styles.promoSubContainer}>
                    <View>
                        <View>
                            <Text style={[styles.txtSave, { color: Colors.LIGHT_GREY }]}>{isSelected ? `You saved $${couponData?.item?.discount_amount > 0 ? Number(totalDiscount)?.toFixed(2) : 0} with this code` : (data?.discount_type_name !== 'Percentage' ? `Save $${Number(data?.discount_amount)?.toFixed(2)} ` : `Save ${Number(data?.discount_amount)?.toFixed(0)}% ` + 'on this order')}</Text>
                        </View>
                        <View><Text style={[styles.txtCode, { color: Colors.LIGHT_GREY }]}>{`Code: ${data?.code}`}</Text></View>
                    </View>
                    <View>
                        <BorderLessBtn text={isSelected ? 'Remove' : 'Apply'} textStyle={styles.couponBtn} onPress={applyCouponHandler} />
                    </View>
                </View>
            </View>
        </>))
    );
}

export default ChooseShipping;

const styless = StyleSheet.create({
    shippingRateContainer: {
        flexDirection: 'row',
        marginVertical: responsiveHeight(1),
        height: responsiveHeight(17),
        overflow: 'hidden',
        paddingTop: responsiveHeight(1),
        paddingBottom: responsiveHeight(2),
        borderWidth: responsiveWidth(0.3),
        borderRadius: responsiveWidth(2),
    },
    circleContainer: {
        width: responsiveWidth(9),
        alignItems: 'center',
    },
    outerCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        width: responsiveWidth(6),
        height: responsiveWidth(6),
        borderWidth: responsiveWidth(0.5),
        borderRadius: responsiveWidth(4),
    },
    innerCircle: {
        width: responsiveWidth(3.2),
        height: responsiveWidth(3.2),
        borderRadius: responsiveWidth(4),
    },
    title: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: '500',
        color: Colors.LIGHT_GREY,
    },
    price: {
        fontSize: responsiveFontSize(1.8),
        color: Colors.LIGHT_GREY,
    },
    description: {
        marginTop: responsiveHeight(0.5),
        fontSize: responsiveFontSize(1.6),
        width: responsiveWidth(75),
        color: Colors.LIGHT_GREY,
    },
})