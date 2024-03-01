import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import React from 'react';
import checkIcon from '../../assets/images/check.png';
import { responsiveHeight as hg } from 'react-native-responsive-dimensions';

const Check = ({ style = {}, onChangeCheckValue = () => { } , value}) => {
    const checkPath = Image.resolveAssetSource(checkIcon).uri;
    const [isChecked, setIsChecked] = React.useState(false);

    React.useEffect(() => {
        if (value) {
            setIsChecked(value);
        }
    }, [value]);

    const checkHandler = () => {
        onChangeCheckValue(!isChecked);
        setIsChecked(preChecked => (!preChecked));
    };
    console.log({ value})
    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={checkHandler}>
                {isChecked ? <Image source={{ uri: checkPath }} resizeMode="contain" style={styles.icon} /> : <View style={styles.empty}></View>}
            </TouchableOpacity>
        </View>
    )
}

export default Check;

const styles = StyleSheet.create({
    container: {
        height: hg(3.5),
        width: hg(3.5),
        borderRadius: hg(1),
        borderWidth: hg(0.2),
        borderColor: 'gray',
        overflow: 'hidden',
    },
    touch: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    icon: {
        height: '100%',
        width: '100%',
    },
    empty: {
        height: '100%',
        width: '100%',
    },
});