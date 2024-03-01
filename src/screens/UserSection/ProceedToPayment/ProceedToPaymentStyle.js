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
  summaryContainer: {
    padding: 12,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 22,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContainer: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  cardContainerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
