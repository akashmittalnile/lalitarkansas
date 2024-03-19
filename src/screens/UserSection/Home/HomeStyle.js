import {Colors, Constant} from 'global/Index';
import {Platform, StyleSheet} from 'react-native';
import {height, width} from '../../../global/Constant';
import { responsiveHeight } from 'react-native-responsive-dimensions';

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
  courseTypeContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  courseContainer: {
    width: (width - 40) * 0.66,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    marginRight: 16,
    // shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 10,
    shadowOpacity: 0.05,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 5,
    gap:20
  },
  topLeftRow: {
    // backgroundColor:'blue',
    width:'75%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:'space-around',
    // backgroundColor:'red',
    width:45,
    left:-10
  },
  crtrImg: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(5),
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  crseImg: {
    height: 167,
    width: (width - 40) * 0.66,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  bottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseNameView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    width: (width - 40) * 0.33,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  catImg: {
    height: 78,
    width: 78,
    borderRadius: 78 / 2,
  },
  productContainer: {
    width: (width - 40) * 0.42,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  heartIcon: {
    position: 'absolute',
    right: 7,
    top: 7,
    height: 18, width: 18
  },
  starView: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 15,
    right: 7,
    bottom: 11,
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
  bottomView: {
    paddingHorizontal: 10,
    paddingBottom: 1,
    paddingTop: 11,
  },
  productButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  prodCartView: {
    padding: 7,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.THEME_BROWN,
  },
});
