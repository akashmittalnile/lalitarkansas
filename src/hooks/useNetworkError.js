import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation, CommonActions} from '@react-navigation/core';
import {useEffect} from 'react';
import { ScreenNames } from 'global/Index';

// saurabh saneja 1 Aug 23, if no connection, navigate to no connection screen
export function useNetworkError() {
  const navigation = useNavigation();
  const {isConnected, isInternetReachable} = useNetInfo();
  const resetIndexGoNoConnection = CommonActions.reset({
    index: 1,
    routes: [{name: ScreenNames.NO_CONNECTION}],
  });
  useEffect(() => {
    //only for checking when wifi or data is on
    // if (isConnected === null) return;
    // if (!isConnected) {
    //   navigation?.navigate(ScreenNames.NETWORK_ERROR);
    // } else {
    //   if (navigation?.canGoBack()) {
    //     navigation?.goBack();
    //   }
    // }
    //actual checking of internet reachability
    if (isInternetReachable === undefined || isInternetReachable === null)
      return;
    if (!isInternetReachable) {
      navigation.dispatch(resetIndexGoNoConnection);
      // navigation.navigate(ScreensNames.NO_CONNECTION);
    } else {
      if (navigation?.canGoBack()) {
        navigation?.goBack();
      }
    }
  }, [isInternetReachable]);
}
