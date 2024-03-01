import { Colors, Constant } from 'global/Index';
import { Platform, StyleSheet } from 'react-native';
import { width } from '../../../global/Constant';
import { responsiveFontSize, responsiveWidth as wd, responsiveHeight as hg, responsiveHeight } from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SCREEN_BG,
  },
  mainView: {
    padding: 20,
    paddingTop: 0,
    marginTop: -30,
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
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
  crseImg: {
    // height: 99,
    width: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
    marginTop: 4,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applyCouponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    height: 50,
  },
  promoInput: {
    height: 50,
    width: '70%',
    color: Colors.LIGHT_GREY,
    backgroundColor: 'white',
    paddingLeft: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  applyButton: {
    backgroundColor: Colors.THEME_BROWN,
    width: '30%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    padding: 12,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 22,
    borderRadius: 10,
    marginTop: 6,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    borderRadius: 5,
    borderColor: '#ECECEC',
  },
  createImgStyle: {
    height: 13,
    width: 13,
    borderRadius: 13 / 2,
  },
  promocodeHeader: {
    marginTop: hg(3),
    marginBottom: hg(1.4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
  },
  promocodeContainer: {
    backgroundColor: 'white',
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 5,
    borderRadius: wd(2),
    padding: wd(4),
  },
  promoSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtSave: {
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
  },
  txtCode: {
    marginTop: hg(0.5),
    color: 'gray',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '400',
  },
  couponBtn: {
    color: Colors.THEME_GOLD,
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
  },
  dashedLine: {
    marginTop: hg(1.5),
    height: hg(0.1),
    borderTopWidth: wd(0.1),
    borderTopColor: '#adadad',
    borderStyle: 'dashed',
  },
});
