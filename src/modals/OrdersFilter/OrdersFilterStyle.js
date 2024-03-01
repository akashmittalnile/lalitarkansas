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
    height: '100%',
    backgroundColor: Colors.SCREEN_BG,
    padding: 20,
    paddingBottom: 0,
    // alignItems: 'center',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});
