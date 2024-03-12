import {Colors, Constant} from 'global/Index';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  row: {
    width: 51,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  itemCon: {
    height: Constant.height / 4,
    width: Constant.width - 40,
    borderRadius: 20,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  circle: {
    height: 7,
    width: 7,
    borderRadius: 7 / 2,
    backgroundColor: Colors.DARK_GREY,
    marginRight: 10,
  },
  dotsCon: {
    width: Constant.width - 40,
    height: 7,
    bottom: 24,
    alignItems: 'center',
  },
  dotsFlatList: {
    height: 7,
    width: 85,
  },
});
