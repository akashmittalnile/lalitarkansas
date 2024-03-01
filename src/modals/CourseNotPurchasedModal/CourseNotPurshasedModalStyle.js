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
    justifyContent: 'center',
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
  blurView: {
    flex: 1,
  },
  mainView: {
    padding: 20,
    // margin: 20,
    backgroundColor: Colors.BLACK3,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: height / 2 - 40,
    width: 593,
    height: 117,
    borderColor: '#545454',
    borderWidth: 1,
  },
});
