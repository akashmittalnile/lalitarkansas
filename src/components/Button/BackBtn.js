/* eslint-disable prettier/prettier */
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import backArrowIcon from '../../assets/images/arrow-left-white.png';
import backArrowIconBlack from '../../assets/images/arrow-left-black.png';
import { responsiveHeight as hg } from 'react-native-responsive-dimensions';

const BackBtn = ({ arrowColor = 'white', toNavigate = null }) => {
    const navigation = useNavigation();
    const backArrowPath = Image.resolveAssetSource(backArrowIcon).uri;
    const backArrowBlackPath = Image.resolveAssetSource(backArrowIconBlack).uri;

    const navigationHandler = () => {
        if (toNavigate) {
            navigation.navigate(toNavigate);
        }
        else {
            navigation.goBack();
        }
    };
    return (
        <View>
            <TouchableOpacity onPress={navigationHandler} style={styles.touch} >
                <Image source={{ uri: arrowColor === 'white' ? backArrowPath : backArrowBlackPath }} resizeMode="contain" style={styles.icon} />
            </TouchableOpacity>
        </View>
    );
};

export default BackBtn;

const styles = StyleSheet.create({
    touch: {
        height: hg(3),
        width: '100%',
    },
    icon: {
        height: '100%',
        width: '100%',
    },
});