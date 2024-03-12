import {Colors} from 'global/Index';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    // paddingBottom: 63,
    backgroundColor: Colors.THEME_BROWN,
  },
  container2: {
    paddingBottom: 83,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personImg: {
    height: 43,
    width: 43,
    borderRadius: 43 / 2,
    borderWidth: 2,
    borderColor: 'white',
  },
  numNotiView: {
    position: 'absolute',
    // top: -10,
    // right: -5,
    top: -2,
    right: 0,
    height: 15,
    width: 15,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fe0000',
    borderRadius: 100,

    backgroundColor: Colors.THEME_GOLD,
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
  },
  cartNumView: {
    position: 'absolute',
    // top: -10,
    // right: -5,
    top: -2,
    right: 0,
    height: 15,
    width: 15,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fe0000',
    borderRadius: 100,

    backgroundColor: Colors.THEME_GOLD,
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
  },
});
