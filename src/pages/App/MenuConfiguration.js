import React, { Component }  from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import CitySelection from  './CitySelection.js';

import { createAppContainer } from 'react-navigation';

import WasteIcon from './../../images/menu-icon/Waste.svg';
import CalendarIcon from './../../images/menu-icon/Calendar.svg';
import MenuIcon from './../../images/menu-icon/Menu.svg';
import ReportIcon from './../../images/menu-icon/Report.svg';
import WithdrawalIcon from './../../images/menu-icon/Withdrawal.svg';

const WasteStack = createStackNavigator(
  {
    Waste: { screen: CitySelection }
  }
);

const CalendarStack = createStackNavigator(
  {
    Calendar: { screen: CitySelection }
  }
);

const WithdrawalStack = createStackNavigator(
  {
    Withdrawal: { screen: CitySelection }
  }
);

const ReportStack = createStackNavigator(
    {
      Report: { screen: CitySelection }
    }
  );

  const SubmenuStack = createStackNavigator(
    {
      Report: { screen: CitySelection }
    }
  );

const App = createBottomTabNavigator(
  {
    Waste: { 
        screen: WasteStack,
        navigationOptions: {
            headerMode: "screen",
            title: "Waste",
            tabBarIcon: ({ focused, color, }) => (
                        <WasteIcon height='50' width='50'/>
            ),
        }
    },
    Calendar: {
        screen: CalendarStack,
        navigationOptions: {
            headerMode: "screen",
            title: "Calendar",
            tabBarIcon: ({ focused, color, }) => (
                        <CalendarIcon height='50' width='50'/>
            ),
        }
    },
    Withdrawal: { 
        screen: WithdrawalStack, 
        navigationOptions: {
            headerMode: "screen",
            title: "Withdrawal",
            tabBarIcon: ({ focused, color, }) => (
                        <WithdrawalIcon height='50' width='50'/>
            ),
        }
    },
    Report: { 
        screen: ReportStack, 
        navigationOptions: {
            headerMode: "screen",
            title: "Report",
            tabBarIcon: ({ focused, color, }) => (
                        <ReportIcon height='50' width='50'/>
            ),
        }
    },
    Submenu: { 
        screen: SubmenuStack,
        navigationOptions: {
            headerShown: false,
            title: "Menu",
            tabBarIcon: ({ focused, color, }) => (
                <MenuIcon height='50' width='50'/>
            ),
        }
    }
  },
  {
    headerMode: "screen",
	  tabBarOptions: {
		activeTintColor: '#FFFFFF',
		inactiveTintColor: '#ABDBA7',
		style: {
        
			  // backgroundColor: '#4DB949',
        height:80,
        borderTopColor: '#4DB949',
		},
		labelStyle: {
			textAlign: 'center',
			fontSize: 10,
      fontFamily:"Roboto-Light"
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