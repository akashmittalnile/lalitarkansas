import {Colors, Constant} from 'global/Index';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 5,
    // marginBottom: 10,
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
    fontSize: 14,
    color: '#8F93A0',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'black',
  },
  itemTextStyle: {
    fontSize: 14,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
    marginTop: 8,
    // marginRight: 12,
    marginLeft: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#EFEFEF',
    borderRadius: 40,
  },
  textSelectedStyle: {
    marginRight: 5,
    // fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeIcon: {
    height: 15,
    width: 15,
    borderRadius: 15 / 2,
    marginLeft: 10,
  },
});
