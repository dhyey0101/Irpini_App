import React, { Component } from 'react';
import { View, AsyncStorage, ActivityIndicator } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Insruction from './pages/Registration/Instruction.js';
import RegistrationForm from './pages/Registration/Registration.js';
import SelectRole from './pages/Registration/SelectRole.js';
import LoginForm from './pages/Auth/Login.js';
import EmailForm from './pages/Auth/Email.js';
import ResetPassword from './pages/Auth/ResetPassword.js';
import SuccessPage from './pages/Auth/Success.js';
import Menu from './pages/App/Menu.js';
import CitySelection from './pages/Registration/CitySelection.js';
import DepartmentSelection from './pages/Registration/DepartmentSelection.js';

class AuthLoadingScreen extends Component {

    constructor() {
        super();
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('token');
        const first_visited = await AsyncStorage.getItem('first_visited');
        const selectedCityId = await AsyncStorage.getItem('selectedCityId');
        const selectedDepartmentId = await AsyncStorage.getItem('selectedDepartmentId');
        
        if(first_visited){
            if(selectedCityId != null)
            {
                this.props.navigation.navigate(userToken ? 'App' : 'Auth');
            }else{
                this.props.navigation.navigate('Selection');
            }
            
        }else {
            this.props.navigation.navigate('Registration');
        }
        // this.props.navigation.navigate(userToken ? 'App' : 'Registration' );
        
        // this.props.navigation.navigate(userToken ? 'App' : 'App' );
    };

    render() {
        return (
            <View>
                <ActivityIndicator />
            </View>
        );
    }
}

// const AppStack = createStackNavigator({DrawerStack: { screen: DrawerStack} } , { headerMode: 'screen' , })
const RegistrationStack = createStackNavigator({ Insruction: Insruction,SelectRole:SelectRole, Registration: RegistrationForm, CitySelection : CitySelection, DepartmentSelection : DepartmentSelection });
const SelectionStack = createStackNavigator({ CitySelection : CitySelection, DepartmentSelection : DepartmentSelection });
const AuthStack = createStackNavigator({ Login: LoginForm, Email : EmailForm, ResetPassword : ResetPassword, ResetPasswordSuccess : SuccessPage });
const AppStack = createStackNavigator({
		MainMenu: { screen: Menu }
	},{
		headerMode: 'Screen',
});

export default createAppContainer(createSwitchNavigator(

    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
        Registration: RegistrationStack,
        Selection: SelectionStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));










