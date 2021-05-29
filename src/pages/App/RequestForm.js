import React, { Component } from 'react';
import { Dimensions, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform, ClippingRectangle } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView } from 'react-native-gesture-handler';
import { request_bulky_wasteAction, bulky_waste_city_listAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import TextInput from 'react-native-material-textinput';
import DropdownAlert from 'react-native-dropdownalert';
import validate from 'validate.js';
// import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";


const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = "AIzaSyBaxJhL95JRiHmRjkes67-m72uxGTE12hE";
var today = new Date();
export default class FevouriteList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            favourite_product_Category: [],
            dataSource: [],
            isfavourite: 0,
            address: '',
            product: '',
            // date: moment(today).format('DD-MM-YYYY'),
            note: '',
            cityCollapsed: false,
            cityList: [],
            city_id: '',
            selectedCityName: '',
            name: '',
            surname: '',
            phone: ''
        }
    }
    componentDidMount() {
        // alert(today)
        this.CityList();

    }

    async CityList() {
        const { cityList } = this.state;
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const CityData = {
            access_token: Token,
            current_user_id: customer_id
        }
        var response = bulky_waste_city_listAction(CityData, Token).then(function (responseJson) {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    cityList: responseJson.result,
                    // arrayholder: responseJson.result,
                    loader: false
                });
                // console.log(this.state.cityList)
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    async SelectedCity(item_id, city_name) {
        this.setState({ loader: true });
        this.setState({

            cityCollapsed: false,
            city_id: item_id,
            selectedCityName: city_name,
            loader: false
            // getCapacity: [],
        })
        // console.log(this.state.selectedCityName)
    }

    async submit() {
        const { navigate } = this.props.navigation;
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');

        var constraints = {


            name: {
                presence: {
                    allowEmpty: false,
                    message: "^" + t("Name is required")
                },
            },
            surname: {
                presence: {
                    allowEmpty: false,
                    message: "^" + t("Surname is required")
                },
            },
            phone: {
                presence: {
                    allowEmpty: false,
                    message: "^" + t("Phone number is required")
                },
                // format: {
                //     pattern: "[0-9]",
                //     flags: "i",
                //     message: "^" + t("Please enter only number")
                // }
            },
            city: {
                presence: {
                    allowEmpty: false,
                    message: "^" + t("Select City")
                },
            },
            address: {
                presence: {
                    allowEmpty: false,
                    message: "^" + t("Address is required")
                },
            },
            product: {
                presence: {
                    allowEmpty: false,
                    message: "^" + t("Please enter the product name"),
                }
            },
            // date: {
            //     presence: {
            //         allowEmpty: false,
            //         message: "^" + t("Please enter the product name"),
            //     }
            // }
        };
        const result = validate({ name: this.state.name, surname: this.state.surname, phone: this.state.phone, city: this.state.city_id, address: this.state.address, product: this.state.product, date: this.state.date }, constraints);

        if (result) {

            if (result.name) {
                this.dropdown.alertWithType('error', t('Error'), (result.name));
                return false;
            }
            if (result.surname) {
                this.dropdown.alertWithType('error', t('Error'), (result.surname));
                return false;
            }
            if (result.phone) {
                this.dropdown.alertWithType('error', t('Error'), (result.phone));
                return false;
            }
            if (result.city) {
                this.dropdown.alertWithType('error', t('Error'), (result.city));
                return false;
            }
            if (result.address) {
                this.dropdown.alertWithType('error', t('Error'), (result.address));
                return false;
            }
            if (result.product) {
                this.dropdown.alertWithType('error', t('Error'), (result.product));
                return false;
            }
            // if (result.date) {
            //     this.dropdown.alertWithType('error', t('Error'), (result.date));
            //     return false;
            // }
        }
        this.setState({ loader: true });
        const requestData = {
            access_token: Token,
            current_user_id: customer_id,
            user_name: this.state.name,
            user_surname: this.state.surname,
            telephone_number: this.state.phone,
            city_id: this.state.city_id,
            pickup_address: this.state.address,
            note: this.state.note,
            product: this.state.product,
            // pickup_date: this.state.date,
        }
        console.log(requestData)
        var response = request_bulky_wasteAction(requestData).then(function (responseJson) {
            console.log(responseJson)
            if (responseJson.status == 1) {
                navigate("SuccessPageRequestForm")
                this.setState({
                    name: '',
                    surname: '',
                    phone: '',
                    address: '',
                    city_id: '',
                    note: '',
                    product: '',
                    date: '',
                    loader: false
                });
            } else {
                this.setState({ loader: false });
                navigate("errorpage", { route_name: 'request_form' })
                // this.dropdown.alertWithType('error', t('Error'), (responseJson.message));
            }
        }.bind(this));
    }
    render() {
        const { navigate } = this.props.navigation;
        const { name, surname, phone, product, loader, address, date, note, cityCollapsed, city_id } = this.state;
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("Withdrawal")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{t("Bulky withdrawal")}</Text>
                            </View>
                        </View>
                    </Row>
                    {/* <ScrollView>
                    <KeyboardAvoidingView style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "padding" : null}> */}

                    <Row style={{ height: 50, marginHorizontal: 20, marginBottom: 10 }}>
                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium", color: "#62BB46" }}>{t("Book your retreat!")}</Text>
                        </Col>
                    </Row>
                    <LinearGradient
                        colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        style={{ marginHorizontal: 20 }}
                    >
                        <Row style={{ height: 2, }}>
                        </Row>
                    </LinearGradient>

                    <ScrollView>
                        <Col style={{ width: '90%', marginHorizontal: 20 }}>
                            <TextInput
                                label={<Text style={{ fontFamily: 'Roboto-Regular', fontSize: 14, color: "#666" }}>{t("Name")}</Text>}
                                value={name}
                                // secureTextEntry={this.state.passwordshow}
                                labelActiveColor={"#666666"}
                                underlineColor={"#67c46a"}
                                underlineActiveColor={"#67c46a"}
                                onChangeText={name => this.setState({ name: name })}
                            />
                        </Col>
                        <Col style={{ width: '90%', marginHorizontal: 20 }}>
                            <TextInput
                                label={<Text style={{ fontFamily: 'Roboto-Regular', fontSize: 14, color: "#666" }}>{t("Surname")}</Text>}
                                value={surname}
                                // secureTextEntry={this.state.passwordshow}
                                labelActiveColor={"#666666"}
                                underlineColor={"#67c46a"}
                                underlineActiveColor={"#67c46a"}
                                onChangeText={surname => this.setState({ surname: surname })}
                            />
                        </Col>
                        <Col style={{ width: '90%', marginHorizontal: 20 }}>
                            <TextInput
                                label={<Text style={{ fontFamily: 'Roboto-Regular', fontSize: 14, color: "#666" }}>{t("Phone")}</Text>}
                                value={phone}
                                keyboardType="numeric"
                                // secureTextEntry={this.state.passwordshow}
                                maxLength={15}
                                labelActiveColor={"#666666"}
                                underlineColor={"#67c46a"}
                                underlineActiveColor={"#67c46a"}
                                onChangeText={phone => this.setState({ phone: phone })}
                            />
                        </Col>
                        <Collapse style={styles.service_colls}
                            isExpanded={this.state.cityCollapsed}
                            onToggle={(isCollapsed) => this.setState({ cityCollapsed: isCollapsed })}>
                            <CollapseHeader>

                                <Row style={{ marginVertical: 10, }}>

                                    <Col>
                                        {city_id ? (
                                            <View style={{ justifyContent: 'center' }}>
                                                <Text style={{ fontFamily: "Roboto-Medium", color: '#4d4d4d', fontSize: 14 }}>{this.state.selectedCityName}</Text>
                                            </View>
                                        ) : (
                                            <View>
                                                <Text style={{ fontFamily: "Roboto-Regular", color: '#666666', fontSize: 14 }}>{t('Common')}</Text>
                                            </View>
                                        )}

                                    </Col>
                                    <Col style={{ alignItems: 'flex-end', marginRight: 3, justifyContent: 'center' }}>
                                        {cityCollapsed == true ? (
                                            <Image style={{ height: 16, width: 16 }}
                                                source={require('../../images/down-green.png')}
                                            />
                                        ) : (
                                            <Image style={{ height: 16, width: 16 }}
                                                source={require('../../images/down-gray.png')}
                                            />
                                        )}

                                    </Col>
                                </Row>
                            </CollapseHeader>

                            <CollapseBody style={{ paddingBottom: 10 }}>

                                {this.state.cityList.map(((item) => (
                                    <TouchableOpacity onPress={() => this.SelectedCity(item.id, item.city_name)} >

                                        <View style={{ flexDirection: 'row', }}>
                                            {/* <ScrollView> */}
                                            <Row style={{ marginTop: 15, borderBottomWidth: 1, borderColor: '#65be44', }}>

                                                <Text style={{ fontFamily: "Roboto-Medium", color: '#4d4d4d', fontSize: 16 }}>{item.city_name}</Text>
                                                {/* <Text>{item.type}</Text>  */}
                                            </Row>
                                        </View>
                                    </TouchableOpacity>
                                )))}
                            </CollapseBody>

                        </Collapse>

                        <Col style={{ width: '90%', marginHorizontal: 20 }}>
                            <TextInput
                                label={<Text style={{ fontFamily: 'Roboto-Regular', fontSize: 14, color: "#666" }}>{t("Address")}</Text>}
                                value={address}
                                // secureTextEntry={this.state.passwordshow}
                                labelActiveColor={"#666666"}
                                underlineColor={"#67c46a"}
                                underlineActiveColor={"#67c46a"}
                                onChangeText={address => this.setState({ address: address })}
                            />
                        </Col>

                        <Col style={{ width: '90%', marginHorizontal: 20 }}>
                            <TextInput
                                label={<Text style={{ fontFamily: 'Roboto-Regular', fontSize: 14, color: "#666" }}>{t("What should we withdraw?")}</Text>}
                                value={product}
                                // secureTextEntry={this.state.passwordshow}
                                labelActiveColor={"#666666"}
                                underlineColor={"#67c46a"}
                                underlineActiveColor={"#67c46a"}
                                onChangeText={product => this.setState({ product: product })}
                            />
                        </Col>

                        <Col style={{ width: '90%', marginHorizontal: 20 }}>
                            <TextInput
                                label={<Text style={{ fontFamily: 'Roboto-Regular', fontSize: 14, color: "#666" }}>{t("Note")}</Text>}
                                value={note}
                                // secureTextEntry={this.state.passwordshow}
                                labelActiveColor={"#666666"}
                                underlineColor={"#67c46a"}
                                underlineActiveColor={"#67c46a"}
                                onChangeText={note => this.setState({ note: note })}
                            />
                        </Col>

                        {/* <Row style={{ height: 20, marginHorizontal: 20 }}>
                            <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 14, color: "#666" }}>{t("Pickup date")}</Text>
                        </Row> */}
                        {/* <TouchableOpacity style={{ width: '50%' }} >
                            <Row style={{ width: '70%', height: 30, marginHorizontal: 20 }}>
                                <LinearGradient
                                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                
                                >
                                    <DatePicker

                                        style={{ width: 158, paddingRight: 60 }}
                                        date={date}
                                        mode="date"
                                        format="DD-MM-YYYY"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        showIcon={false}
                                        customStyles={{
                                            dateText: {
                                                fontSize: 15,
                                                fontFamily: 'Roboto-Medium',
                                                color: '#fff',
                                                marginBottom: 10
                                            },
                                            dateInput: {
                                                borderWidth: 0,
                                            }
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => { this.setState({ date: date }) }}

                                    />

                                </LinearGradient>
                               
                                <Col style={{ padding: 8, position: 'absolute', marginLeft: 110, borderLeftWidth: 2, borderColor: "#fff" }}>
                                    <Image source={require('../../images/Down.png')} style={styles.DownArrow} />
                                </Col>
                               
                            </Row>
                        </TouchableOpacity> */}

                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: "20%", marginBottom: "5%" }} onPress={() => this.submit()}>
                            <LinearGradient
                                colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{ marginHorizontal: 20, borderWidth: 1, borderColor: "#7cd36d", paddingVertical: 20, paddingHorizontal: 20, borderRadius: 40, width: "80%", height: 80 }}
                            >

                                <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ width: "80%", color: "#fff", fontSize: 28, fontFamily: "Roboto-Medium", textAlign: 'center' }}>{t("SEND")}</Text>
                                </Row>
                            </LinearGradient>
                        </TouchableOpacity>

                    </ScrollView>

                    {/* </KeyboardAvoidingView>
                    </ScrollView> */}
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
                height: '16%',
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
                marginTop: 40,
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
                marginLeft: 65
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
    Image: {
        alignItems: "center",
        justifyContent: "center",
        // height: 90,
        marginTop: 5,
        width: Dimensions.get("window").width * 80 / 100,
        // borderRadius: 100,
        // marginLeft: 10,
        height: Dimensions.get("window").height * 30 / 100,
    },
    DownArrow: {
        width: 15,
        height: 15
    },
    service_colls: {
        borderBottomWidth: 1,
        borderColor: '#65be44',
        marginHorizontal: 20,
        marginTop: 10
        // borderRadius: 30,
    },
})