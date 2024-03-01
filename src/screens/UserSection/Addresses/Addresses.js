/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
// import BackBtn from '../../../components/Button/BackBtn';
// import MyHeader from '../../../components/MyHeader/MyHeader';
import EditAddress from '../../../components/Address/EditAddress';
import { responsiveHeight as hg, responsiveWidth as wd } from 'react-native-responsive-dimensions';
import { Colors } from '../../../global/Index';
import BackBtn from '../../../components/Button/BackBtn';
import { ScreenNames } from '../../../global/Index';
import { Service } from '../../../global/Index';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../../components/CustomLoader/CustomLoader';


const Addresses = () => {
    const navigation = useNavigation();
    const focused = useIsFocused();
    const [addresses, setAddresses] = React.useState({});
    const [billingAddress, setBillingAddress] = React.useState({});
    const [loader, setLoader] = React.useState(false);
    const userToken = useSelector(state => state?.user?.userToken);

    React.useEffect(() => {
        getAddresses();
    }, [focused]);

    const getAddresses = async () => {
        try {
            setLoader(true);
            const response = await Service.getApiWithToken(userToken, Service.CART_LIST);
            if (response.data.status) {
                setAddresses(response?.data);
                if (response.data?.billing) {
                    setBillingAddress(response.data.billing);
                }
            }
            else if (!response?.data?.status) {
                setAddresses([]);
            }
        } catch (err) {
            console.log('addresses err', err.message);
        } finally {
            setLoader(false);
        }
    };

    const addNewAddressHandler = () => {
        navigation.navigate(ScreenNames.ADD_ADDRESS);
    };

    const deleteAddressHandler = async (id) => {
        try {
            setLoader(true);
            const response = await Service.deleteApi(userToken, Service.DELETE_ADDRESS, id);
            if (response.data.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Address deleted successfully.',
                });
                getAddresses();
            }
        } catch (err) {
            console.log('delete address err', err.message);
        } finally {
            setLoader(false);
        }
    };
console.log({billingAddress})
    return (
        <>
            <View style={styles.container}>
                {/* <MyHeader Title="" isBackButton /> */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hg(10) }}>
                    <View style={styles.header}>
                        <View style={styles.backBtnContainer}>
                            <BackBtn toNavigate={ScreenNames.CART} />
                        </View>
                        {/* <View style={{ alignItems: 'center' }}>
                        <Pressable style={styles.cartPress}>
                            <Image source={{ uri: iconPath }} resizeMode="contain" style={styles.icon} />
                        </Pressable>
                    </View> */}
                    </View>
                    <View style={styles.subContainer}>
                        {addresses?.address?.length > 0 && addresses?.address?.map((item, index) => (
                            <View key={index} style={styles.addressContainer}>
                                <EditAddress address={item} deleteAddress={deleteAddressHandler} billingAddress={billingAddress} isAddressSelected={item.id === addresses?.data?.shippingAddressId?.address_id ? true : false} />
                            </View>
                        ))}
                        <View style={styles.addAddressBtn}>
                            <TouchableOpacity style={styles.press} onPress={addNewAddressHandler}>
                                <Text style={styles.addressTxtBtn}>Add Address</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <CustomLoader showLoader={loader} />
        </>
    );
};

export default Addresses;

const styles = StyleSheet.create({
    container: {
        height: hg(100),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'start',
        paddingHorizontal: wd(3),
        paddingVertical: hg(2),
        paddingBottom: hg(2),
        // height: hg(10),
        backgroundColor: Colors.THEME_BROWN,
    },
    backBtnContainer: {
        width: wd(10),
    },
    subContainer: {
        marginTop: hg(2),
        width: wd(100),
        alignItems: 'center',
    },
    addressContainer: {
        width: wd(90),
        marginVertical: hg(1),
    },
    addAddressBtn: {
        marginTop: hg(4),
        width: wd(90),
        height: hg(7),
        borderRadius: wd(2),
        backgroundColor: Colors.THEME_BROWN,
    },
    press: {
        justifyContent: 'center',
        alignItems: '',
        height: '100%',
    },
    addressTxtBtn: {
        textAlign: 'center',
        fontWeight: '500',
        color: Colors.THEME_GOLD,
    },
    cartPress: {
        height: hg(3),
        width: hg(4),
    },
    icon: {
        height: '100%',
    },
});
