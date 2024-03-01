import {StyleSheet} from 'react-native';
import {Colors, Constant, MyIcon, ScreenNames, Service} from 'global/Index';
import {width} from '../../../../../global/Constant';

export const styles = StyleSheet.create({
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
