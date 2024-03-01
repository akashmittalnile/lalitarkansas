import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { responsiveHeight as hg, responsiveFontSize, responsiveWidth as wd } from 'react-native-responsive-dimensions';
import { Colors } from '../../global/Index';
import BorderLessBtn from '../Button/BorderLessBtn';

const Discount = ({ item, isApplyBtn = true, containerStyle = {}, total = 0, onSelectCoupon = () => { }, applied }) => {
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (total < item.min_order) {
            setDisabled(true);
        }
    }, []);
    // console.log({item})
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.txtContainer}>
                <Text style={[styles.textCoupon, disabled && styles.disabledTextCoupon]}>{item.code}</Text>
                <Text style={[styles.txtHeading, disabled && styles.disabledBtnTxt]}>{item.discount_type === 1 ? `Save $${item.discount_amount + ' on minimum order of' + ' ' + `\n$${item.min_order}`}` : `Save ${item.discount_amount + '%' + ' on minimum order of' + ' ' + `\n$${item.min_order}`}`}</Text>
                {/* <Text style={styles.txt}>{`${item.discount_type_name}  ${item.discount_type_name === 'Flat' ? '$' : ''}${item.discount_amount} off on minimum purchase of $ ${item.min_order}.`}</Text> */}
                <Text style={styles.txt}>{item.description}</Text>
                <Text style={styles.txt}>{`Expires on: ${item.expiry_date}.`}</Text>
            </View>
            <View>
                {isApplyBtn && <BorderLessBtn text={applied ? 'Remove' : 'Apply'} textStyle={[styles.btn, disabled && styles.disabledBtnTxt]} containerStyle={[styles.btnBorder, disabled && styles.disabledBtnBorder]} disabled={disabled} onPress={() => { onSelectCoupon(item); }} />}
            </View>
        </View>
    );
};


export default Discount;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: hg(1),
        paddingVertical: hg(2),
        paddingHorizontal: wd(4),
        width: '100%',
        backgroundColor: 'white',
        shadowColor: 'gray',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.05,
        elevation: 5,
        borderRadius: wd(2),
    },
    txtContainer: {
        paddingHorizontal: wd(3),
        maxWidth: '80%',
    },
    textCoupon: {
        marginBottom: hg(1),
        paddingHorizontal: wd(4),
        paddingVertical: hg(1),
        alignSelf: 'flex-start',
        color: 'black',
        fontSize: responsiveFontSize(2.1),
        fontWeight: '500',
        textAlign: 'center',
        borderWidth: wd(0.25),
        borderColor: Colors.THEME_GOLD,
        borderStyle: 'dashed',
    },
    disabledTextCoupon: {
        borderColor: 'gray',
        color: 'gray',
    },
    txtHeading: {
        color: 'black',
        fontSize: responsiveFontSize(1.9),
        fontWeight: '500',
    },
    btn: {
        color: Colors.THEME_GOLD,
        fontSize: responsiveFontSize(2),
    },
    btnBorder: {
        borderWidth: wd(0.25),
        borderColor: Colors.THEME_GOLD,
        paddingHorizontal: wd(3),
        paddingVertical: hg(1),
        borderRadius: wd(3),
    },
    txt: {
        marginTop: hg(0.5),
        color: 'gray',
        fontSize: responsiveFontSize(1.6),
        fontWeight: '500',
    },
    disabledBtnTxt: {
        color: 'gray',
    },
    disabledBtnBorder: {
        borderColor: 'gray',
    },
});


