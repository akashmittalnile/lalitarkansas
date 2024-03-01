//import : react components
import React, {useEffect, useRef, useState, Platform} from 'react';
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
  Linking,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {styles} from './AccordionItem_OldStyle';
import MyText from '../MyText/MyText';
import {Colors, MyIcon} from '../../global/Index';
import DocumentPicker from 'react-native-document-picker';
import Toast from 'react-native-toast-message';
import MyButton from '../MyButton/MyButton';
import {width} from '../../global/Constant';

// const AccordionItem = ({num, time, title, description}) => {
const AccordionItem_Old = ({
  item,
  index,
  documents,
  setDocuments,
  uploadDocument,
  deleteDocument,
  setShowModal,
  markAsCompleted,
  allChapterSteps,
  chapindex,
  setShowPrerequisiteModal,
  setPrerequisiteModalText,
  prevChapterSteps,
}) => {
  // console.log('AccordionItem item', item?.type, item);
  const shareValue = useSharedValue(0);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);
  const bodyHeight = useAnimatedStyle(() => ({
    height: interpolate(shareValue.value, [0, 1], [0, bodySectionHeight]),
  }));

  const openDocument = async id => {
    try {
      const resp = await DocumentPicker.pickSingle({
        // type: [DocumentPicker.types.allFiles],
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      });
      // if size is greater than 1 mb, reupload image
      if (resp.size > 10 * 1024 * 1024) {
        Toast.show({
          text1:
            'Assignment document size exceeds 10 MB, please upload smaller assignment document',
        });
        return;
      }
      if (resp.type === `image/webp`) {
        Toast.show({
          text1: 'Webp image format not allowed, please select another image',
        });
        return;
      }
      console.log('setValue', resp);
      const documentsCopy = [...documents];
      documentsCopy.push({resp, id});
      setDocuments([...documentsCopy]);
    } catch (error) {
      console.log('error in openDocument', error);
    }
  };

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(shareValue.value, [0, 1], [0, 180])}deg`,
        },
      ],
    };
  });

  const toggleButton = item => {
    // if prerequisite not completed, show prerequisite modal
    if (!isPrerequisiteCompleted(item)) {
      setShowPrerequisiteModal(true);
      // chapindex name
      setPrerequisiteModalText(String(chapindex) + ': ');
      return;
    }

    if (shareValue.value === 0) {
      shareValue.value = withTiming(1, {
        // duration: 500,
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
    } else {
      shareValue.value = withTiming(0, {
        // duration: 500,
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
    }
  };

  const showVideo = file => {
    setShowModal({
      isVisible: true,
      data: {file},
    });
  };

  const openPdfInBrowser = file => {
    console.log('openPdfInBrowser', file);
    const link = `https://docs.google.com/viewerng/viewer?url=${file}`;
    Linking.openURL(link);
  };
  const openQuizInBrowser = link => {
    console.log('openPdfInBrowser', link);
    Linking.openURL(link);
  };

  const isPrerequisiteCompleted = item => {
    // if first chapter, there is no chapter before it, so previous chapter prerequities are completed
    if (chapindex === 0) {
      return true;
    }
    const prevChapIncompletedPrereq = prevChapterSteps?.find(
      el => el?.prerequisite === '1' && el?.is_completed === '0',
    );
    if (prevChapIncompletedPrereq) {
      return false;
    } else {
      return true;
    }
    // // if this step doesn't require previous step completed, return true
    // if (item?.prerequisite == '0') {
    //   return true;
    // }
    // const index = allChapterSteps.findIndex(el => el.id == item.id);
    // const isPreviousStepComplete =
    //   allChapterSteps[index - 1]?.is_completed === '1';
    // if (isPreviousStepComplete) {
    //   return true;
    // }
    // return false;
  };

  const getPreviousStepName = item => {
    const index = allChapterSteps.findIndex(el => el.id == item.id);
    return allChapterSteps[index - 1]?.title;
  };

  return (
    <View
      style={[
        styles.subContainer,
        item?.is_completed === '1'
          ? {backgroundColor: Colors.THEME_BROWN}
          : null,
      ]}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.btnStyle}
        onPress={() => toggleButton(item)}>
        <View style={styles.leftRow}>
          <View style={styles.leftSubRow}>
            <View style={styles.numView}>
              <MyText
                text={index + 1}
                fontFamily="regular"
                fontSize={13}
                textColor={'black'}
              />
            </View>
            <View style={{marginLeft: 10}}>
              <MyText
                text={item.title}
                fontFamily="medium"
                // fontSize={14}
                fontSize={16}
                textColor={getTextColor(item?.is_completed)}
              />
              {item.type === 'video' ? (
                <View style={styles.timerRow}>
                  <Image source={require('assets/images/clock.png')} />
                  <MyText
                    text={'15:00'}
                    fontFamily="regular"
                    fontSize={13}
                    textColor={getTextColor(item?.is_completed)}
                    style={{marginLeft: 5}}
                  />
                </View>
              ) : null}
            </View>
          </View>
          {item.type === 'video' ? (
            <Image
              source={require('assets/images/tick-circle-white.png')}
              style={{}}
            />
          ) : null}
        </View>
        <Animated.View style={iconStyle}>
          <Image
            source={
              item?.is_completed === '1'
                ? require('assets/images/arrow-down-white.png')
                : require('assets/images/arrow-down.png')
            }
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.descStyle, bodyHeight]}>
        <View
          style={styles.bodyContainer}
          onLayout={event => {
            setBodySectionHeight(event.nativeEvent.layout.height);
          }}>
          {!isPrerequisiteCompleted(item) ? (
            <View
              style={{
                backgroundColor: Colors.SCREEN_BG,
                width: '80%',
                padding: 20,
                marginTop: 20,
              }}>
              <MyText
                text={'Prerequisite(s) have yet not been completed!'}
                fontFamily="medium"
                fontSize={24}
                textColor={'black'}
                textAlign="center"
                style={{marginBottom: 20}}
              />
              <MyText
                text={`To move forward, please complete all prerequisites in Chapter ${
                  chapindex + 1
                }: ${getPreviousStepName(item)}`}
                fontFamily="regular"
                fontSize={18}
                textColor={'black'}
                textAlign="center"
                style={{}}
              />
            </View>
          ) : (
            <>
              {item.type === 'video' ? (
                <View>
                  <ImageBackground
                    source={{uri: item?.thumb?.path}}
                    imageStyle={{borderRadius: 10}}
                    style={styles.crseImg}>
                    <TouchableOpacity
                      onPress={() => {
                        showVideo(item?.file);
                      }}>
                      <Image source={require('assets/images/play-icon.png')} />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              ) : null}
              {item.type === 'quiz' ? (
                item?.is_completed === '0' ? (
                  <View style={{alignItems: 'center'}}>
                    <Image source={require('assets/images/quiz-info.png')} />
                    <MyText
                      text={`Please complete the Quiz in which the questions will be related to the sections you have completed till now.`}
                      textColor={Colors.LIGHT_GREY}
                      fontSize={18}
                      fontFamily="regular"
                      textAlign="center"
                      style={{marginBottom: 20}}
                    />
                    <MyButton
                      text="Start Quiz"
                      style={{
                        width: width * 0.4,
                        height: 46,
                        backgroundColor: Colors.THEME_BROWN,
                      }}
                      onPress={() => {
                        openQuizInBrowser(item?.quiz_url);
                      }}
                    />
                  </View>
                ) : item?.is_completed === '1' ? (
                  <View style={{alignItems: 'center'}}>
                    <MyText
                      text={'Tuesday, May 23, 2013 12:53 PM'}
                      fontFamily="medium"
                      fontSize={20}
                      textColor={getTextColor(item.is_completed, true)}
                      style={{marginBottom: 10}}
                    />
                    <MyText
                      text={'40% (0% required to pass)'}
                      fontFamily="medium"
                      fontSize={20}
                      textColor={getTextColor(item.is_completed, true)}
                      style={{}}
                    />
                  </View>
                ) : (
                  <ImageBackground
                    source={require('assets/images/quiz-bg.png')}
                    style={{
                      borderRadius: 30,
                      overflow: 'hidden',
                      alignItems: 'center',
                      width: '100%',
                    }}
                    resizeMode="stretch"
                    imageStyle={{alignItems: 'center'}}>
                    <MyText
                      text={'Whoops!'}
                      fontFamily="semiBold"
                      fontSize={30}
                      textColor={'white'}
                      style={{marginBottom: 10, paddingTop: 45}}
                    />
                    <MyText
                      text={'You failed this quiz with a score of'}
                      fontFamily="medium"
                      fontSize={20}
                      textColor={'white'}
                      style={{}}
                    />
                    <View style={{alignItems: 'center', marginVertical: 25}}>
                      <View style={styles.whiteCircle3}>
                        <View style={styles.whiteCircle2}>
                          <View style={styles.whiteCircle}>
                            <MyText
                              text={'22%'}
                              fontFamily="bold"
                              fontSize={29}
                              textColor={'white'}
                              style={{}}
                            />
                            <MyText
                              text={'Your Score'}
                              fontFamily="regular"
                              fontSize={14}
                              textColor={'black'}
                              style={{}}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                    <MyText
                      text={'You need 85% to pass'}
                      fontFamily="semiBold"
                      fontSize={22}
                      textColor={'white'}
                      style={{marginBottom: 25}}
                    />
                    <MyButton
                      text="Retake Quiz"
                      isWhite
                      style={{
                        width: width * 0.6,
                        marginBottom: 10,
                        backgroundColor: Colors.THEME_BROWN,
                      }}
                      onPress={() => {}}
                    />
                    <MyText
                      text={'You answered 2 out of 9 questions correctly'}
                      fontFamily="medium"
                      fontSize={20}
                      textAlign="center"
                      textColor={'white'}
                      style={{marginTop: 10, paddingBottom: 45}}
                    />
                  </ImageBackground>
                )
              ) : null}
              {item.type === 'survey'
                ? item.chapter_question?.map((sur, surIndex) => (
                    <View key={surIndex?.toString()}>
                      <Text>{sur?.title}</Text>
                      {sur?.chapter_option?.map((opt, optIndex) => (
                        <View key={optIndex?.toString()}>
                          <Text>{opt?.value}</Text>
                        </View>
                      ))}
                    </View>
                  ))
                : null}
              {item.type === 'pdf' ? (
                <View style={styles.pdfContainer}>
                  <Image source={require('assets/images/pdf-icon.png')} />
                  <TouchableOpacity
                    onPress={() => {
                      openPdfInBrowser(item?.file);
                    }}
                    style={{width: '85%'}}>
                    <MyText
                      text={item.filename}
                      numberOfLines={2}
                      textColor={Colors.LIGHT_GREY}
                      fontSise={13}
                      fontFamily="regular"
                      style={{marginLeft: 10, width: '100%'}}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
              {item.type === 'assignment' ? (
                <>
                  <View style={styles.assignmentContainer}>
                    {item?.file == '' ? (
                      <MyText
                        text={'Upload Your File'}
                        fontFamily="medium"
                        fontSize={24}
                        textColor={'black'}
                        style={{marginBottom: 41}}
                      />
                    ) : null}
                    <View style={styles.dropImgView}>
                      {wasFileSubmitted(item?.file) ? (
                        <View style={styles.pdfContainer}>
                          <Image
                            source={require('assets/images/pdf-icon.png')}
                          />
                          <MyText
                            text={
                              documents?.find(el => el?.id === item?.id)?.resp
                                ?.name
                            }
                            textColor={Colors.LIGHT_GREY}
                            fontSise={13}
                            fontFamily="regular"
                            style={{marginLeft: 10, width: '85%'}}
                          />
                        </View>
                      ) : !isLocalFileSelected(documents, item) ? (
                        <>
                          <TouchableOpacity
                            onPress={() => openDocument(item.id)}>
                            <MyText
                              text={'Select File Here'}
                              fontFamily="medium"
                              fontSize={18}
                              textColor={Colors.DARK_GREY}
                              style={{marginBottom: 40}}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => uploadDocument(item.id)}>
                            <Image
                              source={require('assets/images/upload-file.png')}
                            />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <View style={{alignItems: 'center'}}>
                          <View style={styles.pdfContainer}>
                            <View style={styles.pdfLeftRow}>
                              <Image
                                source={require('assets/images/pdf-icon.png')}
                              />
                              <MyText
                                text={
                                  documents?.find(el => el?.id === item?.id)
                                    ?.resp?.name
                                }
                                textColor={Colors.LIGHT_GREY}
                                fontSise={13}
                                fontFamily="regular"
                                style={{marginLeft: 10, width: '85%'}}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => deleteDocument(item.id)}
                              style={styles.deleteButtonStyle}>
                              <MyIcon.MaterialIcons
                                name="delete"
                                color={Colors.RED}
                                size={24}
                              />
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            onPress={() => uploadDocument(item.id)}
                            style={{marginTop: 10}}>
                            <Image
                              source={require('assets/images/upload-file.png')}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </>
              ) : null}
            </>
          )}

          {showMarkCompleteButton(item) ? (
            <View
              style={[
                styles.buttonsRow,
                Platform.OS === 'ios' ? {paddingTop: 16} : null,
              ]}>
              <MyButton
                text="Mark as completed"
                onPress={() => markAsCompleted(item.id)}
                style={[
                  {
                    width: '40%',
                    height: 46,
                    backgroundColor: Colors.THEME_BROWN,
                    marginTop: 10,
                  },
                  Platform.OS === 'ios' ? {paddingTop: 16} : null,
                ]}
              />
            </View>
          ) : null}

          {/* <MyText
            text={description}
            fontFamily="regular"
            fontSize={13}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          /> */}
        </View>
      </Animated.View>
    </View>
  );
};

export default AccordionItem_Old;

const wasFileSubmitted = file => {
  if (file === '' || file === null) {
    return false;
  } else {
    return true;
  }
};
const isLocalFileSelected = (documents, item) => {
  return documents?.find(el => el?.id === item?.id);
};

const showMarkCompleteButton = item => {
  if (
    item?.is_completed === '0' &&
    (item.type === 'video' || item.type === 'pdf')
  ) {
    return true;
  }
  return false;
};

const getTextColor = (is_completed, isDarkColor = false) => {
  const darkColor = isDarkColor ? Colors.THEME_BROWN : Colors.LIGHT_GREY;
  return is_completed === '1' ? 'white' : darkColor;
};
