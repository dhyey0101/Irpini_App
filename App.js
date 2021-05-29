import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import AppNavigator from './src/Routes';
import { useFonts } from 'expo-font';

// export default class App extends Component {
//   render() {
//     return (
//       <AppNavigator />
//     );
//   }
// }
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
export default props => {

	let [fontsLoaded] = useFonts({
		'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
		'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
		'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
		'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
	});

	if (!fontsLoaded) {
		return (
			<ActivityIndicator
				style={styles.loading}
				size="large"
				color="#65be44"
			/>
		);
	} else {
		return (
			<AppNavigator style={styles.container} />
		);
	}
};

const styles = StyleSheet.create({

	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 50,
		width: '100%',
	},
	loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
})
