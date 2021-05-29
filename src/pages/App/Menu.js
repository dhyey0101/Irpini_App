
import React, { Component } from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { StatusBar, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform, Button } from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';
import BottomSheet from 'reanimated-bottom-sheet';

// Local Pages
import { t } from '../../../locals';

// Bottom tab pages
import Dashboard from './Dashboard.js';
import Calendar from './Calendar.js';
import Withdrawal from './Withdrawal.js';
import Report from './Report.js';

// Submenu pages
import Sidemenu from './Submenu.js';
import Profile from './Profile.js';
import News from './News.js';
import NewsView from './NewsView.js';
import Educational from './Educational.js';
import EducationalView from './EducationalView.js';

// About us
import Aboutus from './Aboutus.js';

// market place screens start 
import FleaMarket from './FleaMarket.js';
import MarketPlaceAdsCategory from './AdsCategory.js';
import MarketPlaceAdsSubCategory from './AdsSubCategory.js';
import MarketPlaceAdsSubCategoryAdvertList from './AdsSubCategoryAdvertList.js';
import AdsAdvertProductView from './AdsAdvertProductView.js';
import MarketPlaceCreateCategory from './CreateCategory.js';
import MarketPlaceCreateSubCategory from './CreateAdsSubCategory.js';
import MarketPlaceCreateAdvert from './MarketPlaceCreateAdvert.js';
import MarketPlaceMyAdvertList from './MarketPlaceMyAdvertList.js';
// market place screen end

import HelpRequest from './HelpRequest.js';
import FavouriteList from './FavouriteList.js';
import FavouriteProductDescription from './FavouriteProductDescription.js';
import SupportNumber from './SupportNumber.js';
import EmailScreen from './EmailScreen.js';
import HelprequestScreen from './HelprequestScreen.js';
import CategoryList from './CategoryList.js';
import Information from './Information.js';
import ProductInformation from './ProductInformation.js';
import Map from './Map.js';
import RequestForm from './RequestForm.js';
import SuccesspageMarketPlaceCreateAds from './SuccesspageMarketPlaceCreateAds.js';
import SuccesspageMarketPlaceDeleteAds from './SuccesspageMarketPlaceDeleteAds.js';
import SuccesspageMarketPlaceOpenAds from './SuccesspageMarketPlaceOpenAds.js';
import SuccesspageMarketPlaceCloseAds from './SuccesspageMarketPlaceCloseAds.js';
import SuccessPageRequestForm from './SuccessPageRequestForm.js';
import SuccessPageDeleteMessage from './SuccessPageDeleteMessage.js';
import SuccessPageDisableMessage from './SuccessPageDisableMessage.js';
import SuccessPageEnableMessage from './SuccessPageEnableMessage.js';

import successpage from './successpage.js';
import errorpage from './errorpage.js';
import canceldate from './canceldate.js';
import GeneralCalendarScreen from './GeneralCalendar.js';
import CreateReport from './CreateReport.js';
import AlertsList from './alertsList.js';
import ComplainView from './ComplainView.js';
import ComplainMapView from './ComplainMapView.js';
import MyBooking from './MyBooking.js';


// Menu Icon SVG
import WasteIcon from './../../images/menu-icon/Waste.svg';
import CalendarIcon from './../../images/menu-icon/Calendar.svg';
import MenuIcon from './../../images/menu-icon/Menu.svg';
import ReportIcon from './../../images/menu-icon/Report.svg';
import MercatinoIcon from './../../images/menu-icon/Mercatino-white.svg';
import WithdrawalIcon from './../../images/menu-icon/Withdrawal.svg';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import AllComplainList from './AllComplainList';
import MyBookingView from './MyBookingView';

const lang = i18n.locale = Localization.locale.substr(0, 2);

const ProfileStack = createStackNavigator(
  {
    Profile: { screen: Profile },
    FavouriteList: { screen: FavouriteList },
    FavouriteProductDescription: { screen: FavouriteProductDescription }
  }
);
const HelpStack = createStackNavigator(
  {
    HelpRequest: { screen: HelpRequest },
    SupportNumber: { screen: SupportNumber },
    EmailScreen: { screen: EmailScreen },
    HelprequestScreen: { screen: HelprequestScreen },

  }
);

const AboutusStack = createStackNavigator(
  {
    Aboutus: { screen: Aboutus },

  }
);

const FleaMarketStack = createStackNavigator(
  {
    FleaMarket: { screen: FleaMarket },
    MarketPlaceAdsCategory: { screen: MarketPlaceAdsCategory },
    MarketPlaceAdsSubCategory: { screen: MarketPlaceAdsSubCategory },
    MarketPlaceAdsSubCategoryAdvertList: { screen: MarketPlaceAdsSubCategoryAdvertList },
    AdsAdvertProductView: { screen: AdsAdvertProductView },

    // create add route
    MarketPlaceCreateCategory: { screen: MarketPlaceCreateCategory },
    MarketPlaceCreateSubCategory: { screen: MarketPlaceCreateSubCategory },
    MarketPlaceCreateAdvert: { screen: MarketPlaceCreateAdvert },
    MarketPlaceMyAdvertList: { screen: MarketPlaceMyAdvertList },
    

    // successpageMarketPlaceCreateAds: { screen: successpage},
    SuccesspageMarketPlaceCreateAds: { screen: SuccesspageMarketPlaceCreateAds},
    SuccesspageMarketPlaceDeleteAds: { screen: SuccesspageMarketPlaceDeleteAds},
    SuccesspageMarketPlaceOpenAds: { screen: SuccesspageMarketPlaceOpenAds},
    SuccesspageMarketPlaceCloseAds: { screen: SuccesspageMarketPlaceCloseAds},

    errorpage: { screen: errorpage},
  }
);

const NewsStack = createStackNavigator(
  {
    News: { screen: News },
    NewsView: { screen: NewsView },
  }
);

const EducationStack = createStackNavigator(
  {
    Educational: { screen: Educational },
    EducationalView: { screen: EducationalView },
  }
);


const ReportStack = createStackNavigator(
  {
    Report: { screen: Report },
    CreateReport: { screen: CreateReport},
    AlertsList: { screen: AlertsList},
    ComplainView: { screen: ComplainView},
    ComplainMapView: {screen: ComplainMapView},
    AllComplainList: { screen: AllComplainList},
    SuccessPageDeleteMessage: {screen: SuccessPageDeleteMessage},
    SuccessPageDisableMessage: {screen: SuccessPageDisableMessage},
    SuccessPageEnableMessage: {screen: SuccessPageEnableMessage},
    // successpage: { screen: successpage},
    errorpage: { screen: errorpage},
  }
);

const BottomMenu = createStackNavigator(
  {
    // PusherIntegration: { screen: PusherIntegration_StackNavigator },

    Sidemenu: { screen: Sidemenu },
    Profile: { screen: ProfileStack },
    News: { screen: NewsStack },
    Educational: { screen: EducationStack },
    // FleaMarket: { screen: FleaMarketStack },
    Segnalazioni: { screen: ReportStack },
    HelpRequest: { screen: HelpStack },
    AboutUs: { screen: AboutusStack },
  },
  {
    headerMode: 'Screen',
  }
  );


const WasteStack = createStackNavigator(
  {
    // CitySelection: { screen: CitySelection },
    // DepartmentSelection: { screen: DepartmentSelection },
    Waste: { screen: Dashboard },
    CategoryList: {screen: CategoryList},
    Information: {screen: Information},
    ProductInformation: {screen: ProductInformation},
    Map: {screen: Map, navigationOptions:{
      gesturesEnabled: false
    } },
    Calendar: { screen: Calendar },
    canceldate: { screen: canceldate }
  }
);

const CalendarStack = createStackNavigator(
  {
    GeneralCalendarScreen: { screen: GeneralCalendarScreen }
  }
);

const WithdrawalStack = createStackNavigator(
  {
    Withdrawal: { screen: Withdrawal },
    RequestForm: { screen: RequestForm},
    MyBooking: { screen: MyBooking},
    MyBookingView: { screen: MyBookingView},
    SuccessPageRequestForm: { screen: SuccessPageRequestForm},
    // successpage: { screen: successpage},
    errorpage: { screen: errorpage},
  }
);

const SubmenuStack = createStackNavigator(
  {
    Menu: { screen: BottomMenu }
  },
  {
    headerMode: 'Screen',
  }
);

const App = createBottomTabNavigator(
  {
    Waste: {
      screen: WasteStack,
      navigationOptions: {
        headerMode: "screen",
        // title: t("Waste"),
        tabBarLabel: ({ focused, color, }) => (
          focused ? (<Text style={{ marginBottom: 5,fontFamily: 'Roboto-Light', textAlign: 'center', fontSize: 10, color: '#FFFFFF' }}>{lang == 'it' ? "Rifiuti" : "Waste"} </Text>) : (<Text style={{ marginBottom: 5,fontFamily: 'Roboto-Light', textAlign: 'center', fontSize: 10, color: '#ABDBA7' }}>{lang == 'it' ? "Rifiuti" : "Waste"} </Text>)
        ),
        tabBarIcon: ({ focused, color, }) => (
          focused ? (<WasteIcon height='40' width='40' />) : (<WasteIcon height='40' width='40' style={{ opacity: 0.7 }} />)
        ),
      }
    },
    Calendar: {
      screen: CalendarStack,
      navigationOptions: {
        headerMode: "screen",
        // title: t("Calendar"),
        tabBarLabel: ({ focused, color, }) => (
          focused ? (<Text style={{ marginBottom: 5, fontFamily: 'Roboto-Light', textAlign: 'center', fontSize: 10, color: '#FFFFFF' }}>{lang == 'it' ? "Calendario" : "Calendar"} </Text>) : (<Text style={{ marginBottom: 5, fontFamily: 'Roboto-Light', textAlign: 'center', fontSize: 10, color: '#ABDBA7' }}>{lang == 'it' ? "Calendario" : "Calendar"} </Text>)
        ),
        tabBarIcon: ({ focused, color, }) => (
          focused ? (<CalendarIcon height='40' width='40' />) : (<CalendarIcon height='40' width='40' style={{ opacity: 0.7 }} />)
        ),
      }
    },
    Withdrawal: {
      screen: WithdrawalStack,
      navigationOptions: {
        headerMode: "screen",
        // title: t("Withdrawal"),
        tabBarLabel: ({ focused, color, }) => (
          focused ? (<Text style={{ marginBottom: 5, fontFamily: 'Roboto-Light', textAlign: 'center', fontSize: 10, color: '#FFFFFF' }}>{lang == 'it' ? "Ritiro" : "Withdrawal"} </Text>) : (<Text style={{ marginBottom: 5, fontFamily: 'Roboto-Light', textAlign: 'center', fontSize: 10, color: '#ABDBA7' }}>{lang == 'it' ? "Ritiro" : "Withdrawal"} </Text>)
        ),
        tabBarIcon: ({ focused, color, }) => (
          focused ? (<WithdrawalIcon height='40' width='40' />) : (<WithdrawalIcon height='40' width='40' style={{ opacity: 0.7 }} />)
        ),
      }
    },
    // Report: {
    //   screen: ReportStack,
    //   navigationOptions: {
    //     headerMode: "screen",
    //     // title: t("Report"),
    //     tabBarLabel: ({ focused, color, }) => (
    //       focused ? (<Text style={{ marginBottom: 5, fontFamily: 'Roboto-Light', textAlign:'center',fontSize:10, color:'#FFFFFF'}}>{lang == 'it' ? "Segnalazioni" : "Report" } </Text>) : (<Text style={{ marginBottom: 5, fontFamily: 'Roboto-Light', textAlign:'center',fontSize:10, color:'#ABDBA7'}}>{lang == 'it' ? "Segnalazioni" : "Report" } </Text>)
    //     ),
    //     tabBarIcon: ({ focused, color, }) => (
    //       focused ? (<ReportIcon height='40' width='40' />) : (<ReportIcon height='40' width='40' style={{ opacity: 0.7 }} />)
    //     ),
    //   }
    // },
    Report: {
      screen: FleaMarketStack,
      navigationOptions: {
        headerMode: "screen",
        // title: t("Report"),
        tabBarLabel: ({ focused, color, }) => (
          focused ? (<Text style={{ marginBottom: 5, fontFamily: 'Roboto-Light', textAlign:'center',fontSize:10, color:'#FFFFFF'}}>{lang == 'it' ? "Mercatino" : "Market" } </Text>) : (<Text style={{ marginBottom: 5, fontFamily: 'Roboto-Light', textAlign:'center',fontSize:10, color:'#ABDBA7'}}>{lang == 'it' ? "Mercatino" : "Market" } </Text>)
        ),
        tabBarIcon: ({ focused, color, }) => (
          focused ? (<MercatinoIcon height='40' width='40' />) : (<MercatinoIcon height='40' width='40' style={{ opacity: 0.7 }} />)
        ),
      }
    },
    Submenu: {
      screen: BottomMenu,
      navigationOptions: {
        // title: t("Menu"),
        tabBarLabel: ({ focused, color, }) => (
          focused ? (<Text style={{ marginBottom: 5, fontFamily: 'Roboto-Light', textAlign: 'center', fontSize: 10, color: '#FFFFFF' }}>{lang == 'it' ? "Menù" : "Menu"} </Text>) : (<Text style={{ marginBottom: 5, fontFamily: 'Roboto-Light', textAlign: 'center', fontSize: 10, color: '#ABDBA7' }}>{lang == 'it' ? "Menù" : "Menu"} </Text>)
        ),
        tabBarIcon: ({ focused, color, }) => (
          focused ? (<MenuIcon height='40' width='40' />) : (<MenuIcon height='40' width='40' style={{ opacity: 0.7 }} />)
        ),
      }
    }
  },
  {
    defaultNavigationOptions: {
      // other tab navigation options...
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        // console.log(navigation);
        if (navigation.state.key === 'Submenu') {
          navigation.navigate('Sidemenu');
        } else {
          defaultHandler();
        }
      }
    },
    headerMode: "screen",
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      inactiveTintColor: '#ABDBA7',
      style: {
        backgroundColor: '#4DB949',
        height: 80,
        borderTopColor: '#4DB949',
      },
      labelStyle: {
        textAlign: 'center',
        fontSize: 10,
        fontFamily: "Roboto-Light"
      },
      // indicatorStyle: {
      // 	borderTopColor: '#4DB949',
      // 	borderBottomColor: '#4DB949',
      // 	borderBottomWidth: 2,
      // },
    },
  }
);

export default createAppContainer(App);

const styles = StyleSheet.create({

  slide1: {
    flex: 1,
    justifyContent: 'center',

  },

})


