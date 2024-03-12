import {StyleSheet} from 'react-native';
import {Colors, Constant, MyIcon, ScreenNames, Service} from 'global/Index';
import {width} from '../../../../../global/Constant';

export const styles = StyleSheet.create({
  settingsContainer: {
    backgroundColor: 'white',
    paddingTop: 13,
    paddingBottom: 40,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 29,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
