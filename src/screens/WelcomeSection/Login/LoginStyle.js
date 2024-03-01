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
    backgroundColor: '#040706',
  },
  alreadyView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 85,
  },
  forgot: {
    alignSelf: 'flex-end',
  },
});
