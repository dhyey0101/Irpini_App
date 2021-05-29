import React, { Component } from 'react';
import { Dimensions, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import TextInput from 'react-native-material-textinput';
import { LinearGradient } from 'expo-linear-gradient';
import { t } from '../../../locals';
import { check_user_existAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import validate from 'validate.js';

import DropdownAlert from 'react-native-dropdownalert';
// const { width, height } = Dimensions.get('window');

export default class Email extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }
    componentDidMount() {
        // this.ViewProduct();
    }
    
    submit() {
        const { navigate } = this.props.navigation;
        const { email } = this.state;

        var constraints = {
            email: {
                email: {
                    message: t("doesn't look like a valid email")
                }
            },

        };

        const result = validate({ email: email }, constraints);
        // console.log(result)
        if (result) {
            if (result.email) {
                this.dropdown.alertWithType('error', t('Error'), (result.email));
                return false;
            }
        }
        
        this.setState({ loader: true });
        const EmailData = {
            email: email,
        }
        this.setState({ loader: true })

        check_user_existAction(EmailData).then(function (responseJson) {
            // console.log(responseJson);
            if (responseJson.status == 1) {
                navigate('ResetPassword',{ email:email });
                this.setState({
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
                this.dropdown.alertWithType('error', t('Error'), (responseJson.error));
            }
        }.bind(this));
    }

    render() {
        const { navigate } = this.props.navigation;
        const { dataSource, loader, email } = this.state;
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/* <Row style={{ marginTop: -20, height: 120 }}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'center', padding: 20, width: 60, }} onPress={() => navigate("Login")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={{ marginLeft: 25 }}>
                                <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold' }}>{t("Reset Password")}</Text>
                            </Col>
                        </Row>
                    </Row> */}
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("Login")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{t("Reset Password")}</Text>
                            </View>
                        </View>
                    </Row>

                    <Row style={{ height: 50, marginHorizontal: 20 }}>
                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, fontFamily: "Roboto-Bold", color: "#62BB46" }}>{t("Reset Password")}</Text>
                        </Col>
                        {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                            <Green_Star />
                        </Col> */}
                    </Row>
                    <LinearGradient
                        colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        style={{ marginHorizontal: 20 }}
                    >
                        <Row style={{ height: 2, }}>
                        </Row>
                    </LinearGradient>

                    <Row style={{ marginHorizontal: 20, marginTop: 25, height: 60 }}>
                        <Text style={{ fontSize: 16, fontFamily: "Roboto-Light", color: "#666666" }}>{t("Enter your e-mail address with which you registered with the app")}</Text>
                    </Row>
                    <Row style={{ height: 100 }}>
                        <Col style={styles.InputCol}>
                            <TextInput
                                label={<Text style={{ color: "#62BB46", fontFamily: "Roboto-Medium" }}>{t("Email")}</Text>}
                                value={email}
                                autoCorrect={false}
                                color={"#62BB46"}
                                labelActiveColor={"#62BB46"}
                                underlineColor={"#62BB46"}
                                underlineActiveColor={"#62BB46"}
                                onChangeText={email => this.setState({ email: email })}
                            />

                        </Col>
                    </Row>

                    {email != '' ? (
                        <Row style={{justifyContent: 'center'}}>
                        
                        <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']} style={{ marginTop:13, height:75, borderRadius: 40, width: "80%", textAlign: 'center',justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', }} onPress={() => this.submit()}>

                                <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ borderRadius: 40, width: "80%", textAlign: 'center', color: "#FFFFFF", fontSize: 24, fontFamily: "Roboto-Bold" }}>{t("SEND")}</Text>
                                </Row>

                            </TouchableOpacity>
                        </LinearGradient>

                         </Row>
                    ) : (
                            <Row style={{ justifyContent: 'center', alignItems: 'center', height: 100 }}>
                                <Text style={{ borderWidth: 1, borderColor: "#7cd36d", paddingVertical: 20, paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center', color: "#62BB46", fontSize: 24, fontFamily: "Roboto-Bold" }}>{t("SEND")}</Text>
                            </Row>
                        )}
                <DropdownAlert ref={ref => this.dropdown = ref} />
                </View>
            )
        } else {
            return (
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                    color="#65be44"
                />
            );
        }
    }
}
const sWidth = Dimensions.get('window').width;
const sHeight = Dimensions.get('window').height;
const ratio = sWidth / sHeight; //sWidth = ratio * sHeight
const styles = StyleSheet.create({
    headerContainer: {
        ...Platform.select({
            ios: {
                width: sWidth,
                // height: 90,
                height: '17%',
            },
            android: {
                width: sWidth,
                // height: 90,
                height: '12%',
            }
        })
    },
    top_background: {
        ...Platform.select({
            ios: {
                width: sHeight * 2,
                height: sHeight * 2,
                borderRadius: sHeight * 1,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                backgroundColor: '#6DBF43',
                alignItems: 'center',
                marginLeft: ((ratio * sHeight) * 0.5) - (sHeight),
                marginTop: -sHeight * 1.87,
                paddingTop: sHeight * 1.7,
            },
            android: {
                width: sHeight * 2,
                height: sHeight * 2,
                borderRadius: sHeight * 1,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                backgroundColor: '#6DBF43',
                alignItems: 'center',
                marginLeft: ((ratio * sHeight) * 0.5) - (sHeight),
                marginTop: -sHeight * 1.90,
                paddingTop: sHeight * 1.7,
            }
        })


    },
    top_content: {
        paddingTop: sHeight * 0.02,
        width: sWidth,
        height: sHeight * 0.3,
        alignItems: 'center',
    },
    headerLogo: {
        marginTop: sHeight * 0.15,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff'
    },
    headerText: {
        ...Platform.select({
            ios: {
                marginTop: sHeight * 0.22,
                color: "#fff",
                fontSize: 17,
                fontFamily: 'Roboto-Bold',
            },
            android: {
                marginTop: sHeight * 0.21,
                color: "#fff",
                fontSize: 17,
                fontFamily: 'Roboto-Bold',
            }
        })
    },
    headerBackArrow: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: sHeight * 0.215,
                left: '18%',
                padding: 20,
                // backgroundColor:'red'
            },
            android: {
                position: 'absolute',
                marginTop: sHeight * 0.21,
                left: '18%',
                padding: 20
            }
        })
    },
    slide2Logo: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: 30,
                width: '100%',
                alignItems: 'center',
                marginLeft: 50
            },
            android: {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                height: 50,
                width: '100%',
                marginLeft: 50
            }
        })
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
    InputCol: {
        marginRight: 20,
        marginLeft: 20,
    },
})