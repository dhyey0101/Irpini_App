import React, { Component } from 'react';
import { Dimensions, StatusBar, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Platform, FlatList, TextInput, ScrollView } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from './../../images/logo.svg';
import { t } from '../../../locals';
// import Autocomplete from 'react-native-autocomplete-input';
// import { ScrollView } from 'react-native-gesture-handler';
import { city_listAction, assign_city_userAction } from './../../util/Action';
import DropdownAlert from 'react-native-dropdownalert';

export default class City extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    constructor(props) {
        super(props);
        this.arrayholder = '';
        this.state = {
            List: [],
            cityList: [],
            filterData: [],
            arrayholder: [],
            selectedCity: '',
            selectedCityId: '',
            search: '',
            searchResult: 0,
            isCitySelected: 0,
        }
    }

    componentDidMount() {
        this.CityList()
    }

    // logout = async () => {
    //     await AsyncStorage.removeItem('userid');
    //     await AsyncStorage.removeItem('name');
    //     await AsyncStorage.removeItem('token');
    //     await AsyncStorage.removeItem('email');
    //     this.props.navigation.navigate('Auth');
    // };

    async CityList() {
        const { cityList } = this.state;
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
                }, function () {
                    // this.arrayholder = responseJson.result;
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    async assignCity(city_name, cityId) {

        this.setState({ loader: true });
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        let selectedCity = cityId;

        this.setState({ 
            search: city_name,
            selectedCityId: cityId,
            selectedCity: city_name,
            searchResult: 0,
            isCitySelected: 1,
            scrollEnabled: true })

        const CityData = {
            access_token: Token,
            current_user_id: customer_id,
            city_id: selectedCity
        }
        // console.log(CityData);
        var response = assign_city_userAction(CityData, Token).then(function (responseJson) {
            console.log(responseJson);
            if (responseJson.status == 1) {
                if (responseJson.result.has_department == 1) {
                    AsyncStorage.setItem('selectedCityName', this.state.selectedCity);
                    AsyncStorage.setItem('selectedCityId', selectedCity)
                        .then((val) => {
                            setTimeout(() => {
                                this.props.navigation.navigate('DepartmentSelection', { city_id: selectedCity });
                                this.setState({ loader: false });
                            }, 5000);
                        })
                } else {
                    
                    AsyncStorage.setItem('selectedCityName', this.state.selectedCity);
                    AsyncStorage.setItem('selectedCityId', selectedCity)
                        .then((val) => {
                            setTimeout(() => {
                                this.props.navigation.navigate('Waste');
                                this.setState({ loader: false });
                            }, 5000);
                        })
                }
            } else {
                this.setState({ loader: false });
                this.props.navigation.navigate("Login")
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    /** To search truck owner by name */
    SearchFilterFunction(text) {

        // the inserted text in textinput
        // const newData = this.state.cityList.filter(function (item) {
        // 	//applying filter for the inserted text in search bar
        // 	const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        // 	const textData = text.toUpperCase();
        // 	return itemData.indexOf(textData) > -1;
        // });

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
                <TouchableOpacity onPress={() => this.assignCity(item.city_name, item.id, item.city_name)}>
                    <View>
                        <Text style={{ padding: 10, fontSize: 15, color: '#62bb46', fontFamily: 'Roboto-Medium' }}>{item.city_name}</Text>
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

    navigateToNext() {
        this.setState({ loader: true });
        AsyncStorage.setItem('selectedCityId', this.state.selectedCityId)
            .then((val) => {
                setTimeout(() => {
                    this.props.navigation.navigate('Waste');
                }, 5000);
            })
    }

    render() {
        const { cityList, selectedCity, loader } = this.state;
        if (!loader) {
            return (
                <View style={styles.slide1}>
                    <StatusBar />
                    {/* <KeyboardAvoidingView
                        keyboardVerticalOffset={Platform.select({ ios: 0, android: 10 })} behavior="margin"> */}
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <Logo width={120} height={120} style={styles.headerLogo} />
                            </View>
                        </View>
                    </Row>

                    <KeyboardAvoidingView style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "height" : "padding"}>
                        {/* <ScrollView scrollEnabled={this.state.scrollEnabled} keyboardShouldPersistTaps='always'> */}
                            <Row style={styles.splashScreenRow}>
                                <Image source={require('../../images/City-Background.png')} style={styles.CityImage} />
                                {/* <Col style={styles.slide2Logo}>
                                    <Logo width={120} height={120} />
                                </Col> */}
                            </Row>



                            <View style={{ borderRadius: 8, justifyContent: 'center', position: 'absolute', width: '100%',bottom:30 }}>
                                <Row style={{ height: 50, marginTop: 40 }}>
                                    <Col style={styles.Slide2TextRow}>
                                        <Text style={styles.textSlide2}>{t("Select your municipality")}</Text>
                                    </Col>
                                </Row>
                                {(this.state.search != '' && this.state.searchResult != 0) &&
                                    <View style={styles.searchResult}>
                                        <Row style={{ backgroundColor: '#ffffff', paddingVertical: 15, marginRight: 20, marginLeft: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 20, borderColor: 'green', borderWidth: 1, maxHeight: 150 }}>
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

                                <LinearGradient colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']} style={{ padding: 2, marginRight: 20, marginLeft: 20, borderRadius: 8, borderColor: 'red', height: 80 }}>
                                    <Row style={{ borderRadius: 8, backgroundColor: '#ffffff', justifyContent: 'center' }}>
                                        <Col style={{ width: '80%', padding: 5, justifyContent: 'center' }}>
                                            <TextInput style={{ width: '100%', padding: 5, fontFamily: 'Roboto-Medium', fontSize: 16, color: '#62bb46' }}
                                                placeholder={t("Type")}
                                                placeholderTextColor='#62bb46'
                                                onChangeText={(text) => this.SearchFilterFunction(text)}
                                                value={this.state.search}>
                                            </TextInput>
                                        </Col>
                                        <Col style={{ width: '20%', padding: 5, justifyContent: 'center', }}>
                                            {this.state.isCitySelected == 0 ? (
                                                <Image source={require('../../images/surface1.png')} style={styles.searchIcon} />) :
                                                (
                                                    <TouchableOpacity onPress={() => this.assignCity()}>
                                                        <Image source={require('../../images/surface2.png')} style={styles.searchIcon} />
                                                    </TouchableOpacity>
                                                )}
                                        </Col>
                                    </Row>
                                </LinearGradient>
                            </View>
                            <DropdownAlert ref={ref => this.dropdown = ref} />
                        {/* </ScrollView> */}
                    </KeyboardAvoidingView>
                </View>

            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Image source={require('../../images/City-Selection.gif')} style={{ height: "100%", width: "100%" }} />
                </View>
            )
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
                backgroundColor:'#EAFCFC',
                zIndex:1
            },
            android: {
                width: sWidth,
                // height: 90,
                height: '16%',
                backgroundColor:'#EAFCFC',
                zIndex:1
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
    slide1: {
        flex: 1,
        backgroundColor: '#fff',
        // height: Dimensions.get("window").height,
    },
    slide2Logo: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: -30,
                width: '100%',
                alignItems: 'center'
            },
            android: {
                position: 'absolute',
                marginTop: -30,
                width: '100%',
                alignItems: 'center'
            }
        })
    },
    CityImage: {
        ...Platform.select({
            ios: {
                width: Dimensions.get("window").width,
                height: '100%',
            },
            android: {
                width: Dimensions.get("window").width,
                height: '100%',
            }
        })
    },
    Slide2TextRow: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',
                alignItems: 'center',
                width: "80%",
                // marginTop: "10%",
                // paddingTop: 90
            },
            android: {
                justifyContent: 'center',
                alignItems: 'center',
                width: "80%",
                // paddingTop: 30

            }
        })
    },
    textSlide2: {
        color: '#62bb46',
        fontSize: 24,
        fontFamily: 'Roboto-Bold'
    },
    subtextSlide: {
        color: '#666666',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Roboto-Light'
    },
    splashScreenRow: {
        ...Platform.select({
            ios: {
                // paddingTop: 30,
                // backgroundColor: "#62bb46",
                // height: 50
                height: Dimensions.get("window").height * 60 / 100,
            },
            android: {
                height: Dimensions.get("window").height * 60 / 100,
            }
        })
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    searchIcon: {
        height: 50,
        width: 50
    },
    searchResult: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                width: '100%',
                bottom: 80
            },
            android: {
                position: 'absolute',
                width: '100%',
                bottom: 80
            }
        })
    }
})