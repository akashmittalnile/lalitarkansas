import {Platform, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  navigatorStyle: {
    height: 70,
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabStyle: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 0 : 20
  },
});
