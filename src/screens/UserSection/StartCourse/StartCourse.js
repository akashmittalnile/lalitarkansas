//import : react components
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
//import : custom components
import MyHeader from 'components/MyHeader/MyHeader';
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
//import : global
import {Colors, Constant, MyIcon, ScreenNames, Service} from 'global/Index';
//import : styles
import {styles} from './StartCourseStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import OrdersFilter from '../../../modals/OrdersFilter/OrdersFilter';
import Review from '../../../modals/Review/Review';
import CourseCompleted from '../../../modals/CourseCompleted/CourseCompleted';
import RescheduleTest from '../../../modals/RescheduleTest/RescheduleTest';

import ProgressBar from './components/progressBar';
import PlayerControls from './components/playerControls';
import Orientation from 'react-native-orientation-locker';
import {AntDesign, Entypo} from '../../../global/MyIcon';
import Video from 'react-native-video';
// code from
// https://www.youtube.com/watch?v=OnWErQ2oHZ4&ab_channel=TechwithMuskan
const videos = [
  {
    id: '1',
    name: 'Introduction Video',
    isWatched: true,
  },
  {
    id: '2',
    name: 'Disclaimer Video',
    isWatched: false,
  },
];
const pdfs = [
  {
    id: '1',
    name: 'Hands-on Training Manual (Digital version. You should have a hard copy) PDF',
  },
  {
    id: '2',
    name: 'Student Handbook (Digital version. You should have a hard copy) PDF',
  },
  {
    id: '3',
    name: 'The AOPC Book (Digital version. You should have a hard copy) PDF',
  },
];

const StartCourse = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;

  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const videoRef = React.createRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [play, setPlay] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControl, setShowControl] = useState(true);
  const height = Dimensions.get('window').width;
  const width = Dimensions.get('window').height;
  const [showLoader, setShowLoader] = useState(false);
  const [showCourseCompletedModal, setShowCourseCompletedModal] =
    useState(false);
  const [showRescheduleTestModal, setShowRescheduleTestModal] = useState(false);

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);
    return () => {
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  const handleOrientation = orientation => {
    if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
      setFullscreen(true);
      StatusBar.setHidden(true);
    } else {
      setFullscreen(false);
      StatusBar.setHidden(false);
    }
  };

  const handlePlayPause = () => {
    if (play) {
      setPlay(false);
      setShowControl(true);
      return;
    }
    setTimeout(() => setShowControl(false), 2000);
    setPlay(true);
  };

  const handlePlay = () => {
    setTimeout(() => setShowControl(false), 500);
    setPlay(true);
  };

  const skipBackward = () => {
    videoRef.current.seek(currentTime - 15);
    setCurrentTime(currentTime - 15);
  };

  const skipForward = () => {
    videoRef.current.seek(currentTime + 15);
    setCurrentTime(currentTime + 15);
  };

  const handleControls = () => {
    if (showControl) {
      setShowControl(false);
    } else {
      setShowControl(true);
    }
  };

  const handleFullscreen = () => {
    if (fullscreen) {
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToLandscapeLeft();
    }
  };

  const onLoadEnd = data => {
    setDuration(data.duration);
    setCurrentTime(data.currentTime);
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  const onSeek = data => {
    videoRef.current.seek(data.seekTime);
    setCurrentTime(data.seekTime);
  };

  const onEnd = () => {
    setPlay(false);
    videoRef.current.seek(0);
  };

  const gotoCourseList = () => {
    navigation.navigate(ScreenNames.COURSE_LIST);
  };
  const openCourseCompletedModal = () => {
    setShowCourseCompletedModal(true);
  };
  const openRescheduleTestModal = () => {
    setShowRescheduleTestModal(true);
  };

  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        {!fullscreen ? (
          <MyHeader Title="Disclaimers Video" isBackButton />
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={[
            styles.mainView,
            fullscreen ? {padding: 0, marginTop: 0} : null,
          ]}>
          <View
            style={fullscreen ? styles.fullscreenContainer : styles.container}>
            <TouchableOpacity activeOpacity={1} onPress={handleControls}>
              <>
                <Video
                  ref={videoRef}
                  source={{
                    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                  }}
                  style={fullscreen ? styles.fullscreenVideo : styles.video}
                  controls={false}
                  resizeMode={'contain'}
                  onLoad={onLoadEnd}
                  onProgress={onProgress}
                  onEnd={onEnd}
                  paused={!play}
                  // muted={true}
                />

                {showControl && (
                  <View style={styles.controlOverlay}>
                    <TouchableOpacity
                      onPress={handleFullscreen}
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                      style={styles.fullscreenButton}>
                      {fullscreen ? (
                        <AntDesign
                          name="closecircleo"
                          color="white"
                          size={50}
                        />
                      ) : (
                        // <Entypo
                        //   aname="resize-full-screen"
                        //   color="white"
                        //   size={50}
                        // />
                        <AntDesign
                          name="pausecircleo"
                          color="white"
                          size={50}
                        />
                      )}
                    </TouchableOpacity>

                    <PlayerControls
                      onPlay={handlePlay}
                      onPause={handlePlayPause}
                      playing={play}
                      skipBackwards={skipBackward}
                      skipForwards={skipForward}
                    />

                    <ProgressBar
                      currentTime={currentTime}
                      duration={duration > 0 ? duration : 0}
                      onSlideStart={handlePlayPause}
                      onSlideComplete={handlePlayPause}
                      onSlideCapture={onSeek}
                    />
                  </View>
                )}
              </>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.buttonsRow,
              Platform.OS === 'ios' ? {paddingTop: 16} : null,
            ]}>
            <MyButton
              text="Mark Incomplete"
              style={{
                width: '48%',
                height: 50,
                backgroundColor: Colors.THEME_BROWN,
              }}
              // onPress={openCourseCompletedModal}
              // onPress={openRescheduleTestModal}
              // onPress={gotoCourseCompletedScreen}
              // onPress={gotoMcqScreen}
            />
            <MyButton
              text="Continue"
              style={{
                width: '48%',
                height: 50,
                backgroundColor: Colors.THEME_GOLD,
              }}
            />
          </View>
          <View style={styles.lessonNameRow}>
            <MyText
              text="The Art Of Permanent Cosmetics-Graded"
              textColor={'black'}
              fontSise={16}
              fontFamily="regular"
            />
            <MyText
              text="2/5"
              textColor={Colors.THEME_GOLD}
              fontSise={14}
              fontFamily="bold"
            />
          </View>
          {videos?.map(item => (
            <View style={styles.videoContainer}>
              <View style={styles.videoLeftRow}>
                <Image source={require('assets/images/video.png')} />
                <MyText
                  text={item.name}
                  textColor={item.isWatched ? 'white' : Colors.THEME_GOLD}
                  fontSise={13}
                  fontFamily="regular"
                  style={{marginLeft: 10}}
                />
              </View>
              <Image
                source={
                  item.isWatched
                    ? require('assets/images/tick-circle-white.png')
                    : require('assets/images/play-circle.png')
                }
                style={{marginRight: 10}}
              />
            </View>
          ))}
          <View style={{height: 22}}></View>
          {pdfs?.map(item => (
            <View style={styles.pdfContainer}>
              <Image source={require('assets/images/pdf-icon.png')} />
              <MyText
                text={item.name}
                textColor={Colors.LIGHT_GREY}
                fontSise={13}
                fontFamily="regular"
                style={{marginLeft: 10, width: '85%'}}
              />
            </View>
          ))}
          <MyButton
            text="COURSE LIST"
            style={{
              marginTop: 11,
              backgroundColor: Colors.THEME_GOLD,
            }}
            onPress={gotoCourseList}
          />
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
        <CourseCompleted
          visible={showCourseCompletedModal}
          setVisibility={setShowCourseCompletedModal}
        />
        <RescheduleTest
          visible={showRescheduleTestModal}
          setVisibility={setShowRescheduleTestModal}
        />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(StartCourse);
