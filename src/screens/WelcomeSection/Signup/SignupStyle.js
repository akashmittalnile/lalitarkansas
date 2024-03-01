import {StyleSheet} from 'react-native';
import {Colors, Constant} from 'global/Index';
import { width } from '../../../global/Constant';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SCREEN_BG,
  },
  mainView: {
    padding: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 21,
    marginBottom: 26,
  },
  orBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.THEME_GOLD,
  },
  alreadyView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 85,
  },
  imageViewStyle: {
    width: 110,
    height: 110,
    alignSelf:'center',
    marginTop: 30,
    marginBottom: 10
  },
  deleteButtonStyle: {
    position: 'absolute',
    backgroundColor: Colors.THEME_GOLD,
    borderRadius: 100,
    padding: 5,
    right: 5,
    top: 5,
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
