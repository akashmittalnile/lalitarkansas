import { View, Text, SafeAreaView, Image } from 'react-native';
import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, runOnUI } from 'react-native-reanimated';
import { responsiveHeight as hg, responsiveFontSize } from 'react-native-responsive-dimensions';
import { styles } from "./CourseTypeModalStyle";
import MyButton from '../../components/MyButton/MyButton';
import prerequitsIcon from "../../assets/images/prereq-not-completed.png"
import Toast from 'react-native-toast-message';

const CourseTypeModal = ({ yesBtnHandler = () => { }, noBtnHandler = () => { }, type = 1 }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const prerequitsIconPath = Image.resolveAssetSource(prerequitsIcon).uri;

    React.useEffect(() => {
        startAnimation(-hg(45));
        startOpacity(1);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const animatedOpacity = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));


    const startAnimation = (value) => {
        translateY.value = withTiming(value, {
            duration: 500,
        });
    };

    const startOpacity = (value) => {
        opacity.value = withTiming(value, {
            duration: 500,
        });
    };

    function onClickYes() {
        'worklet';
        startAnimation(hg(50));
        setTimeout(() => {
            yesBtnHandler();
        }, 500);
        Toast.show({
            type: 'success',
            text1: 'Cart updated successfully.'
        })
    }

    function onClickNo() {
        'worklet';
        startAnimation(hg(50));
        setTimeout(() => {
            noBtnHandler();
        }, 500);
    }


    return (
        <SafeAreaView style={styles.safeareaview}>
            <View style={styles.container}>
                <Animated.View style={[styles.animatedContainer, animatedStyle, animatedOpacity]}>
                    <Image source={{ uri: prerequitsIconPath }} style={styles.img} resizeMode="contain" />
                    <Text style={styles.heading}>{`Are you sure you want to add the ${type === 1 ? 'course' : 'product'} to cart.`}</Text>
                    <Text style={[styles.heading, { color: 'black', fontWeight: '400', fontSize: responsiveFontSize(1.8), }]}>{`If you proceed the ${type === 1 ? 'product' : 'course'} in your cart will be deleted and will be replaced do you wish to continue?`}</Text>
                    <View style={styles.btnContainer}>
                        <View style={styles.btnStyle}>
                            <MyButton text="Ok, Got it" style={styles.myBtn} onPress={onClickYes} />
                        </View>
                        <View style={styles.btnStyle} >
                            <MyButton text="Cancel" style={styles.myBtn} onPress={onClickNo} />
                        </View>
                    </View>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

export default CourseTypeModal;
