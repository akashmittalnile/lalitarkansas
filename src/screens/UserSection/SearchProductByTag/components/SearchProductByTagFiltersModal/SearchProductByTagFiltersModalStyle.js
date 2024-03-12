import {Colors} from 'global/Index';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK + '66',
  },
  blurView: {
    flex: 1,
  },
  mainView: {
    padding: 20,
    margin: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backImage: {
    height: 28,
    width: 28,
  },
  titleView: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  replyView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    backgroundColor: '#F7FEFA',
    height: 50,
    borderRadius: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.THEME_GREEN,
    marginTop: 40,
    borderRadius: 5,
    width: '100%',
    height: 60,
    shadowColor: Colors.THEME_GREEN,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 2,
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    width: 22,
    height: 22,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: '30%',
  },
  imgStyle: {
    alignSelf: 'center',
    height: 60,
    width: 60,
    marginBottom: 20,
    marginTop: 10,
  },
  longTextStyle: {
    width: '80%',
    alignSelf: 'center',
  },
});
