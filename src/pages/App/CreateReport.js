import React, { Component } from 'react';
import { Dimensions, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { city_listAction, user_request_mail_supportAction, add_complaint_by_corporateAction } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import Green_Star from './../../images/Green_Star.svg';
import Redirect_Arrow_Gray from './../../images/Redirect_Arrow_Gray.svg';
import DropdownAlert from 'react-native-dropdownalert';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from "expo-permissions";
import * as Location from 'expo-location';
import validate from 'validate.js';
import * as ImageManipulator from 'expo-image-manipulator';
import TextInputMaterial from "react-native-material-textinput";



const { width, height } = Dimensions.get('window');

export default class corporateCreationScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            attachphoto: '',
            attachphotoBase64: '',

            favourite_product_Category: [],
            dataSource: [],
            message: '',
            photosName: '',
            List: [],
            cityList: [],
            filterData: [],
            arrayholder: [],
            selectedCity: '',
            selectedCityId: '',
            search: '',
            searchResult: 0,
            isCitySelected: 0,
            latitude: '',
            longitude: '',
            permissionStatus: '',
            complain_title: ''
        }
    }
    async componentDidMount() {
        this.CityList();
        this.getPermissionAsync();
        
        let location = await Location.getCurrentPositionAsync({});
        var lat = parseFloat(location.coords.latitude)
        var long = parseFloat(location.coords.longitude)
        this.setState({
            latitude: lat,
            longitude: long
        })
    }

    async setLatLong() {
        if (this.state.permissionStatus !== 'granted') {
            Location.requestPermissionsAsync().then((permission) => {
                let status = permission.status;
                this.setState({
                    permissionStatus: status
                })

            })

        }
        //  else {
        //     alert(t('Please give location permission'));
        // }

        let location = await Location.getCurrentPositionAsync({});
        var lat = parseFloat(location.coords.latitude)
        var long = parseFloat(location.coords.longitude)
        this.setState({
            latitude: lat,
            longitude: long
        })
    }

    async getPermissionAsync() {
        // Camera roll Permission
        if (Platform.OS === "ios") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (status !== "granted") {
                alert("Sorry, we need camera roll permission to make this work");
            }
        }
        // Camera Permission
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === "granted" });
    }

    async attachphoto() {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });
        if(result) {
            this.setState({
                loader:true,
            })
            const manipResult = await ImageManipulator.manipulateAsync( result.uri,
                [{resize:{height:1024}}],
                { compress:0,format: ImageManipulator.SaveFormat.PNG, base64:true }
            );
            // console.log(manipResult.uri)
            if(manipResult) {
                this.setState({
                    loader:false,
                })
            }  
            this.setState({
                attachphoto: manipResult.uri,
                attachphotoBase64: manipResult.base64,
                // photosName: manipResult.name,
                photosName: manipResult.uri.split('/').pop(),
                // photosName: manipResult.name,
                attachphotoStatus: 1,
            });

            // this.setState({
            //     attachphoto: result.uri,
            //     attachphotoBase64: result.base64,
            //     // photosName: result.name,
            //     photosName: result.uri.split('/').pop(),
            //     attachphotoStatus: 1,
            // });
        }
        
    }

    // async SendMessage() {
    //     let customer_id = await AsyncStorage.getItem('userid');
    //     let Token = await AsyncStorage.getItem('token');
    //     const messageData = {
    //         access_token: Token,
    //         current_user_id: customer_id,
    //         message: this.state.message,
    //     }
    //     // console.log(messageData)
    //     this.setState({ loader: true })
    //     user_request_mail_supportAction(messageData, Token).then((responseJson) => {
    //         // console.log(responseJson)
    //         if (responseJson.status == 1) {
    //             this.setState({
    //                 loader: false,
    //                 message: ''
    //             });
    //             // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
    //             this.dropdown.alertWithType('success', t('Success'), (responseJson.error));
    //         } else {
    //             this.setState({ loader: false });
    //             this.dropdown.alertWithType('error', t('Error'), (responseJson.error));
    //         }
    //     });
    // }
    async CityList() {
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const CityData = {
            access_token: Token,
            current_user_id: customer_id
        }
        var response = city_listAction(CityData, Token).then(function (responseJson) {

            if (responseJson.status == 1) {
                this.setState({
                    cityList: responseJson.result,
                    arrayholder: responseJson.result,
                    loader: false
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    async submit() {
        const { navigate } = this.props.navigation;
        const { latitude, longitude, selectedCityId } = this.state;
        
        if(latitude == '' && longitude == '') {
            this.getPermissionAsync();
            this.setLatLong();
            // return false;
        }

        this.setState({ loader: true })
        // var constraints = {
        //     selectedCity: {
        //         presence: {
        //             message: t("doesn't look like a valid email")
        //         }

        //     },
        //     complaint_photo: {
        //         presence: {
        //             message: "^" + t("Attach a picture")
        //         }

        //     }

        // };
        // const result = validate({ selectedCity: this.state.selectedCity, complaint_photo: this.state.complaint_photo, }, constraints);
        // if (result) {
        //     if (result.selectedCity) {
        //         this.dropdown.alertWithType('error', t('Error'), (result.selectedCity));
        //         return false;
        //     }
        //     if (result.complaint_photo) {
        //         this.dropdown.alertWithType('error', t('Error'), (result.complaint_photo));
        //         return false;
        //     }

        // }

        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const ComplainData = {
            access_token: Token,
            current_user_id: customer_id,
            title: this.state.complain_title,
            complaint_description: this.state.message,
            city_id: selectedCityId,
            complaint_photo: this.state.attachphotoBase64,
            latitude: latitude,
            longitude: longitude,

        }

        add_complaint_by_corporateAction(ComplainData).then(function (responseJson) {
            // console.log(responseJson)
            if (responseJson.status == 1) {

                this.setState({
                    complain_title:'',
                    message: '',
                    selectedCityId: '',
                    selectedCity: '',
                    photosName: '',
                    latitude: '',
                    longitude: '',
                    loader: false

                });
                this.dropdown.alertWithType('success', t('Success'), (responseJson.error));
            } else {
                this.setState({ loader: false });
                this.dropdown.alertWithType('error', t('Error'), (responseJson.error));
            }
        }.bind(this));
    }

    SearchFilterFunction(text) {

        let city = this.state.arrayholder
        let newData = city.filter((item) => {
            const itemData = item.city_name ? item.city_name.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        })
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            filterData: newData,
            cityList: newData,
            search: text,
            searchResult: 1,
            scrollEnabled: false,
            selectedCity: "",
            isCitySelected: 0,
            selectedCityId: 0,
        });

        if (!text.length) {
            this.setState({ scrollEnabled: true });
        }
    }

    renderItem = ({ item }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({ search: item.city_name, selectedCityId: item.id, selectedCity: item.city_name, searchResult: 0, isCitySelected: 1, scrollEnabled: true })}>
                    <View>
                        <Text style={{ paddingVertical: 5, fontSize: 15, color: '#62bb46', fontFamily: 'Roboto-Medium' }}>{item.city_name}</Text>
                    </View>

                </TouchableOpacity>
                <LinearGradient
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 1 }}>
                    </Row>
                </LinearGradient>
            </View>

        )

    }


    render() {
        const { navigate } = this.props.navigation;
        const { cityList, loader, message, search, photosName, complain_title, latitude, longitude } = this.state;
        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/* <Row style={{ marginTop: -20, height: 120 }}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'center', padding: 20, width: 60, }} onPress={() => navigate("Report")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={styles.header}>
                                <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold' }}>{t("Fill in the form")}</Text>
                            </Col>
                        </Row>
                    </Row> */}
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("Report")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{t("Fill in the form")}</Text>
                            </View>
                        </View>
                    </Row>
                    <KeyboardAvoidingView style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "height" : null}>
                        <ScrollView>
                            <View style={{marginTop: 10, marginHorizontal: 20}}>
                                {/* <Col style={styles.InputCol}> */}

                                    <TextInput
                                        style={{fontFamily:"Roboto-Bold", textAlign:'center'}}
                                        placeholder={t('Title of the report')}
                                        placeholderTextColor={'#62bb46'}
                                        fontSize={24}
                                        color={'#62bb46'}
                                        value={complain_title}
                                        onChangeText={(complain_title) => this.setState({ complain_title: complain_title })}
                                    />
                                    
                                {/* </Col> */}
                                </View>
                            <LinearGradient
                                colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{ marginHorizontal: 20 }}
                            >
                                <Row style={{ height: 2, }}>
                                </Row>
                            </LinearGradient>
                            <Row style={{ marginHorizontal: 20, marginBottom: 10 }}>
                                <TextInput style={{ backgroundColor: 'red', width: "100%", height: 150, marginTop: 20, backgroundColor: '#f8f8f8', textAlign: 'justify', textAlignVertical: "top", paddingLeft: 15, paddingTop: 15 }}
                                    placeholder={t("Write your message here")}
                                    placeholderTextColor={"#65be44"}
                                    multiline
                                    numberOfLines={4}
                                    value={message}
                                    onChangeText={(message) => this.setState({ message: message })}
                                >
                                </TextInput>
                            </Row>
                            <Row style={{ marginHorizontal: 20, marginTop: 30, }}>
                                <Text style={{ fontFamily: "Roboto-Medium", }}>{t("Select your municipality")}</Text>
                            </Row>
                            <Row style={{ marginHorizontal: 20, marginBottom: 10 }}>
                                <Col style={{ width: "90%", justifyContent: 'center' }}>
                                    <TextInput
                                        placeholder={t("Type")}
                                        value={this.state.search}
                                        onChangeText={(text) => this.SearchFilterFunction(text)} />
                                </Col>
                                {this.state.isCitySelected == 0 ? (
                                    <Image source={require('../../images/surface1.png')} style={styles.searchIcon} />
                                ) : (
                                    <Image source={require('../../images/surface2.png')} style={styles.searchIcon} />
                                )}
                            </Row>
                            <LinearGradient
                                colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{ marginHorizontal: 20 }}
                            >
                                <Row style={{ height: 2, }}>
                                </Row>
                            </LinearGradient>
                            {(this.state.search != '' && this.state.searchResult != 0) &&
                                <View style={styles.searchResult}>
                                    <Row style={{ backgroundColor: '#ffffff', padding: 5, marginRight: 20, marginLeft: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, height: 100, borderColor: 'green', borderWidth: 1 }}>
                                        <ScrollView keyboardShouldPersistTaps='always'>

                                            <FlatList
                                                data={cityList}
                                                renderItem={this.renderItem}
                                                keyExtractor={item => item.id.toString()}
                                                ListEmptyComponent={
                                                    <EmptyComponent title={t("No match found")} />
                                                }
                                            />

                                        </ScrollView>
                                    </Row>
                                </View>
                            }
                            <Row style={{ marginHorizontal: 20, marginTop: 30, }}>
                                <Text style={{ fontFamily: "Roboto-Medium" }}>{t("Attach a picture")}</Text>
                            </Row>
                            <Row style={{ marginHorizontal: 20, marginBottom: 10 }}>

                                <Col style={{ justifyContent: 'center' }}>
                                    <Text>{this.state.photosName}</Text>
                                </Col>
                                {this.state.photosName == '' ? (
                                    <TouchableOpacity onPress={() => this.attachphoto()}>
                                        <Image source={require('../../images/Camera-icon.png')} style={styles.searchIcon} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => this.attachphoto()}>
                                        <Image source={require('../../images/Camera-Green.png')} style={styles.searchIcon} />
                                    </TouchableOpacity>
                                )}
                            </Row>
                            <LinearGradient
                                colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                style={{ marginHorizontal: 20 }}
                            >
                                <Row style={{ height: 2, }}>
                                </Row>
                            </LinearGradient>

                            {complain_title != '' && message != '' && search != '' && photosName ? (

                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: "10%", marginBottom: "10%" }} onPress={() => this.submit()}>
                                    <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']} style={{ paddingHorizontal: 10, borderRadius: 40, width: "80%", textAlign: 'center' }}>
                                        <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ paddingVertical: 20, borderRadius: 40, width: "80%", textAlign: 'center', color: "#fff", fontSize: 28, fontFamily: "Roboto-Medium" }}>{t("CONFIRMATION")}</Text>
                                        </Row>
                                    </LinearGradient>

                                </TouchableOpacity>

                            ) : (
                                <Row style={{ marginBottom: "10%", marginTop: "10%", justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ borderWidth: 1, borderColor: "#7cd36d", paddingVertical: 20, paddingHorizontal: 20, borderRadius: 40, width: "80%", textAlign: 'center', color: "#666666", fontSize: 28, fontFamily: "Roboto-Medium" }}>{t("CONFIRMATION")}</Text>
                                </Row>
                            )}

                        </ScrollView>
                    </KeyboardAvoidingView>
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
/** Render empty when no data */
const EmptyComponent = ({ title }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{title}</Text>
    </View>
);
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
                height: 80,
                // height: '18%',
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
    header: {
        ...Platform.select({
            ios: {
                marginLeft: 25
            },
            android: {
                marginLeft: 18
            }
        })

    },
    searchIcon: {
        height: 25,
        width: 25
    },
    InputCol: {
        justifyContent:'center',
        alignItems:'center',
        // marginHorizontal:10,
        
    },
})