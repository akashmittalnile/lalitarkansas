import {Colors, Constant} from 'global/Index';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import {height, width} from '../../../global/Constant';

const windowHeight = Dimensions.get('window').width * (9 / 16);
const windowWidth = Dimensions.get('window').width;

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
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 27,
    marginBottom: 21,
  },
  videoContainer: {
    backgroundColor: Colors.THEME_BROWN,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  videoLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  container: {
    backgroundColor: '#ebebeb',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#ebebeb',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  video: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    flex: 1,
    // height: height,
    // width: width,
    height: width,
    width: height,
    backgroundColor: 'black',
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: 'justify',
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
});
