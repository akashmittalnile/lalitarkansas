import {StyleSheet} from 'react-native';
import {Colors, Constant, MyIcon, ScreenNames, Service} from 'global/Index';
import {width} from '../../../../../global/Constant';

export const styles = StyleSheet.create({
  courseContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 11,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  courseSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crseImg: {
    height: 99,
    width: width * 0.33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crtrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: Colors.THEME_BROWN,
  },
  courseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  tickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
});
