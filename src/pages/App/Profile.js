import React, { Component } from 'react';
import { Animated, Dimensions, TouchableHighlight, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform, ActivityIndicator } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import Camero from './../../images/Camero.svg';
import Back_Arrow from './../../images/Back_Arrow.svg';
import Eye_Gray from './../../images/Eye_Gray.svg';
import Eye_Green from './../../images/Eye_Green.svg';
import Redirect_Arrow_Gray from './../../images/Redirect_Arrow_Gray.svg';
import Profile_Pic from './../../images/Profile.svg';
import { t } from '../../../locals';
import TextInput from 'react-native-material-textinput';
import DropdownAlert from 'react-native-dropdownalert';
import { ScrollView } from 'react-native-gesture-handler';
import validate from 'validate.js';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from "expo-permissions";
import * as ImageManipulator from 'expo-image-manipulator';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { department_listAction, city_listAction, user_profile_updateAction, get_user_detailsAction, favourite_product_category_listAction } from './../../util/Action';
import BottomSheet from 'reanimated-bottom-sheet';

const { width, height } = Dimensions.get('window');

export default class Profile extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    constructor(props) {
        super(props);
        this.sheetRef = React.createRef(null);
        this.state = {
            hasCameraPermission: null,
            loader: false,
            name: '',
            email: '',
            modalVisible: true,
            passwordshow: true,
            Create_password: '',
            Confirm_password: '',
            userDetails: [],
            attachphoto: '',
            attachphotoBase64: '',
            attachphotoStatus: 0,
            ImageLoading: true,
            photosName: '',
            favourite_product: [],
            category_id_name: [],
            category_id: [],
            opacity: new Animated.Value(0),
            isOpen: true,
            city_id: '',
            department_id: '',
            cityList: [],
            departmentCollapsed: false,
            cityCollapsed: false,

            departmentList: [],
            selectedDepartmentName: '',
            selectedDepartmentId: '',
            isDepartmentSelected: 0,


            ServiceTypeSelected: '',
            ServiceTypeSelectedName: ''

        }
    }

    async componentDidMount() {
        const { navigation } = this.props;
        this.setState({ loader: true })
        this.getPermissionAsync();
        this.userDetail();
        this.favourite_product();
        this.CityList();
        this.departmentList();

        // this.onOpen();

        this.focusListener = navigation.addListener("didFocus", () => {
            // alert("focus")
            this.userDetail();
            this.favourite_product();
            this.CityList()
            this.departmentList();
            // this.onOpen();
        });
        this.setState({ loader: false })
    }
    async componentWillUnmount() {
        this.setState({ loader: true })
        this.focusListener.remove();
        this.setState({ loader: false })
    }

    async CityList() {
        const { cityList } = this.state;
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const CityData = {
            access_token: Token,
            current_user_id: customer_id
        }
        var response = city_listAction(CityData, Token).then(function (responseJson) {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    cityList: responseJson.result,
                    // arrayholder: responseJson.result,
                    loader: false
                }, function () {
                    // this.arrayholder = responseJson.result;
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    async departmentList() {

        let customer_id = await AsyncStorage.getItem('userid');
        let selectedCityId = await AsyncStorage.getItem('selectedCityId');
        let Token = await AsyncStorage.getItem('token');
        const departmentData = {
            access_token: Token,
            current_user_id: customer_id,
            city_id: selectedCityId
        }
        // console.log(departmentData);
        var response = department_listAction(departmentData, Token).then(function (responseJson) {
            // console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    departmentList: responseJson.result,
                    // arrayholder: responseJson.result,
                    loader: false
                }, function () {
                    // this.arrayholder = responseJson.result;
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }


    // onClose = () => {
    //     Animated.timing(this.state.opacity, {
    //         toValue: 0,
    //         duration: 350,
    //         useNativeDriver: true,
    //     }).start();
    //     this.sheetRef.current.snapTo(0);
    //     setTimeout(() => {
    //         this.setState({ isOpen: false });
    //     }, 50);
    // };

    // onOpen = () => {
    //     this.setState({ isOpen: true });
    //     this.sheetRef.current.snapTo(2);
    //     Animated.timing(this.state.opacity, {
    //         toValue: 0.7,
    //         duration: 300,
    //         useNativeDriver: true,
    //     }).start();
    // };

    // renderBackDrop = () => (
    //     <Animated.View
    //         style={{
    //             opacity: this.state.opacity,
    //             backgroundColor: '#000',
    //             position: 'absolute',
    //             top: 0,
    //             left: 0,
    //             right: 0,
    //             bottom: 0,
    //         }}>
    //         <TouchableOpacity
    //             style={{
    //                 width: width,
    //                 height: height,
    //                 backgroundColor: 'transparent',
    //             }}
    //             activeOpacity={1}
    //             onPress={this.onClose}
    //         />
    //     </Animated.View>
    // );

    async getPermissionAsync() {
        // Camera roll Permission
        if (Platform.OS === "ios") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (status !== "granted") {
                alert("Sorry, we need camera roll permissions to make this work!");
            }
        }
        // Camera Permission
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === "granted" });
    }

    /* hide and show password */
    getPasswordshow = () => {
        if (this.state.passwordshow == true) {
            this.setState({ passwordshow: false })
        } else {
            this.setState({ passwordshow: true })
        }
    }

    async userDetail() {
        this.setState({ loader: true })
        const { userDetails } = this.state;
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const userData = {
            access_token: Token,
            current_user_id: customer_id
        }
        // console.log(userData)
        // this.setState({ loader: true })
        get_user_detailsAction(userData).then(function (responseJson) {
            // console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    userDetails: responseJson.result,
                    name: responseJson.result.display_name,
                    role: responseJson.result.role,
                    email: responseJson.result.email,
                    attachphoto: responseJson.result.user_image,


                    ServiceTypeSelected: responseJson.result.city_id,
                    ServiceTypeSelectedName: responseJson.result.city_name,
                    selectedDepartmentId: responseJson.result.department_id,
                    selectedDepartmentName: responseJson.result.department_name,
                    loader: false,
                });
                if (responseJson.result.user_image != '') {
                    this.setState({
                        attachphotoStatus: 1,
                        loader: false,
                    })
                }
                // console.log(this.state.attachphoto);
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }
    async favourite_product() {
        this.setState({ loader: true })
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const favourite_product_Data = {
            access_token: Token,
            current_user_id: customer_id
        }
        // this.setState({ loader: true })
        favourite_product_category_listAction(favourite_product_Data, Token).then((responseJson) => {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    favourite_product: responseJson.result,
                    category_id_name: responseJson.result.category_id_name,
                    category_id: responseJson.result.category_id,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        });
    }

    async submit() {
        const { navigate } = this.props.navigation;
        if (this.state.Create_password == '') {
            if (this.state.departmentList.length) {
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
                    department: {
                        presence: {
                            allowEmpty: false,
                            message: "^" + t("select the department")
                        },
                    },
                };
                const result = validate({ name: this.state.name, email: this.state.email, department: this.state.selectedDepartmentId }, constraints);
                if (result) {

                    if (result.name) {
                        this.dropdown.alertWithType('error', t('Error'), (result.name));
                        return false;
                    }
                    if (result.email) {
                        this.dropdown.alertWithType('error', t('Error'), (result.email));
                        return false;
                    }
                    if (result.department) {
                        this.dropdown.alertWithType('error', t('Error'), (result.department));
                        return false;
                    }

                }
            } else {

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
                    }
                };
                const result = validate({ name: this.state.name, email: this.state.email }, constraints);
                if (result) {

                    if (result.name) {
                        this.dropdown.alertWithType('error', t('Error'), (result.name));
                        return false;
                    }
                    if (result.email) {
                        this.dropdown.alertWithType('error', t('Error'), (result.email));
                        return false;
                    }

                }
            }
        } else {
            if (this.state.departmentList.length) {
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
                    },
                    department: {
                        presence: {
                            allowEmpty: false,
                            message: "^" + t("select the department")
                        },
                    },
                };
                const result = validate({ name: this.state.name, email: this.state.email, Create_password: this.state.Create_password, Confirm_password: this.state.Confirm_password, department: this.state.selectedDepartmentId }, constraints);
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
                    if (result.department) {
                        this.dropdown.alertWithType('error', t('Error'), (result.department));
                        return false;
                    }

                }
            } else {
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
            }

        }

        this.setState({ loader: true });
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        // console.log(customer_id);
        const registrationData = {
            access_token: Token,
            current_user_id: customer_id,
            display_name: this.state.name,
            email: this.state.email,
            password: this.state.Create_password,
            user_image: this.state.attachphotoBase64,
            city_id: this.state.ServiceTypeSelected,
            department_id: this.state.selectedDepartmentId

        }
        // console.log(registrationData)
        // const TokenData = {
        //         access_token: Token,   
        //     }

        // const formData = new FormData();
        // formData.append('access_token', Token);
        // formData.append('current_user_id', customer_id);
        // formData.append('display_name', this.state.name);
        // formData.append('email', this.state.email);
        // formData.append('user_pass', this.state.Create_password);
        // formData.append("user_image", {
        //     uri: this.state.attachphoto,
        //     name: "image.jpg",
        //     type: "image/jpg",
        // }),

        console.log(registrationData);
        // user_profile_updateAction(formData).then(function (responseJson) {
        user_profile_updateAction(registrationData).then(function (responseJson) {
            // console.log(responseJson);

            if (responseJson.status == 1) {
                AsyncStorage.setItem('selectedCityId', this.state.ServiceTypeSelected);
                AsyncStorage.setItem('selectedDepartmentId', this.state.selectedDepartmentId);
                this.setState({ loader: false, Create_password: '', Confirm_password: '' });
                this.dropdown.alertWithType('success', t('Success'), (responseJson.error));
            } else {
                setTimeout(() => {
                    this.setState({ loader: false });
                    this.dropdown.alertWithType('error', t('Error'), (responseJson.error));
                }, 3000);
            }

        }.bind(this));


        //  const responseJson = await user_profile_updateAction(
        //     formData, Token
        //   );

        //   console.log("Response Arjun " +responseJson)
        // if (responseJson.status == 1) {
        //     console.log(responseJson);
        //     storage.storeUserDetail(responseJson.result).then((data) => {
        //         setTimeout(() => {
        //             this.setState({ loader: false });
        //             navigate('App');
        //         }, 3000);
        //     })
        //         .catch((err) => {
        //             console.log(err)
        //         });
        // } else {
        //     setTimeout(() => {
        //         this.setState({ loader: false });
        //         this.dropdown.alertWithType('error', t('Error'), (responseJson.error));
        //     }, 3000);
        // }
    }
    async attachphoto() {

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });
        if (result) {
            this.setState({ ImageLoading: true })
            const manipResult = await ImageManipulator.manipulateAsync(result.uri,
                [{ resize: { height: 1024 } }],
                { compress: 0, format: ImageManipulator.SaveFormat.PNG, base64: true }
            );

            this.setState({
                attachphoto: manipResult.uri,
                attachphotoBase64: manipResult.base64,
                attachphotoStatus: 1,
                ImageLoading: true
            });
        }

    }

    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;

        return (
            <TouchableOpacity onPress={() => navigate("FavouriteList", { category_id: item.category_id, category_name: item.category_name, selectedCategoryImage: item.cat_image })}>
                <Row style={{ marginLeft: 30, marginRight: 30, marginTop: 10 }}>
                    <Col style={{ width: "70%" }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Roboto-Medium', color: '#4D4D4D' }}>{item.category_name}</Text>
                    </Col>
                    <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Redirect_Arrow_Gray />
                    </Col>
                </Row>
                <LinearGradient style={{ marginTop: 5, marginLeft: 30, marginRight: 30 }}
                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                >
                    <Row style={{ height: 2, }}>
                    </Row>
                </LinearGradient>
            </TouchableOpacity>
        );

    }
    onRefresh() {
        this.setState({ loader: true });
    }
    _onLoadEnd = () => {
        this.setState({
            ImageLoading: false
        });
    }
    logout = async () => {
        await AsyncStorage.removeItem('userid');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('token');
        // await AsyncStorage.removeItem('email');
        this.props.navigation.navigate('Auth');

    };

    async SelectedService(item_id, city_name) {
        this.setState({ loader: true });
        this.setState({

            ServiceTypeSelected: item_id,
            ServiceTypeSelectedName: city_name,
            cityCollapsed: false,
            loader: false,
            selectedDepartmentId: '',
            selectedDepartmentName: '',
            departmentList: []
        })
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const departmentData = {
            access_token: Token,
            current_user_id: customer_id,
            city_id: item_id,
        }
        // console.log(departmentData);
        var response = department_listAction(departmentData, Token).then(function (responseJson) {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    departmentList: responseJson.result,
                    // arrayholder: responseJson.result,
                    loader: false
                });
                // console.log("Department data "+responseJson.result)

            } else {
                this.setState({ loader: false, departmentList: responseJson.result, });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }
    async selectedDepartment(item_id, item_department_name) {
        this.setState({ loader: true });
        this.setState({
            selectedDepartmentId: item_id,
            selectedDepartmentName: item_department_name,
            departmentCollapsed: false,
            loader: false
            // getCapacity: [],

        })
    }


    render() {
        const { navigate } = this.props.navigation;
        const { cityCollapsed, ServiceTypeSelected, selectedDepartmentId, attachphotoStatus, name, email, Create_password, Confirm_password, loader, attachphoto, role, collapsed, departmentList } = this.state

        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>

                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("Sidemenu")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{t("Profile")}</Text>
                            </View>
                        </View>
                    </Row>
                    <Row style={styles.seconddiv}>
                        <Col style={{ height: 130, width: 130, borderRadius: 110, justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                            {/* <Image source={attachphoto ? {uri:attachphoto}:<Profile_Pic />} style={styles.profile} /> */}
                            {attachphotoStatus == 1 ? (
                                <View><Image
                                    onLoadStart={(e) => this.setState({ ImageLoading: true })}
                                    onLoadEnd={(e) => this.setState({ ImageLoading: false })}
                                    // source={attachphoto ? { uri: attachphoto } : null} style={styles.profile} />
                                    source={attachphoto ? { uri: attachphoto } : null} style={styles.profile} />
                                    {/* source={{ uri: attachphoto }} style={styles.profile} /> */}
                                    <ActivityIndicator
                                        style={styles.activityIndicator}
                                        animating={this.state.ImageLoading}
                                        size="small"
                                        color="#65be44"
                                    />
                                </View>
                            ) : (
                                <Profile_Pic />
                            )}

                            <TouchableOpacity style={{ zIndex: 9999, position: 'absolute' }} onPress={() => this.attachphoto()}>
                                <Image source={require('../../images/Camera-icon.png')} style={styles.searchIcon} />
                            </TouchableOpacity>

                        </Col>

                    </Row>
                    <KeyboardAvoidingView behavior={Platform.select({ android: 'height', ios: 'padding' })} style={{ flex: 1 }} >

                        <ScrollView>
                            {role == "person" ? (
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
                                    maxLength={30}
                                    labelActiveColor={"#666666"}
                                    underlineColor={"#67c46a"}
                                    underlineActiveColor={"#67c46a"}
                                    editable={false}
                                    onChangeText={email => this.setState({ email: email })}
                                />
                            </Col>
                            <Row style={styles.InputCol}>
                                <Col style={{ width: '100%' }}>
                                    <TextInput
                                        label={<Text style={{ fontFamily: "Roboto-Medium" }}>{t("Modify Password")}</Text>}
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


                            <Collapse style={styles.service_colls}
                                isExpanded={this.state.cityCollapsed}
                                onToggle={(isCollapsed) => this.setState({ cityCollapsed: isCollapsed })}>
                                <CollapseHeader>

                                    <Row style={{ marginVertical: 10 }}>

                                        <Col>
                                            {ServiceTypeSelected ? (
                                                <View><Text style={{ fontFamily: "Roboto-Light", fontSize: 16, paddingVertical: 3 }}>{t('Common Change')}</Text>
                                                    <Text style={{ fontFamily: "Roboto-Medium", color: '#4d4d4d', }}>{this.state.ServiceTypeSelectedName}</Text></View>
                                            ) : (
                                                <Text style={{ fontFamily: "Roboto-Medium" }}>{t('Common Change')}</Text>
                                            )}

                                        </Col>
                                        <Col style={{ alignItems: 'flex-end', marginRight: 3, marginTop: '10%' }}>
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
                                        <TouchableOpacity onPress={() => this.SelectedService(item.id, item.city_name)}>

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
                            {
                                (this.state.departmentList != '') ? (<Collapse style={styles.service_colls}
                                    isExpanded={this.state.departmentCollapsed}
                                    onToggle={(isCollapsed) => this.setState({ departmentCollapsed: isCollapsed })}>
                                    <CollapseHeader>

                                        <Row style={{ marginVertical: 10 }}>

                                            <Col>
                                                {selectedDepartmentId ? (
                                                    <View><Text style={{ fontFamily: "Roboto-Light", fontSize: 16, paddingVertical: 3 }}>{t('Common Change')}</Text><Text style={{ fontFamily: "Roboto-Medium" }}>{this.state.selectedDepartmentName}</Text></View>
                                                ) : (
                                                    <Text style={{ fontFamily: "Roboto-Medium" }}>{t('Department')}</Text>
                                                )}

                                            </Col>
                                            <Col style={{ alignItems: 'flex-end', marginRight: 3, marginTop: '10%' }}>
                                                {collapsed == true ? (
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

                                    <CollapseBody style={{ marginLeft: 20, paddingBottom: 10 }}>

                                        {this.state.departmentList.map(((item) => (
                                            <TouchableOpacity onPress={() => this.selectedDepartment(item.id, item.department_name)}>

                                                <View style={{ flexDirection: 'row', }}>
                                                    {/* <ScrollView> */}
                                                    <Row style={{ marginTop: 15 }}>

                                                        <Text style={{ fontFamily: "Roboto-Medium", color: '#4d4d4d', fontSize: 16 }}>{item.department_name}</Text>
                                                        {/* <Text>{item.type}</Text>  */}
                                                    </Row>
                                                </View>
                                            </TouchableOpacity>
                                        )))}
                                    </CollapseBody>

                                </Collapse>) : (<View></View>)
                            }



                            <Row style={{ marginTop: 10 }}>
                                <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']} style={styles.submitLinearColor}>
                                    <TouchableOpacity onPress={() => this.submit()} style={styles.submit}>
                                        <Text style={{ padding: 5, fontSize: 20, fontFamily: 'Roboto-Regular', color: '#666666' }}>{t('SAVE')}</Text>
                                    </TouchableOpacity>

                                </LinearGradient>
                            </Row>
                            <Row style={{ marginLeft: 30, marginTop: 10, }}>
                                <Text style={{ fontFamily: "Roboto-Medium", color: '#666666', fontSize: 16 }}>{t('Favorites')}</Text>
                            </Row>
                            {/* {this.state.favourite_product.map(((item) => (
                            <TouchableOpacity>
                                <Row style={{ marginLeft: 30, marginRight: 30, marginTop: 10 }}>
                                    <Col>
                                        <Text>{item.category_name}</Text>
                                    </Col>
                                    <Col style={{ alignItems: 'flex-end' }}>
                                        <Redirect_Arrow_Gray />
                                    </Col>
                                </Row>
                                <LinearGradient style={{ marginLeft: 30, marginRight: 30 }}
                                    colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                                    start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                                >
                                    <Row style={{ height: 2, }}>
                                    </Row>
                                </LinearGradient>
                            </TouchableOpacity>
                        )))} */}
                            <FlatList style={styles.FlatList}
                                // maxToRenderPerBatch={4}
                                onEndReachedThreshold={200}
                                // windowSize={15}
                                data={this.state.category_id_name}
                                renderItem={this.renderItem}
                                // initialNumToRender={4}
                                keyExtractor={(item) => item.category_id.toString()}
                                ListEmptyComponent={<EmptyComponent title={t("Data not available")} />}
                                refreshControl={
                                    <RefreshControl
                                        colors={["#d62326"]}
                                        refreshing={this.state.loading}
                                        onRefresh={this.onRefresh.bind(this)}
                                    />
                                }
                            />

                        </ScrollView>
                    </KeyboardAvoidingView>

                    {/* {this.state.isOpen && this.renderBackDrop()} */}

                    {/* <BottomSheet
                        ref={this.sheetRef}
                        enabledContentGestureInteraction={false}
                        renderContent={this.renderContent}

                        snapPoints={[
                            ...Platform.select({ 
                                ios:[
                                    '-10%',
                                    height * 0.5,
                                    snap,
                                    height * 0.85,
                                ],
                                android:[
                                    '-10%',
                                    height * 0.5,
                                    snap,
                                    height * 0.85,
                                ]
                            })
                            
                        ]}
                        initialSnap={0}
                        onCloseEnd={this.onClose}
                    /> */}

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
// empty component
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
        width: sWidth,
        height: 90,
        backgroundColor: '#fff'
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
    seconddiv: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                height: 145,
                marginTop: 30,
            },
            android: {
                justifyContent: 'center',
                height: 145,
            }
        })

    },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: "20%",
        // marginTop: height - (height * 40) / 100,

    },
    emptyText: {
        // flex: 1,
        justifyContent: "center",
        fontSize: 23,
        alignItems: 'center',
    },
    slide2Logo: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: 30,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 62
            },
            android: {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                height: 50,
                width: '100%',
                marginLeft: 80
            }
        })
    },
    InputCol: {
        marginRight: 30,
        marginLeft: 30,
    },
    FlatList: {
        ...Platform.select({
            ios: {
                width: '98%',
                height: "88%",
            },
            android: {
                width: '98%',
                height: "95%"
            }
        })
    },
    profile: {
        // borderRadius: 100,
        // marginLeft: 10,
        height: 130,
        width: 130,
        borderRadius: 110,
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
    submitLinearColor: {
        ...Platform.select({
            ios: {
                padding: 1,
                marginLeft: 30,
                borderRadius: 18
            },

            android: {
                padding: 1,
                marginLeft: 30,
                borderRadius: 30
            }
        })
    },
    submit: {
        ...Platform.select({
            ios: {
                backgroundColor: '#ffffff',
                borderRadius: 30,
                paddingHorizontal: 20,

            },
            android: {
                backgroundColor: '#ffffff',
                borderRadius: 30,
                paddingHorizontal: 20,
                paddingVertical: 5
            }
        })
    },
    header: {
        ...Platform.select({
            ios: {
                marginLeft: 40
            },
            android: {
                marginLeft: 15
            }
        })

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
    searchIcon: {
        height: 25,
        width: 25,
        marginBottom: 5,
        marginRight: 10
    },
    service_colls: {
        borderBottomWidth: 1,
        borderColor: '#65be44',
        // marginTop:10,
        marginHorizontal: 30,
        // borderRadius: 30,
    },
})