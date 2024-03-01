import { StyleSheet } from 'react-native';
import { responsiveHeight as hg, responsiveWidth as wd, responsiveFontSize as fs } from 'react-native-responsive-dimensions';
import { Colors } from '../../global/Index';

export const styles = StyleSheet.create({
    safeareaview: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.9)',
    },
    animatedContainer: {
        position: 'absolute',
        bottom: -hg(51),
        left: 0,
        right: 0,
        height: hg(50),
        paddingTop: hg(1),
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: wd(8),
        borderTopRightRadius: wd(8),
    },
    img:{
        height: hg(12),
        width: hg(12),
    },
    heading: {
        marginTop: hg(1),
        color: Colors.THEME_GOLD,
        fontSize: fs(2.6),
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: wd(5),
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wd(15),
        alignItems: 'center',
        marginTop: hg(3),
        width: '100%',
    },
    btnStyle: {
        width: wd(30),
    },
    myBtn: {
        backgroundColor: Colors.THEME_BROWN,
    },
});