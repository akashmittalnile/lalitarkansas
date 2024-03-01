/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React from 'react';
import { responsiveWidth as wd, responsiveHeight as hg, responsiveFontSize } from 'react-native-responsive-dimensions';
import { Colors } from '../../global/Index';
import rightArrowIcon from '../../assets/images/right-arrow.png';

const Address = ({ address, containerStyle = {}, onPress = () => { } }) => {
    const rightIconPath = Image.resolveAssetSource(rightArrowIcon).uri;

    return (
        <View style={[styles.container, containerStyle]}>
            <Pressable style={styles.touch} android_ripple={{ color: '#D3D3D3' }} onPress={onPress}>
                <View style={{ flex: 4 }}>
                    <Text style={styles.address}>
                        {`${address?.first_name} ${address?.last_name}`}
                    </Text>
                    <Text style={styles.addressDes}>{`${address?.address_line_1}, ${address?.address_line_2 ? (address?.address_line_2 + ', ') : ''} ${address?.city}, ${address?.state}, ${address?.country}`}</Text>
                    {/* <Text style={styles.addressDes}>Sector 57, Noida, Uttar Pradesh, India</Text> */}
                </View>
                <View style={styles.iconContainer}>
                    <Image source={{ uri: rightIconPath }} style={styles.icon} resizeMode="contain" />
                </View>
            </Pressable>
        </View>
    )
}

export default Address;

const styles = StyleSheet.create({
    container: {
        marginVertical: hg(1),
        width: '100%',
        height: hg(8),
        borderRadius: wd(2),
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.05,
        overflow: 'hidden',
    },
    touch: {
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        paddingHorizontal: wd(2),
        paddingVertical: wd(2.5),
        overflow: 'hidden',
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
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    icon: {
        height: '50%',
        width: '100%',
    }
})

