import React, { Component } from 'react';
import { ActivityIndicator, Platform, View, StyleSheet, Image, Text, TouchableOpacity, AsyncStorage, StatusBar, ImageBackground, Dimensions, TouchableHighlight } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { LinearGradient } from 'expo-linear-gradient';
import { t } from '../../../locals';

const { width, height } = Dimensions.get('window');
export default class CustomSidebarMenu extends Component {
   
    /** Open / close sidemenu */
    toggleDrawer = (navigation) => {

        this.props.navigation.closeDrawer();
    };

    logout = async () => {
        await AsyncStorage.removeItem('userid');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('email');
        this.props.navigation.navigate('Auth');

    };

    /** Design part of page */
    render() {
        const { navigate } = this.props.navigation;
            return (

                <View style={styles.container}>
                    <StatusBar />
                    <ImageBackground source={require('../../images/Drawer-Background.png')} style={{ height: height, resizeMode: 'cover', marginTop: 15}}>
                    
                    <Col style={{ justifyContent:'flex-end',bottom:80}}>
                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                        >
                            <Row style={{ height:2 }}>
                            </Row>
                        </LinearGradient>

                        {/* <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                        > */}
                        <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('Profile'); }} style={styles.menuItem}>
                            <Row style={styles.profileListRow}>
                                <Col>
                                    <Text style={styles.text}>
                                        { t('Profile') }
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableHighlight>
                        {/* </LinearGradient> */}

                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                        >
                            <Row style={{ height:2 }}>
                            </Row>
                        </LinearGradient>

                        <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('News'); }} style={styles.menuItem}>
                            <Row style={styles.profileListRow}>
                                <Col>
                                    <Text style={styles.text}>
                                       { t('News') }
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableHighlight>

                        {/* Educational */}
                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                        >
                            <Row style={{ height:2 }}>
                            </Row>
                        </LinearGradient>

                        <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('Educational'); }} style={styles.menuItem}>
                            <Row style={styles.profileListRow}>
                                <Col>
                                    <Text style={styles.text}>
                                        { t('Educational') }
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableHighlight>

                        {/* Flea Market */}
                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                        >
                            <Row style={{ height:2 }}>
                            </Row>
                        </LinearGradient>

                        <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('FleaMarket'); }} style={styles.menuItem}>
                            <Row style={styles.profileListRow}>
                                <Col>
                                    <Text style={styles.text}>
                                    { t('Flea Market') }
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableHighlight>

                        {/* Help Request */}
                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                        >
                            <Row style={{ height:2 }}>
                            </Row>
                        </LinearGradient>

                        <TouchableHighlight underlayColor="#67BD44" onPress={() => { this.props.navigation.navigate('HelpRequest'); }} style={styles.menuItem}>
                            <Row style={styles.profileListRow}>
                                <Col>
                                    <Text style={styles.text}>
                                    { t('Help Request') }
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableHighlight>

                        {/* Logout */}
                        <LinearGradient
                            colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                        >
                            <Row style={{ height:2 }}>
                            </Row>
                        </LinearGradient>

                        <TouchableHighlight underlayColor="#67BD44" onPress={() => this.logout()} style={styles.menuItem}>
                            <Row style={styles.profileListRow}>
                                <Col>
                                    <Text style={styles.text}>
                                    { t('Logout') }
                                    </Text>
                                </Col>
                            </Row>
                        </TouchableHighlight>

                    </Col>

                    </ImageBackground>
                </View>
            );
    }
}

/** CSS */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#449735'
    },
    text: {
        color: '#333333',
        marginLeft: 20,
        fontSize: 25,
        fontFamily: 'Roboto-Medium'
    },
    profileListRow: {
        marginLeft: 20,
        height: 40,
        marginTop: 10,
    },
    menuItem: {
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                textAlign: 'center',
                color: '#4C64FF',
                backgroundColor: '#ffffff'
            },
            android: {
                paddingVertical: 10,
                textAlign: 'center',
                color: '#4C64FF',
                backgroundColor: '#ffffff'
            }
        })
    }
});