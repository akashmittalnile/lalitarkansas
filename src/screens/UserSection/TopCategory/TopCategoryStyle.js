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
    paddingTop: 0,
    marginTop: -30,
  },
  categoryContainer: {
    width: (width - 60) * 0.33,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
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
});
