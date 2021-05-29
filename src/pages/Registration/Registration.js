import React, { Component } from 'react';
import { Modal, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import Logo from './../../images/logo.svg';
import Check from './../../images/Check.svg';
import Check_Box from './../../images/Check_Box.svg';
import Eye_Gray from './../../images/Eye_Gray.svg';
import Eye_Green from './../../images/Eye_Green.svg';
import TextInput from 'react-native-material-textinput';
import { t } from '../../../locals';
import CheckBox from 'react-native-check-box';
import { LinearGradient } from 'expo-linear-gradient';
import validate from 'validate.js';
import { user_registrationAction, get_term_conditionAction } from '../../util/Action';
import { storage } from "../../util/storage";
import DropdownAlert from 'react-native-dropdownalert';
import { ScrollView } from 'react-native-gesture-handler';
import Back_Arrow from './../../images/Back_Arrow.svg';
import HTML from "react-native-render-html";
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
            name: '',
            email: '',
            Create_password: '',
            Confirm_password: '',
            isChecked: false,
            validationError: '',
            passwordshow: true,
            loader: false,
            Role: '',
            termAndCondition: '',
            modalVisible: false,
            token: '',
        }
    }


    componentDidMount() {
        const Role = this.props.navigation.getParam("Role");
        this.setState({ Role: Role })
        this.termAndCondition()
        this.registerForPushNotifications();

    }

    /* for get device token */
    registerForPushNotifications = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();

        this.setState({ token: token.data });

    }

    submit() {
        const { navigate } = this.props.navigation;

        var constraints = {

            name: {
                presence: {
                    allowEmpty: false,
                    message: "^" + t("Name is required")
                },
                format: {
                    // Must be numbers followed by a name
                    pattern: "^[A-Za-z ]+",
                    message: "^" + t("Name allows the only character with space")
                }

            },
            email: {
                email: {
                    message: t("doesn't look like a valid email")
                }

            },
            Create_password: {

                length: {
                    minimum: 6,
                    message: "^" + t("Create password must be at least 6 characters")
                }

            },
            Confirm_password: {
                equality: {
                    attribute: "Create_password",
                    message: "^" + t("Confirm password is not match with password"),
                }
            }
        };
        const result = validate({ name: this.state.name, email: this.state.email, Create_password: this.state.Create_password, Confirm_password: this.state.Confirm_password }, constraints);

        if (result) {

            if (result.name) {
                this.dropdown.alertWithType('error', t('Error'), (result.name));
                return false;
            }
            if (result.email) {
                this.dropdown.alertWithType('error', t('Error'), (result.email));
                return false;
            }
            if (result.Create_password) {
                this.dropdown.alertWithType('error', t('Error'), (result.Create_password));
                return false;
            }
            if (result.Confirm_password) {
                this.dropdown.alertWithType('error', t('Error'), (result.Confirm_password));
                return false;
            }

        }
        this.setState({ loader: true });
        const registrationData = {
            display_name: this.state.name,
            email: this.state.email,
            password: this.state.Create_password,
            role: this.state.Role,
            device_token: this.state.token
        }
        console.log(registrationData)
        user_registrationAction(registrationData).then(function (responseJson) {
            if (responseJson.status == 1) {
                // console.log(responseJson);
                AsyncStorage.setItem('password', this.state.Create_password);
                storage.storeUserDetail(responseJson.result).then((data) => {
                    setTimeout(() => {
                        this.setState({ loader: false });
                        navigate('Selection');
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

    termAndCondition() {

        get_term_conditionAction().then(function (responseJson) {
            // console.log(responseJson); 
            if (responseJson.status == 1) {
                this.setState({
                    termAndCondition: responseJson.result.term_condtion,
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }

        }.bind(this));
    }


    //tearm and condition alert pop-up

    _twoOptionAlertHandler = () => {
        const { termAndCondition } = this.state;
        this.setState({ modalVisible: true });
    }

    closeModal = (visible) => {
        this.setState({ modalVisible: visible });
    };


    render() {
        const { navigate } = this.props.navigation;
        const { Role, isChecked, name, email, Create_password, Confirm_password, loader, termAndCondition, modalVisible } = this.state
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/* <Row style={{ marginTop: -20, height: 120 }}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>

                            <TouchableOpacity style={{ alignItems: 'center', padding: 20, width: 60, }} onPress={() => navigate("SelectRole")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col>
                                <Logo width={120} height={120} />
                            </Col>
                        </Row>

                    </Row> */}
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("SelectRole")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Logo width={120} height={120} style={styles.headerLogo} />
                            </View>
                        </View>
                    </Row>
                    <ScrollView>
                        {Role == "person" ? (
                            <Col style={styles.InputCol}>
                                <TextInput
                                    label={<Text style={{ fontFamily: "Roboto-Medium" }}>{t("Name and surname")}</Text>}
                                    value={name}
                                    labelActiveColor={"#666666"}
                                    underlineColor={"#67c46a"}
                                    underlineActiveColor={"#67c46a"}
                                    onChangeText={name => this.setState({ name: name })}
                                />
                            </Col>
                        ) : (
                            <Col style={styles.InputCol}>
                                <TextInput
                                    label={<Text style={{ fontFamily: "Roboto-Medium" }}>{t("Company Name")}</Text>}
                                    value={name}
                                    labelActiveColor={"#666666"}
                                    underlineColor={"#67c46a"}
                                    underlineActiveColor={"#67c46a"}
                                    onChangeText={name => this.setState({ name: name })}
                                />
                            </Col>
                        )}

                        <Col style={styles.InputCol}>
                            <TextInput
                                label={<Text style={{ fontFamily: "Roboto-Medium" }}>{t("Email")}</Text>}
                                value={email}
                                maxLength={80}
                                labelActiveColor={"#666666"}
                                underlineColor={"#67c46a"}
                                underlineActiveColor={"#67c46a"}
                                onChangeText={email => this.setState({ email: email })}
                            />
                        </Col>
                        <Row style={styles.InputCol}>
                            <Col style={{ width: '100%' }}>
                                <TextInput
                                    label={<Text style={{ fontFamily: "Roboto-Medium" }}>{t("Create password")}</Text>}
                                    value={Create_password}
                                    secureTextEntry={this.state.passwordshow}
                                    labelActiveColor={"#666666"}
                                    underlineColor={"#67c46a"}
                                    inlineImageLeft='search_icon'
                                    underlineActiveColor={"#67c46a"}
                                    onChangeText={Create_password => this.setState({ Create_password: Create_password })}
                                />
                            </Col>
                            <Col style={{ alignItems: 'flex-end', marginTop: 20 }}>
                                {this.state.passwordshow ? (<TouchableOpacity style={{ height: 30, paddingLeft: 20 }}
                                    onPress={() => this.getPasswordshow()}>
                                    <Eye_Gray />
                                </TouchableOpacity>) : (<TouchableOpacity style={{ height: 30, paddingLeft: 20 }}
                                    onPress={() => this.getPasswordshow()}>
                                    <Eye_Green />
                                </TouchableOpacity>)}
                            </Col>
                        </Row>
                        <Row style={styles.InputCol}>
                            <Col style={{ width: '100%' }}>
                                <TextInput
                                    label={<Text style={{ fontFamily: "Roboto-Medium" }}>{t("Confirm password")}</Text>}
                                    value={Confirm_password}
                                    secureTextEntry={this.state.passwordshow}
                                    labelActiveColor={"#666666"}
                                    underlineColor={"#67c46a"}
                                    underlineActiveColor={"#67c46a"}
                                    onChangeText={Confirm_password => this.setState({ Confirm_password: Confirm_password })}
                                />
                            </Col>
                            <Col style={{ alignItems: 'flex-end', marginTop: 20 }}>
                                {this.state.passwordshow ? (<TouchableOpacity style={{ height: 30, paddingLeft: 20 }}
                                    onPress={() => this.getPasswordshow()}>
                                    <Eye_Gray />
                                </TouchableOpacity>) : (<TouchableOpacity style={{ height: 30, paddingLeft: 20 }}
                                    onPress={() => this.getPasswordshow()}>
                                    <Eye_Green />
                                </TouchableOpacity>)}
                            </Col>
                        </Row>
                        <Row style={{ marginTop: "10%", marginHorizontal: "14%" }}>
                            <Col style={{ width: 30, justifyContent: 'center', alignItems: 'center' }}>
                                <CheckBox
                                    // onPress={() => this._twoOptionAlertHandler()}
                                    onClick={(value) => {

                                        this.setState({
                                            isChecked: !this.state.isChecked
                                        })

                                    }}
                                    isChecked={this.state.isChecked}
                                    checkedImage={<Check />}
                                    unCheckedImage={<Check_Box />}
                                />
                            </Col>
                            {/* <TouchableOpacity onPress={() => this.setState({ isChecked: !this.state.isChecked })} > */}
                            <TouchableOpacity onPress={this._twoOptionAlertHandler} style={{ marginLeft: 10 }}>
                                <Col style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ fontSize: 16, fontFamily: 'Roboto-Medium', color: '#666666' }}>{t("I agree to terms and conditions")}</Text>
                                </Col>
                            </TouchableOpacity>
                        </Row>
                        {isChecked == true ? (

                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: "20%" }} onPress={() => this.submit()}>
                                <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']} style={{ paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center' }}>
                                    <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ paddingVertical: 20, borderRadius: 40, width: "80%", textAlign: 'center', color: "#666666", fontSize: 28, fontFamily: "Roboto-Medium" }}>{t("REGISTRATION")}</Text>
                                    </Row>
                                </LinearGradient>

                            </TouchableOpacity>

                        ) : (
                            <Row style={{ marginTop: "20%", justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ borderWidth: 1, borderColor: "#7cd36d", paddingVertical: 20, paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center', color: "#666666", fontSize: 28, fontFamily: "Roboto-Medium" }}>{t("REGISTRATION")}</Text>
                            </Row>
                        )}
                        <TouchableOpacity style={styles.LoginButton} onPress={() => navigate("Auth")}>
                            {/* <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']} style={{ height: 80, paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center' }}> */}
                            <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ borderWidth: 1, borderColor: "#7cd36d", paddingVertical: 20, paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center', color: "#666", fontSize: 28, fontFamily: "Roboto-Medium" }}>{t("LOGIN")}</Text>
                            </Row>
                            {/* </LinearGradient> */}

                        </TouchableOpacity>





                        {/* Term and condition modal start */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                        // onRequestClose={() => {
                        //   navigate('LocationScreen')
                        // }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <View style={{ justifyContent: 'center', flexDirection: 'row', marginHorizontal: 20 }}>
                                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                            <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 20 }}>{t("Term and Condition")}</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end', }}>
                                            <TouchableOpacity onPress={() => this.closeModal(false)}>
                                                <Image
                                                    source={require("../../images/Cross-Icon.png")}
                                                    style={{ width: 30, height: 30 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <ScrollView>
                                        <View style={{ marginHorizontal: 20 }}>
                                            <HTML source={{ html: termAndCondition }} />
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                        {/* Term and condition modal end */}
                    </ScrollView>
                    <DropdownAlert ref={ref => this.dropdown = ref} />
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Image source={require('../../images/loading.gif')} style={{ height: "100%", width: "100%" }} />
                </View>
            )
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
                height: '16%',
                zIndex: 1
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

        ...Platform.select({
            ios: {
                marginTop: sHeight * 0.15,
                fontSize: 25,
                fontWeight: 'bold',
                color: '#fff'
            },
            android: {
                marginTop: sHeight * 0.143,
                fontSize: 25,
                fontWeight: 'bold',
                color: '#fff'
            }
        })
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
                // marginTop: 30,
                width: '100%',
                alignItems: 'center',
                marginLeft: 70
            },
            android: {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                height: 50,
                width: '100%',
                marginLeft: 70
            }
        })
    },
    InputCol: {
        marginRight: 30,
        marginLeft: 30,
    },
    passwordContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingBottom: 10,
        backgroundColor: 'red',
    },
    LoginButton: {
        ...Platform.select({
            ios: {
                // marginTop: "10%",
                height: 90,
                justifyContent: 'center',
                alignItems: 'center',

            },
            android: {
                marginTop: "20%",
                // height: 90,
                // justifyContent: 'center',
                // alignItems: 'center'
                bottom: 40
            }
        })
    },
    centeredView: {
        shadowColor: "#232324",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1.22,
        elevation: 500,
        // width: Dimensions.get('window').width,
        height: Dimensions.get("window").height,
        backgroundColor: "rgba(100,100,100, 0.8)",
    },
    modalView: {
        justifyContent: "center",
        marginVertical: "20%",
        borderRadius: 20,
        paddingVertical: 10,
        backgroundColor: "#fff",
        marginHorizontal: 20,
        shadowColor: "#232324",
        shadowOffset: {
            width: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
})