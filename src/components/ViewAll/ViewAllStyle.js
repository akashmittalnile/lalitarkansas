import {Colors, Constant} from 'global/Index';
import {Platform, StyleSheet} from 'react-native';
import {height, width} from '../../../global/Constant';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAll: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: Colors.THEME_BROWN,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
