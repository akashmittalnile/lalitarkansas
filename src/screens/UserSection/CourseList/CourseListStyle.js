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
  pdfContainer: {
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
  courseCompletionNumRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseCompletionLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
  },
});
