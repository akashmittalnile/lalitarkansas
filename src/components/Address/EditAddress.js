/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { responsiveWidth as wd, responsiveHeight as hg, responsiveFontSize } from 'react-native-responsive-dimensions';
import { Colors, Service, ScreenNames } from '../../global/Index';
import editIcon from '../../assets/images/edit.png';
import deleteIcon from '../../assets/images/delete.png';
import Toast from 'react-native-toast-message';

const EditAddress = ({ address, deleteAddress, containerStyle = {}, billingAddress = {}, isAddressSelected = false }) => {
    const navigation = useNavigation();
    const editIconPath = Image.resolveAssetSource(editIcon).uri;
    const deleteIconPath = Image.resolveAssetSource(deleteIcon).uri;
    const userToken = useSelector(state => state.user.userToken);

    const editAddressHandler = () => {
        console.log("address_id", address.id);
        navigation.navigate(ScreenNames.ADD_ADDRESS, { address_id: address.id });
    };

    const selectAddress = async () => {
        if (isAddressSelected) {
            Toast.show({
                type: 'info',
                text1: 'Already selected choose another one.',
            });
            return;
        }
        try {
            const response = await Service.postApiWithToken(userToken, Service.SHIPPING_ADDRESS, { address_id: address?.id });
            if (response.data.status) {
                navigation.navigate(ScreenNames.CART);
            }
        } catch (err) {
            console.log('edit addresss', err.message);
        }
    };
    // console.log({isAddressSelected})
    return (
        <View style={[styles.container, containerStyle]}>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.address}>
                        {`${address.first_name} ${address.last_name}`}
                    </Text>
                    {/* {isAddressSelected && <Text style={{ color: Colors.THEME_GOLD }}>Selected</Text>} */}
                </View>
                <Text style={styles.addressDes}>{`${address.address_line_1}, ${address.address_line_2 ? (address.address_line_2 + ', ') : ''} ${address.city}, ${address.state}, ${address.country}`}</Text>
            </View>
            <View style={styles.btnsContainer}>
                <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity style={styles.touch} onPress={editAddressHandler}>
                            <Image source={{ uri: editIconPath }} style={styles.icon} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity style={styles.touch} onPress={() => { deleteAddress(address.id) }}>
                            <Image source={{ uri: deleteIconPath }} style={styles.icon} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 2 }}>
                    <View style={styles.txtBtnContainer}>
                        <View style={styles.txtBtn}>
                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }} onPress={selectAddress}>
                                <Text style={{ color: Colors.THEME_GOLD, fontSize: hg(1.4) }}>
                                    {!isAddressSelected ? 'Select this Address' : 'Selected'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default EditAddress;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wd(3),
        paddingVertical: wd(3),
        width: '100%',
        borderRadius: wd(2),
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.05,
        elevation: 2,
    },
    address: {
        marginBottom: hg(0.5),
        color: Colors.BLACK,
        fontSize: responsiveFontSize(2),
        fontWeight: '600',
    },
    addressDes: {
        color: Colors.LIGHT_GREY,
        fontSize: responsiveFontSize(1.5),
        fontWeight: '500',
    },
    btnsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hg(1),
    },
    iconContainer: {
        height: hg(6),
        width: '40%',
    },
    touch: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '40%',
    },
    icon: {
        height: '50%',
        width: '100%',
    },
    txtBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: hg(6),
    },
    txtBtn: {
        backgroundColor: Colors.THEME_BROWN,
        alignSelf: 'flex-start',
        height: '70%',
        width: '70%',
        borderRadius: hg(0.7),
    },
});

