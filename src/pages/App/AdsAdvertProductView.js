import React, { Component } from "react";
import {
  RefreshControl,
  StatusBar,
  KeyboardAvoidingView,
  AsyncStorage,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Linking,
} from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { LinearGradient } from "expo-linear-gradient";
import { getMarketPlaceSubCategoriesAdvertProductView } from "./../../util/Action";
import Back_Arrow from "./../../images/Back_Arrow.svg";
import { ScrollView } from "react-native-gesture-handler";
import { t } from "../../../locals";
import { SliderBox } from "react-native-image-slider-box";
import TextInputMaterial from "react-native-material-textinput";
import HTML from "react-native-render-html";
const { width, height } = Dimensions.get("window");

export default class AdsAdvertProductView extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loader: false,
      productImages: [],
      category_name: "",
      fromRoute: "",
    };
  }

  componentDidMount() {
    const category_name = this.props.navigation.getParam("category_name");
    const title = this.props.navigation.getParam("title");
    const fromRoute = this.props.navigation.getParam("from_route");
    this.setState({
      category_name: category_name,
      title: title,
      fromRoute: fromRoute,
    });
    this.getMarketPlaceSubCategoriesAdvertProductViewAction();
  }

  async getMarketPlaceSubCategoriesAdvertProductViewAction() {
    this.setState({ loader: true });
    const product_id = this.props.navigation.getParam("product_id");
    let customer_id = await AsyncStorage.getItem("userid");
    let Token = await AsyncStorage.getItem("token");
    // console.log(customer_id);
    const requestData = {
      access_token: Token,
      current_user_id: customer_id,
      product_id: product_id,
    };
    // console.log(requestData);
    getMarketPlaceSubCategoriesAdvertProductView(requestData).then(
      function (responseJson) {
        // console.log(responseJson);
        if (responseJson.status == 1) {
          this.setState(
            {
              dataSource: responseJson.result,
              productImages: responseJson.result.product_image,
              loader: false,
            },
            function () {
              // this.arrayholder = responseJson.result;
            }
          );
        } else {
          this.setState({ loader: false });
          // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
        }
      }.bind(this)
    );
  }

  onRefresh() {
    this.setState({ loader: true, dataSource: [] });
    this.getMarketPlaceSubCategoriesAdvertProductViewAction();
  }


  /** To call directly from app */
  dialCall = (number) => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };


  render() {
    const { navigate } = this.props.navigation;
    const {
      dataSource,
      loader,
      productImages,
      category_name,
      title,
      fromRoute,
    } = this.state;
    if (!loader) {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* <Row style={{ marginTop: -20, height: 120 }}>
            <Image
              source={require("../../images/Header-Curv-Shape.png")}
              style={{ width: "100%", height: 100 }}
            />
            <Row style={styles.slide2Logo}>
              <TouchableOpacity
                style={{ alignItems: "center", padding: 20, width: 60 }}
                onPress={() => {
                  if (fromRoute == "MyAdvertList") {
                    navigate("MarketPlaceMyAdvertList");
                  } else {
                    // navigate to service order view screen
                    navigate("MarketPlaceAdsSubCategoryAdvertList");
                  }
                }}
              >
                <Col style={{ justifyContent: "center" }}>
                  <Back_Arrow width={15} height={15} />
                </Col>
              </TouchableOpacity>
              <Col style={styles.header}>
                {fromRoute == "MyAdvertList" ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#fff",
                      fontSize: 17,
                      fontFamily: "Roboto-Bold",
                    }}
                  >
                    
                    {t("My Ads")}
                  </Text>
                ) : (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#fff",
                      fontSize: 17,
                      fontFamily: "Roboto-Bold",
                    }}
                  >
                    {category_name}
                  </Text>
                )}
              </Col>
            </Row>
          </Row> */}
          
          <Row style={styles.headerContainer}>
              <View style={styles.top_background}>
                  <View style={styles.top_content}>
                      <TouchableOpacity style={styles.headerBackArrow} 
                        // onPress={() => navigate("MarketPlaceAdsSubCategory")}
                        onPress={() => {
                          if (fromRoute == "MyAdvertList") {
                            navigate("MarketPlaceMyAdvertList");
                          } else {
                            // navigate to service order view screen
                            navigate("MarketPlaceAdsSubCategoryAdvertList");
                          }
                        }}
                      >
                          <Col style={{ justifyContent: 'center' }}>
                              <Back_Arrow width={15} height={15} />
                          </Col>
                      </TouchableOpacity>
                      {/* <Col style={styles.header}> */}
              {/* <Text>{t("My Ads")}</Text> */}
                {fromRoute == "MyAdvertList" ? (
                  <Text
                    numberOfLines={1}
                    style={styles.headerText}
                  >
                    
                    {t("My Ads")}
                  </Text>
                ) : (
                  <Text
                    numberOfLines={1}
                    style={styles.headerText}
                  >
                    {category_name}
                  </Text>
                )}
              {/* </Col> */}
                  </View>
              </View>
          </Row>
          
            <View style={{ justifyContent: "center", alignItems: "center", marginHorizontal:20, marginTop:10 }}>
          {/* <Row style={{ height: 50, marginHorizontal: 20 }}>
            <Col style={{ justifyContent: "center", alignItems: "center" }}> */}
              <Text
                // numberOfLines={1}
                style={{
                  color: "#333",
                  fontSize: 25,
                  fontFamily: "Roboto-Medium",
                  textAlign:'center',
                  color: "#62BB46",
                }}
              >
                {title}
              </Text>
              </View>
            {/* </Col>
          </Row> */}
          <LinearGradient
            colors={["rgba(140,198,63,0.8)", "rgba(57, 181, 74,0.8)"]}
            start={{ x: 0.0, y: 1.0 }}
            end={{ x: 1.0, y: 1.0 }}
            style={{ marginHorizontal: 20 }}
          >
            <Row style={{ height: 2 }}></Row>
          </LinearGradient>
          <ScrollView>
          <Row
          style={{
            justifyContent: "center",
            alignItems: "center",
            // marginTop: 20,
            height:180
          }}
          >
            <SliderBox
              // ImageComponent={FastImage}
              images={productImages}
              disableOnPress={true}
              sliderBoxHeight={150}
              // onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
              dotColor="#62bb45"
              inactiveDotColor="#b2dea1"
              paginationBoxVerticalPadding={20}
              // autoplay
              circleLoop
              resizeMethod={"resize"}
              resizeMode={"cover"}
              paginationBoxStyle={{
                position: "absolute",
                bottom: -30,
                padding: 0,
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
                paddingVertical: 10,
              }}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                padding: 0,
                margin: 0,
                backgroundColor: "rgba(128, 128, 128, 0.92)",
              }}
              ImageComponentStyle={{
                borderRadius: 10,
                width: "75%",
                marginTop: 20,
                backgroundColor: "#fff",
              }}
              imageLoadingColor="#2196F3"
            />
          </Row>
          {/* <Row style={{ marginHorizontal: 20 }}>
            <TextInput
              style={{
                width: "100%",
                marginTop: 40,
                textAlign: "justify",
                height: 150,
                textAlignVertical: "top",
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 15,
                color: "#62bb45",
                backgroundColor: '#f8f8f8',
                fontSize: 16,
              }}
              multiline
              editable={false}
              numberOfLines={4}
              value={dataSource.product_description}
            ></TextInput>

            
          </Row> */}

      <Row style={{ marginTop: 30, marginBottom: 30, justifyContent:'center', marginHorizontal:20, backgroundColor: '#f8f8f8', paddingLeft: 15,
                paddingRight: 15, }}>
            {/* <Text style={{ fontFamily:'Roboto-Light', color: "#666666", fontSize:16 }}>{dataSource.post_content}</Text> */}
            <Text style={{ fontFamily: 'Roboto-Light', color: "#666666", fontSize: 16 }}>
                {dataSource.product_description }
            </Text>
        </Row>
          
          <TouchableOpacity onPress={() => this.dialCall(dataSource.mobile_number)}>
          <Row style={{ marginTop: '5%' }}>
            <Col style={styles.InputCol}>
              <TextInputMaterial
                label={
                  <Text style={{ fontFamily: "Roboto-Medium" }}>
                    {t("Call Now")}
                  </Text>
                }
                value={
                  dataSource.phone_code + " " + dataSource.mobile_number
                }
                editable={false}
                labelActiveColor={"#666666"}
                underlineColor={"#67c46a"}
                underlineActiveColor={"#67c46a"}
                onChangeText={(name) => this.setState({ name: name })}
              />
            </Col>
          </Row>
          </TouchableOpacity>
          </ScrollView>
        </View>
      );
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
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    textAlignVertical: "center",
  },
  slide2Logo: {
    ...Platform.select({
      ios: {
        position: "absolute",
        marginTop: 30,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 50,
      },
      android: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        height: 50,
        width: "100%",
        marginLeft: 50,
      },
    }),
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
    width: "100%",
    // borderRadius: 100,
    // marginLeft: 10,
    height: "100%",
  },
  newsItemContainer: {
    width: "100%",
    // margin:15,
    // marginRight:50,
    height: 150,
    backgroundColor: "white",
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 6.22,
    elevation: 5,
  },
  header: {
    ...Platform.select({
      ios: {
        marginLeft: 38,
      },
      android: {
        // marginLeft: 20
        marginLeft: (width / 100) * 10,
      },
    }),
  },
  InputCol: {
    marginHorizontal: 30,
    // marginLeft: 30,
  },
});
