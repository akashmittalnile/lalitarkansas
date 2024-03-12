import { Colors, Constant } from 'global/Index';
import { Platform, StyleSheet } from 'react-native';
import { width } from '../../../global/Constant';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SCREEN_BG,
  },
  mainView: {
    paddingHorizontal: 20,
    paddingTop: 0,
    // marginTop: -30,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  tab: {
    width: '48%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    paddingVertical: 14,
  },
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
    width: '80%',
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
  createImgStyle: {
    height: 13,
    width: 13,
    borderRadius: 13 / 2,
  },
});
