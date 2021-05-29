import React, { Component } from 'react';
import { StatusBar, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import Logo from './../../images/logo.svg';
import Check from './../../images/Check.svg';
import Check_Box from './../../images/Check_Box.svg';
import TextInput from 'react-native-material-textinput';
import { t } from '../../../locals';
import CheckBox from 'react-native-check-box';
import { LinearGradient } from 'expo-linear-gradient';
import validate from 'validate.js';
import { user_loginAction } from './../../util/Action';
import { storage } from "./../../util/storage";
import DropdownAlert from 'react-native-dropdownalert';
import Bin from './../../images/Bin.svg'
import { ScrollView } from 'react-native-gesture-handler';
import Eye_Gray from './../../images/Eye_Gray.svg';
import Eye_White from './../../images/Eye_White.svg';
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions';





export default class Registration extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            Create_password: '',
            isChecked: false,
            validationError: '',
            passwordshow: true,
            loader: false,
            token:''
        }
    }

    async componentDidMount() {
        let email = await AsyncStorage.getItem('email');
        let password = await AsyncStorage.getItem('password');

        this.setState({ email : email, Create_password : password });
        this.registerForPushNotifications();
        // alert('component did mount');
    }

    /* for get device token */
    registerForPushNotifications = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        // alert('permission status' + existingStatus);

        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // alert('second permission status' + existingStatus);

        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        
        this.setState({ token: token.data });
        // alert(this.state.token);
    }

    async submit() {
        const { navigate } = this.props.navigation;
        const { email, password } = this.state;

        var constraints = {


            email: {
                email: {
                    message: t("doesn't look like a valid email")
                }

            },
            Create_password: {
                presence: {
                    allowEmpty: false,
                    message: "^" + t("password is required")
                },
            },

        };
        const result = validate({ email: this.state.email, Create_password: this.state.Create_password }, constraints);
        // console.log(result)
        if (result) {

            if (result.email) {
                this.dropdown.alertWithType('error', t('Error'), (result.email));
                return false;
            }
            if (result.Create_password) {
                this.dropdown.alertWithType('error', t('Error'), (result.Create_password));
                return false;
            }

        }
        this.setState({ loader: true });
        // Get the token that uniquely identifies this device
        
        const LoginData = {
            username: this.state.email,
            password: this.state.Create_password,
            device_token: this.state.token,
        }

        console.log(LoginData)

        user_loginAction(LoginData).then(function (responseJson) {
            console.log(responseJson)
            // alert('SuccessFully');
            if (responseJson.status == 1) {
                AsyncStorage.setItem('password', this.state.Create_password);
                
                AsyncStorage.setItem('selectedCityId', responseJson.result.city_id);
                AsyncStorage.setItem('selectedDepartmentId', responseJson.result.department_id);
                storage.storeUserDetail(responseJson.result).then((data) => {
                    setTimeout(() => {
                        this.setState({ loader: false });
                        navigate('App');
                    }, 3000);
                })
                    .catch((err) => {
                        console.log(err)
                    });
            } else {
                setTimeout(() => {
                    this.setState({ loader: false });
                    this.dropdown.alertWithType('error', t('Error'), (responseJson.error));
                }, 3000);
            }

        }.bind(this));
    }
    /* hide and show password */
    getPasswordshow = () => {
        if (this.state.passwordshow == true) {
            this.setState({ passwordshow: false })
        } else {
            this.setState({ passwordshow: true })
        }
    }
    render() {
        const { navigate } = this.props.navigation;
        const { email, Create_password, loader } = this.state
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 20 : 0
        if (!loader) {
            return (
                <View style={styles.slide1}>
                    <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                        style={{ flex: 1 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : ""}>
                                <StatusBar />
                                <Row style={styles.LogoRow}>
                                    <Col style={styles.LogoCol}>
                                        <Logo width={220} height={220}/>
                                    </Col>
                                </Row>
                                <Row style={styles.BinRow}>
                                    <Col style={styles.BinCol}>
                                        <Bin />
                                    </Col>
                                </Row>
                                <Col style={styles.InputCol}>
                                    <TextInput
                                        label={<Text style={{ color: '#fff', fontFamily: "Roboto-Medium" }}>{t("Email")}</Text>}
                                        value={email}
                                        autoCorrect={false}
                                        color={"#fff"}
                                        labelActiveColor={"#fff"}
                                        underlineColor={"#fff"}
                                        underlineActiveColor={"#fff"}
                                        onChangeText={email => this.setState({ email: email })}
                                    />
                                    
                                </Col>
                                {/* <Col style={styles.InputCol}>
                            <TextInput
                                label={<Text style={{ color: '#fff', fontFamily: "Roboto-Medium" }}>{t("Password")}</Text>}
                                value={Create_password}
                                maxLength={30}
                                color={"#fff"}
                                labelActiveColor={"#fff"}
                                underlineColor={"#fff"}
                                underlineActiveColor={"#fff"}
                                onChangeText={Create_password => this.setState({ Create_password: Create_password })}
                            />
                        </Col> */}

                                <Row style={styles.InputCol}>
                                    <Col style={{ width: '100%' }}>
                                        <TextInput
                                            label={<Text style={{ color: '#fff', fontFamily: "Roboto-Medium" }}>{t("Password")}</Text>}
                                            value={Create_password}
                                            color={"#fff"}
                                            secureTextEntry={this.state.passwordshow}
                                            labelActiveColor={"#fff"}
                                            underlineColor={"#fff"}
                                            inlineImageLeft='search_icon'
                                            underlineActiveColor={"#fff"}
                                            onChangeText={Create_password => this.setState({ Create_password: Create_password })}
                                        />
                                    </Col>
                                    <Col style={{ alignItems: 'flex-end', marginTop: 23 }}>
                                        {this.state.passwordshow ? (<TouchableOpacity style={{ height: 30, paddingLeft: 20 }}
                                            onPress={() => this.getPasswordshow()}>
                                            <Eye_White height={20} width={20}/>
                                        </TouchableOpacity>) : (<TouchableOpacity style={{ height: 30, paddingLeft: 20 }}
                                            onPress={() => this.getPasswordshow()}>
                                            <Eye_White height={20} width={20}/>
                                        </TouchableOpacity>)}
                                    </Col>
                                </Row>
                                <TouchableOpacity style={styles.ForgotPasswordContainer} onPress={() => this.props.navigation.navigate('Email')}>
                                    {/* <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']} style={{ height: 80, paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center' }}> */}
                                    {/* <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ borderWidth: 1, borderColor: "#7cd36d", paddingVertical: 20, paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center', color: "#fff", fontSize: 28, fontFamily: "Roboto-Medium" }}>{t("LOGIN")}</Text>
                                    </Row> */}
                                    <Text style={styles.ForgotPasswordText}>{ t('Did you forget your password') }</Text>
                                    {/* </LinearGradient> */}

                                </TouchableOpacity>
                                <TouchableOpacity style={styles.LoginButton} onPress={() => this.submit()}>
                                    {/* <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']} style={{ height: 80, paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center' }}> */}
                                    <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ borderWidth: 1, borderColor: "#7cd36d", paddingVertical: 20, paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center', color: "#fff", fontSize: 28, fontFamily: "Roboto-Medium" }}>{t("LOGIN")}</Text>
                                    </Row>
                                    {/* </LinearGradient> */}

                                </TouchableOpacity>
                                <TouchableOpacity style={styles.RegistrationButton} onPress={() => navigate("Registration")}>
                                    {/* <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']} style={{ height: 80, paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center' }}> */}
                                    <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ borderWidth: 1, borderColor: "#7cd36d", paddingVertical: 20, paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center', color: "#fff", fontSize: 28, fontFamily: "Roboto-Medium" }}>{t("REGISTRATION")}</Text>
                                    </Row>
                                    {/* </LinearGradient> */}

                                </TouchableOpacity>
                            </KeyboardAvoidingView>
                        </ScrollView>
                        <DropdownAlert ref={ref => this.dropdown = ref} />

                    </LinearGradient>
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Image source={require('../../images/login.gif')} style={{ height: "100%", width: "100%" }} />
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({

    slide1: {
        flex: 1,
        justifyContent: 'center',
    },
    LogoRow: {
        height: 50,
        marginTop: "20%"
    },

    LogoCol: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
    },

    BinRow: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "10%"
    },

    BinCol: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 200,
        borderRadius: 200,
        backgroundColor: '#fff'
    },
    WelcomeRow: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
                marginTop: "10%"
            },
            android: {
                justifyContent: 'center',
                alignItems: 'center',
                height: 30
            }
        })
    },
    textSlide1: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold'
    },
    InputCol: {
        // top: "10%",
        marginRight: 30,
        marginLeft: 30,
    },
    InputCol2: {
        // top:"10%",
        marginRight: 30,
        marginLeft: 30,
    },
    ForgotPasswordContainer:{
        ...Platform.select({
            ios: {
                marginTop: "10%",
                // height: 90,
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor:'red'

            },
            android: {
                marginTop: "10%",
                // height: 90,
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor:'yellow',
                bottom: 10,
                // backgroundColor:'red'
            }
        })
    },
    ForgotPasswordText:{
        ...Platform.select({
            ios: {
                paddingBottom:2,
                justifyContent: 'center',
                alignItems: 'center',
                fontSize:15,
                borderBottomWidth: 1,
                color:'#FFFFFF',
                borderBottomColor: '#C1E7C1',
                textDecorationLine: 'underline',
                // lineHeight : 1,
                fontFamily: 'Roboto-Medium'
            },
            android: {
                paddingBottom:2,
                justifyContent: 'center',
                alignItems: 'center',
                fontSize:15,
                borderBottomWidth: 1,
                color:'#FFFFFF',
                borderBottomColor: '#C1E7C1',
                fontFamily: 'Roboto-Medium'
            }
        })
    },
    LoginButton: {
        ...Platform.select({
            ios: {
                marginTop: "5%",
                height: 90,
                justifyContent: 'center',
                alignItems: 'center',

            },
            android: {
                marginTop: "5%",
                // height: 90,
                // justifyContent: 'center',
                // alignItems: 'center'
                // backgroundColor:'yellow',
                bottom: 10
            }
        })

    },
    RegistrationButton: {
        ...Platform.select({
            ios: {
                // marginTop: "10%",
                height: 90,
                justifyContent: 'center',
                alignItems: 'center',

            },
            android: {
                marginTop: "10%",
                // height: 90,
                // justifyContent: 'center',
                // alignItems: 'center'
                bottom: 10
            }
        })

    }
})