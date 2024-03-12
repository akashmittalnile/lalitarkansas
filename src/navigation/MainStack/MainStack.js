//react components
import React from 'react';
//stack
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Linking, AppState } from 'react-native';
//global
import { ScreenNames } from '../../global/Index';
//screens
import Splash from 'screens/WelcomeSection/Splash/Splash';
import Welcome from 'screens/WelcomeSection/Welcome/Welcome';
import Signup from 'screens/WelcomeSection/Signup/Signup';
import Login from 'screens/WelcomeSection/Login/Login';
import ForgotPasswordEmail from 'screens/WelcomeSection/ForgotPasswordEmail/ForgotPasswordEmail';
import ForgotPasswordOTP from 'screens/WelcomeSection/ForgotPasswordOTP/ForgotPasswordOTP';
import ForgotPasswordChange from 'screens/WelcomeSection/ForgotPasswordChange/ForgotPasswordChange';
import BottomTab from 'navigation/BottomTab/BottomTab';
import Home from 'screens/UserSection/Home/Home';
import TrendingCourses from 'screens/UserSection/TrendingCourses/TrendingCourses';
import SuggestedCourses from 'screens/UserSection/SuggestedCourses/SuggestedCourses';
import TopCategory from 'screens/UserSection/TopCategory/TopCategory';
import AllProducts from 'screens/UserSection/AllProducts/AllProducts';
import SuggestedProducts from 'screens/UserSection/SuggestedProducts/SuggestedProducts';
import Cart from 'screens/UserSection/Cart/Cart';
import ProceedToPayment from 'screens/UserSection/ProceedToPayment/ProceedToPayment';
import StartCourse from 'screens/UserSection/StartCourse/StartCourse';
import CourseList from 'screens/UserSection/CourseList/CourseList';
import Notifications from 'screens/UserSection/Notifications/Notifications';
import ProductDetails from 'screens/UserSection/ProductDetails/ProductDetails';
import CourseDetails from 'screens/UserSection/CourseDetails/CourseDetails';
import NoConnection from '../../screens/UserSection/NoConnection/NoConnection';
import AllReviews from 'screens/UserSection/AllReviews/AllReviews';
import SearchAllType from 'screens/UserSection/SearchAllType/SearchAllType';
import SuperAdminCourses from 'screens/UserSection/SuperAdminCourses/SuperAdminCourses';
import SearchCourseByCategory from 'screens/UserSection/SearchCourseByCategory/SearchCourseByCategory';
import SearchProductByCategory from 'screens/UserSection/SearchProductByCategory/SearchProductByCategory';
import SearchCourseByTag from 'screens/UserSection/SearchCourseByTag/SearchCourseByTag';
import SearchProductByTag from 'screens/UserSection/SearchProductByTag/SearchProductByTag';
import SideMenuLinks from 'screens/UserSection/SideMenuLinks/SideMenuLinks';
import OrderDetails from 'screens/UserSection/OrderDetails/OrderDetails';
import Addresses from '../../screens/UserSection/Addresses/Addresses';
import AddAddress from '../../screens/UserSection/Addresses/AddAddress';
import Coupon from '../../screens/UserSection/Coupon/Coupon';
import CourseTypeModal from '../../modals/CourseType/CourseTypeModal';
import Shipping from '../../screens/UserSection/Shipping/Shipping';
import CourseCoupon from '../../screens/UserSection/CourseCoupon/CourseCoupon';

const MainStack = () => {
  const navigation = useNavigation();
  React.useEffect(() => {
    // const appStateHandler = async newAppState => {
    //   try {
    //     if (newAppState === 'active') {
    //       const url = await Linking.getInitialURL();
    //       if (url) {
    //         handleDeepLink({ url });
    //       }
    //     }
    //   } catch (err) {
    //     console.log('appState err', err.message);
    //   }
    // };

    const handleDeepLink = ({ url }) => {
      const route = url.replace(/.*?:\/\//g, '');
      const routeNameArr = route.split('/');
      let id = null;
      let type = null;
      for (let i = 0; i < routeNameArr.length; i++) {
        if (routeNameArr[i] === 'object-type-details') {
          type = `${routeNameArr[i + 1]}`;
          id = `${routeNameArr[i + 2]}`;
          break;
        }
      }
      if (id && Number(type) === 1) {
        navigation.navigate(ScreenNames.COURSE_DETAILS, { id, type, deepLinking: true });
      }
      else if (id && Number(type) === 2) {
        navigation.navigate(ScreenNames.PRODUCT_DETAILS, { id, type, deepLinking: true });
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    // AppState.addEventListener('change', appStateHandler);

    return () => {
      Linking.removeEventListener('url', handleDeepLink);
      // AppState.removeEventListener('change', appStateHandler);
    };
  }, []);
  //variables
  const Stack = createStackNavigator();
  const initialRouteName = ScreenNames.SPLASH;
  // const initialRouteName = ScreenNames.SHIPPING;
  const screenOptions = {
    headerShown: false,
  };
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName={initialRouteName}>
      <Stack.Screen name={ScreenNames.SPLASH} component={Splash} />
      <Stack.Screen name={ScreenNames.WELCOME} component={Welcome} />
      <Stack.Screen name={ScreenNames.SIGN_UP} component={Signup} />
      <Stack.Screen name={ScreenNames.LOGIN} component={Login} />
      <Stack.Screen
        name={ScreenNames.FORGOT_PASSWORD_EMAIL}
        component={ForgotPasswordEmail}
      />
      <Stack.Screen
        name={ScreenNames.FORGOT_PASSWORD_OTP}
        component={ForgotPasswordOTP}
      />
      <Stack.Screen
        name={ScreenNames.FORGOT_PASSWORD_CHANGE}
        component={ForgotPasswordChange}
      />
      <Stack.Screen name={ScreenNames.BOTTOM_TAB} component={BottomTab} />
      <Stack.Screen name={ScreenNames.HOME} component={Home} />
      <Stack.Screen
        name={ScreenNames.TRENDING_COURSES}
        component={TrendingCourses}
      />
      <Stack.Screen
        name={ScreenNames.SUGGESTED_COURSES}
        component={SuggestedCourses}
      />
      <Stack.Screen name={ScreenNames.TOP_CATEGORY} component={TopCategory} />
      <Stack.Screen name={ScreenNames.ALL_PRODUCTS} component={AllProducts} />
      <Stack.Screen
        name={ScreenNames.SUGGESTED_PRODUCTS}
        component={SuggestedProducts}
      />
      <Stack.Screen name={ScreenNames.CART} component={Cart} />
      <Stack.Screen
        name={ScreenNames.PROCEED_TO_PAYMENT}
        component={ProceedToPayment}
      />
      <Stack.Screen name={ScreenNames.START_COURSE} component={StartCourse} />
      <Stack.Screen name={ScreenNames.COURSE_LIST} component={CourseList} />
      <Stack.Screen
        name={ScreenNames.NOTIFICATIONS}
        component={Notifications}
      />
      <Stack.Screen
        name={ScreenNames.PRODUCT_DETAILS}
        component={ProductDetails}
      />
      <Stack.Screen
        name={ScreenNames.COURSE_DETAILS}
        component={CourseDetails}
      />
      <Stack.Screen name={ScreenNames.NO_CONNECTION} component={NoConnection} />
      <Stack.Screen name={ScreenNames.ALL_REVIEWS} component={AllReviews} />
      <Stack.Screen name={ScreenNames.SEACRCH_ALL_TYPE} component={SearchAllType} />
      <Stack.Screen name={ScreenNames.SUPER_ADMIN_COURSES} component={SuperAdminCourses} />
      <Stack.Screen name={ScreenNames.SEARCH_COURSE_BY_CATEGORY} component={SearchCourseByCategory} />
      <Stack.Screen name={ScreenNames.SEARCH_PRODUCT_BY_CATEGORY} component={SearchProductByCategory} />
      <Stack.Screen name={ScreenNames.SEARCH_COURSE_BY_TAG} component={SearchCourseByTag} />
      <Stack.Screen name={ScreenNames.SEARCH_PRODUCT_BY_TAG} component={SearchProductByTag} />
      <Stack.Screen name={ScreenNames.SIDE_MENU_LINKS} component={SideMenuLinks} />
      <Stack.Screen name={ScreenNames.ORDER_DETAILS} component={OrderDetails} />
      <Stack.Screen name={ScreenNames.ADDRESSESS} component={Addresses} />
      <Stack.Screen name={ScreenNames.ADD_ADDRESS} component={AddAddress} />
      <Stack.Screen name={ScreenNames.COUPONS} component={Coupon} />
      <Stack.Screen name="CourseTypeModal" component={CourseTypeModal} />
      <Stack.Screen name={ScreenNames.SHIPPING} component={Shipping} />
      <Stack.Screen name={ScreenNames.COURSE_COUPON} component={CourseCoupon} />
    </Stack.Navigator>
  );
};

export default MainStack;
