import React, { Component } from 'react';
import { TextInput, Animated, TouchableHighlight, Dimensions, ActivityIndicator, RefreshControl, FlatList, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform, ClippingRectangle } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { t } from '../../../locals';
import { get_all_collection_pointsAction, get_refuiti_special_product_listAction, get_collection_points_by_productAction } from '../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import categoryIcons from './categoryIcons.js';
import Geocoder from 'react-native-geocoding';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationEvents, withNavigation } from 'react-navigation';
import MapView, { Marker, Polyline, Callout, PROVIDER_GOOGLE, ProviderPropType, AnimatedRegion } from 'react-native-maps';
import calloutImage from '../../images/Marker_dark.png'
const GOOGLE_MAPS_APIKEY = "AIzaSyDA8VzkYgIznevJNoGFt_HLxgM2cBRgQd8";
const { width, height } = Dimensions.get('window');

class ComplainMapView extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };

    constructor(props) {
        super(props);
        this.sheetRef = React.createRef(null);
        this.state = {
            markers: [],
            products: [],
            filterData: [],
            arrayholder: [],
            selectedProduct: '',
            selectedProductId: '',
            search: '',
            searchResult: 0,
            isProductSelected: 0,
            selectedMarkerIndex: '',
            selectedCityName: '',
            selectedDepartmentName: '',
            from_location_address: '',

            latitude:'',
            longitude:'',
        }
    }

    async componentDidMount() {
        const latitude = this.props.navigation.getParam("latitude");
        const longitude = this.props.navigation.getParam("longitude");

        this.setState({
            latitude: latitude,
            longitude: longitude
        })

        // let selectedCityName = await AsyncStorage.getItem('selectedCityName');
        // let selectedDepartmentName = await AsyncStorage.getItem('selectedDepartmentName');


        // this.setState({ selectedCityName: selectedCityName, selectedDepartmentName: selectedDepartmentName });

        // this.get_collection_points();
        // this.get_product_list();
    }

    async get_collection_points() {
        this.setState({ loader: true });
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const requestData = {
            access_token: Token,
            current_user_id: customer_id
        }

        get_all_collection_pointsAction(requestData).then(function (responseJson) {
            // console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    markers: responseJson.result,
                    selectedMarkerIndex: '',
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    async get_product_list() {
        this.setState({ loader: true });
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const requestData = {
            access_token: Token,
            current_user_id: customer_id
        }

        get_refuiti_special_product_listAction(requestData).then(function (responseJson) {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    products: responseJson.result,
                    arrayholder: responseJson.result,
                    loader: false,
                });
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    // /** To search product by name */
    // SearchFilterFunction(text) {

    //     // the inserted text in textinput
    //     // const newData = this.state.cityList.filter(function (item) {
    //     // 	//applying filter for the inserted text in search bar
    //     // 	const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
    //     // 	const textData = text.toUpperCase();
    //     // 	return itemData.indexOf(textData) > -1;
    //     // });
    //     let productData = this.state.arrayholder
    //     let newData = productData.filter((item) => {
    //         const itemData = item.product_name ? item.product_name.toUpperCase() : ''.toUpperCase();
    //         const textData = text.toUpperCase();
    //         return itemData.indexOf(textData) > -1;
    //     })
    //     // console.log(newData);
    //     this.setState({
    //         //setting the filtered newData on datasource
    //         //After setting the data it will automatically re-render the view
    //         filterData: newData,
    //         products: newData,
    //         search: text,
    //         searchResult: 1,
    //         selectedProduct: "",
    //         isProductSelected: 0,
    //         selectedProductId: 0,
    //     });
    //     if (!text.length) {
    //         this.get_collection_points();
    //     }
    // }

    // async getFilterProductCollection() {
    //     this.setState({ loader: true });

    //     let customer_id = await AsyncStorage.getItem('userid');
    //     let Token = await AsyncStorage.getItem('token');
    //     const requestData = {
    //         access_token: Token,
    //         current_user_id: customer_id,
    //         product_id: this.state.selectedProductId
    //     }

    //     get_collection_points_by_productAction(requestData).then(function (responseJson) {
    //         console.log(responseJson)
    //         if (responseJson.status == 1) {
    //             this.setState({
    //                 markers: responseJson.result,
    //                 selectedMarkerIndex: '',
    //                 loader: false,
    //             });
    //         } else {
    //             this.setState({ loader: false });
    //             // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
    //         }
    //     }.bind(this));
    // }

    onRefresh() {
        this.setState({ loader: true });
        this.getgarbage_category_list();
    }

    // async onPressMarker(e, latitude, longitude) {
    //     Geocoder.init(GOOGLE_MAPS_APIKEY);
    //     await Geocoder.from(latitude, longitude)
    //         .then(json => {
    //             var from_location_address = json.results[0]['formatted_address'];
    //             this.setState({ from_location_address : from_location_address });
    //             // console.log(from_location_address)
    //         })
    //         .catch(error => console.warn(error));
    //     this.setState({ selectedMarkerIndex: latitude });
    // }

    // renderItem = ({ item }) => {
    //     return (
    //         <View>
    //             <TouchableOpacity onPress={() => this.setState({ search: item.product_name, selectedProductId: item.id, selectedCity: item.product_name, searchResult: 0, isProductSelected: 1 })}>
    //                 <View>
    //                     <Text style={{ padding: 10, fontSize: 15, color: '#62bb46', fontFamily: 'Roboto-Medium' }}>{item.product_name}</Text>
    //                 </View>

    //             </TouchableOpacity>
    //             <LinearGradient
    //                 colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
    //                 start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
    //             >
    //                 <Row style={{ height: 1 }}>
    //                 </Row>
    //             </LinearGradient>
    //         </View>

    //     )

    // }

    render() {
        // const sheetRef = React.createRef(null);
        const { navigate } = this.props.navigation;
        const { dataSource, loader, search, markers, products, latitude, longitude } = this.state;
        
        let markerID = [latitude];
        // markers.map(data => (
        //     data.des_lat_long.map(marker => (
        //         markerID.push(marker.latitude)
        //     ))
        // ))

        if (!loader) {
            return (
                <View style={{ flex: 1, backgroundColor: '#FFFFFF', position: 'absolute' }}>
                    <Row style={styles.Header}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'center', padding: 20, width: 60, }} onPress={() => navigate("ComplainView")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={{ marginLeft: 30 }}>
                                <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold' }}>{t("Maps")}</Text>
                            </Col>
                        </Row>
                    </Row>
                    <Row style={{ zIndex: 0, top: -50 }}>
                        <MapView
                            style={styles.map}
                            // provider={PROVIDER_GOOGLE}
                            provider={this.props.provider}
                            showsUserLocation={this.state.enableCurruntLocation}
                            // showsUserLocation={true}
                            followUserLocation={this.state.followsUserLocation}
                            // onUserLocationChange={event => console.log(event.nativeEvent)}
                            pitchEnabled={true}
                            showsBuildings={true}
                            maxZoomLevel={15}
                            ref={c => this.mapRef = c}
                            zoomEnabled={true}
                            onMapReady={() => {
                                this.mapRef.fitToSuppliedMarkers(markerID, {
                                    edgePadding:
                                    {
                                        top: 50,
                                        right: 50,
                                        bottom: 50,
                                        left: 50
                                    }

                                })
                            }}
                        >
                            {/* <MapView.Marker
                                coordinate={{ latitude: Number(23.044092), longitude: Number(72.616861) }}
                            // title={marker.description}
                            >
                                < Image source={require('../../images/Marker_dark.png')} style={{ width: 50, height: 50 }} />
                                <MapView.Callout tooltip={true}>
                                    <View style={styles.calloutHeader}>

                                    </View>
                                </MapView.Callout>
                            </MapView.Marker> */}

                            {latitude !== '' ? (
                                    <MapView.Marker
                                        coordinate={{ latitude: Number(latitude), longitude: Number(longitude) }}
                                        // title={marker.description}
                                        identifier={latitude}
                                        // onPress={(e) => this.onPressMarker(e, latitude, marker.longitude)}
                                    >
                                        < Image source={require('../../images/Marker_dark.png')} style={{ width: 50, height: 50 }} />
                                    </MapView.Marker>
                                ):(
                                    <View></View>
                                )}
                            
                        </MapView>
                    </Row>
                    
                </View >
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
ComplainMapView.propTypes = {
    provider: ProviderPropType,
};
export default withNavigation(ComplainMapView);

// empty component
const EmptyComponent = ({ title }) => (

    <View style={styles.emptyContainer}>

        <Text style={styles.emptyText}>{title}</Text>

    </View>

);
const styles = StyleSheet.create({
    Header: {
        ...Platform.select({
            ios: {
                marginTop: -5,
                height: 102,
                zIndex: 1
            },
            android: {
                marginTop: -20, 
                height: 102, 
                zIndex: 1
            }
        })

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
                marginLeft: 75
            },
            android: {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                height: 50,
                width: '100%',
                marginLeft: 90
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
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    searchIcon: {
        height: 50,
        width: 50
    },
    Headertext: {
        ...Platform.select({
            ios: {
                marginLeft: 80
            },
            android: {
                marginLeft: 90
            }
        })
    },
    searchResult: {
        ...Platform.select({
            ios: {
                // position: 'absolute',
                width: '100%',
                // marginTop: '40%'
            },
            android: {
                // position: 'absolute',
                width: '100%',
                // marginTop: '42%'
            }
        })
    },
    calloutHeader: {
        ...Platform.select({
            ios: {
                height: 250,
                width: 350,
                borderRadius: 5,
                backgroundColor: "#ffffff",
                shadowColor: "#333333",
                shadowOffset: { width: 0, height: 1, },
                shadowOpacity: 1,
                elevation: 5,
                paddingHorizontal: 10,
            },
            android: {
                marginBottom: 20,
                height: 250,
                width: 300,
                borderRadius: 20,
                backgroundColor: "#ffffff",
                shadowColor: "#333333",
                shadowOffset: { width: 0, height: 1, },
                shadowOpacity: 1,
                elevation: 5,
                paddingHorizontal: 10,
            }
        })
    }
})


