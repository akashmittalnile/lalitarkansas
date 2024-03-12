import {Colors} from 'global/Index';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // color: Colors.LITE_GREY,
    backgroundColor: Colors.THEME_BROWN,
  },
  mainView: {
    paddingTop: 30,
    paddingLeft: 18,
    paddingRight: 12,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoCloseView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logoImageStyle: {
    height: 70,
    width: 70,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 2,
    borderRadius: 5,
  },
  profileCardView: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    padding: 10,
    backgroundColor: Colors.WHITE,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  profileImageStyle: {
    height: 70,
    width: 70,
    borderRadius: 100,
    alignSelf: 'center',
  },
  imageNameView: {
    // alignItems: 'center',
  },
  flexRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // logoImage: {width: 127, height: 127, borderRadius: 50},
  crossImage: {width: 46, height: 46, marginRight: 10},
  menuContainer: {
    flexDirection: 'row',
    marginTop: 25,
    width: '100%',
  },
  menuImage: {width: 20, height: 18},
  image: {
    width: 160,
    height: (160 * 120) / 200,
  },
  socialMediaContainer: {
    backgroundColor: Colors.THEME_GOLD,
    padding: 22,
    paddingBottom: 28,
    marginTop: 30,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.BLACK,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.LIGHT_GRAY,
    padding: 20,
  },
});
