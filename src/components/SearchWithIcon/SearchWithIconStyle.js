import {Colors} from 'global/Index';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    zIndex: 2,
  },
  inputStyle: {
    height: 60,
    padding: 10,
    paddingLeft: 20,
    borderRadius: 5,
    fontSize: 14,
    color: 'black',
    width: '80%',
    backgroundColor: Colors.WHITE,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 2,
  },
  iconView: {
    height: 60,
    width: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.THEME_GOLD,
    width: '18%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 2,
  },
  dot:{
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.THEME_BROWN,
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
  }
});
