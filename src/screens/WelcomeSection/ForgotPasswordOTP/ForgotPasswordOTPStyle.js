import {StyleSheet} from 'react-native';
import {Colors, Constant} from 'global/Index';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SCREEN_BG,
  },
  mainView: {
    padding: 20,
  },
  flexRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '100%',
  },
  textInputStyle: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    textAlign: 'center',
    height: 66,
    width: 62,
    borderRadius: 5,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
});
