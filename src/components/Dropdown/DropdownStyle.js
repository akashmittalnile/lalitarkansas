import { Colors, Constant } from 'global/Index';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
      },
      dropdown: {
        height: 50,
        // borderColor: 'gray',
        // borderWidth: 0.5,
        // borderRadius: 8,
        paddingHorizontal: 20,
        // height: 50,

        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom:20,
        backgroundColor:'white'
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        // fontSize: 16,

        fontSize: 14,
        color: '#8F93A0',
        fontWeight: '400'
      },
      selectedTextStyle: {
        // fontSize: 16,
        fontSize: 14,
        color: '#353334',
        fontWeight: '400'
      },
      itemTextStyle: {
        // fontSize: 16,
        fontSize: 14,
        color: '#353334',
        fontWeight: '400'
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
})