import React, { Component } from 'react';
import { RefreshControl, StatusBar, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { getMarketPlaceSubCategoriesAdvertList } from './../../util/Action';
import Back_Arrow from './../../images/Back_Arrow.svg';
import { t } from '../../../locals';
const { width, height } = Dimensions.get('window');

export default class AdsSubCategoryAdvertList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            advertList: [],
            loader: false,
            sub_category_id:'',
            category_name:'',
            main_category_name:'',
            category_id:'',
        }
    }

    componentDidMount() {
        const sub_category_id = this.props.navigation.getParam("sub_category_id");
        const category_name = this.props.navigation.getParam("category_name");
        const main_category_name = this.props.navigation.getParam("main_category_name");
        const category_id = this.props.navigation.getParam("category_id");
        this.setState({
            sub_category_id:sub_category_id,
            category_name:category_name,
            main_category_name:main_category_name,
            category_id:category_id,
        })
        this.getMarketPlaceSubCategoriesAdvertListAction();
    }

    async getMarketPlaceSubCategoriesAdvertListAction() {
        this.setState({ loader: true });
        const sub_category_id = this.props.navigation.getParam("sub_category_id");
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        // console.log(customer_id);
        const requestData = {
            access_token: Token,
            current_user_id: customer_id,
            sub_category_id: sub_category_id,
            category_id: this.state.category_id
        }
        // console.log(requestData);
        getMarketPlaceSubCategoriesAdvertList(requestData).then(function (responseJson) {
            // console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    advertList: responseJson.result,
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

    onRefresh() {
        this.setState({ loader: true });
        this.getMarketPlaceSubCategoriesAdvertListAction();
    }

    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;

        return (
            <TouchableOpacity onPress={() => navigate("AdsAdvertProductView", { product_id: item.id, category_name: this.state.category_name, title: item.title })} style={{width: '45%',margin:10}}>
                <Col style= {styles.newsItemContainer}>
                    <Row style={{ height: 80,width:'100%' }}>
                        <Image source={{ uri: item.product_image }} style={styles.Image}/>
                    </Row>
                    <Row style={{ marginHorizontal:5, marginTop:5  }}>
                        <Text style={{color:"#000", fontFamily: 'Roboto-Regular', fontSize: 12, fontWeight:'bold'}}>{item.title}</Text>
                    </Row>
                    <Row style={{  marginHorizontal:5,}}>
                        <Text style={{ alignItems: 'center',  fontFamily: 'Roboto-Light', color:"#808080", fontSize: 11}}>{item.created_date}</Text>
                    </Row>
                </Col>
            </TouchableOpacity>
        );

    }

    render() {
        const { navigate } = this.props.navigation;
        const { advertList, loader, category_name, main_category_name } = this.state;

        if (!loader) {
            return (
       
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {/* <Row style={{ marginTop: -20, height: 120 }}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'center', padding: 20, width: 60, }} onPress={() => navigate("MarketPlaceAdsSubCategory")}>
                                <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={styles.header}>
                                <Text numberOfLines={1} style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold'  }}>{main_category_name}</Text>
                            </Col>
                        </Row>
                    </Row> */}

                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("MarketPlaceAdsSubCategory")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}> {main_category_name}</Text>
                            </View>
                        </View>
                    </Row>

                    {/* <Row style={{ height: 50, marginHorizontal: 20 }}>
                        <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text numberOfLines={1} style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium", color: "#62BB46" }}>{category_name}</Text>
                        </Col>
                       
                    </Row> */}
                    <View style={{marginHorizontal: 20, marginBottom:10, flexDirection:'row'}}>
                        <View style={{ width: "100%", justifyContent:'center', alignItems:'center' }}>
                            <Text style={{ color: "#333", fontSize: 25, fontFamily: "Roboto-Medium", color: "#62BB46" }}>{category_name}</Text>
                        </View>
                        {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                            <Green_Star />
                        </Col> */}
                    </View>
                    <LinearGradient
                        colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                        start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                        style={{ marginHorizontal: 20 }}
                    >
                        <Row style={{ height: 2, }}>
                        </Row>
                    </LinearGradient>

                    <Row style={{ }}>
                        <FlatList style={{marginTop:30}}
                            // maxToRenderPerBatch={4}
                            // columnWrapperStyle={{justifyContent: 'space-between'}}
                            onEndReachedThreshold={200}
                            // windowSize={15}
                            numColumns={2}
                            data={this.state.advertList}
                            renderItem={this.renderItem}
                            // initialNumToRender={4}
                            keyExtractor={(item) => item.id.toString()}
                            ListEmptyComponent={<EmptyComponent title={t("Data not available")} />}
                            refreshControl={
                                <RefreshControl
                                    colors={["#65be44"]}
                                    refreshing={this.state.loading}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                        />
                    </Row>
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
                left: '10%',
                padding: 20,
                // backgroundColor:'red'
            },
            android: {
                position: 'absolute',
                marginTop: sHeight * 0.21,
                left: '10%',
                padding: 20
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
    container: {
        flex: 1,
        justifyContent: 'center',
        textAlignVertical: 'center'
    },
    slide2Logo: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: 30,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
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
            },
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
        width: '100%',
        // borderRadius: 100,
        // marginLeft: 10,
        height: '100%',
    },
    newsItemContainer: {
        width:'100%',
        // margin:15,
        // marginRight:50,
        height: 150,
        backgroundColor: "white",
        shadowColor: "#333333",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 1,
        shadowRadius: 6.22,
        elevation: 5,
    },
    header:{
        ...Platform.select({
            ios:{
                marginLeft: 38 
            },
            android:{
                marginLeft: 10
                // marginLeft: width/100*1,
            }
        })
        
    }
})