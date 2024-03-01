import {Colors, Constant} from 'global/Index';
import {Platform, StyleSheet} from 'react-native';
import {width} from '../../../global/Constant';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SCREEN_BG,
  },
  mainView: {
    padding: 20,
  },
  contactContainer: {
    height: 131,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 13,
    paddingLeft: 14,
    paddingBottom: 18,
    paddingRight: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  personImg: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    borderWidth: 2,
    borderColor: Colors.THEME_GOLD,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  tab: {
    // width: '48%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
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
  addButtonStyle: {
    position: 'absolute',
    backgroundColor: Colors.THEME_GOLD,
    borderRadius: 100,
    padding: 10,
    right: 5,
    bottom: 5,
  },
});
