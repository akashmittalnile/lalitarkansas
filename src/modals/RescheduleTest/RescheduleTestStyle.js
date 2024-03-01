import {Colors} from 'global/Index';
import {StyleSheet} from 'react-native';
import {height, width} from '../../global/Constant';

export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: width,
    // height: 134,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'center',
    // justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#545454',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK + '66',
    borderRadius: 10,
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
  },
  infoView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.THEME_GOLD,
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
});
