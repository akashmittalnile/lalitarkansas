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
    // marginTop: -30,
  },
  notiContainer: {
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  iconBg: {
    backgroundColor: 'white',
    height: 196,
    width: 196,
    borderRadius: 196 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCountView:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  }
});
